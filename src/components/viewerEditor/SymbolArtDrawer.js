import sa_vs from './shader/sa_drawer.vs'
import sa_fs from './shader/sa_drawer.fs'
//import post_vs from './shader/postprocessing.vs'
//import post_fs from './shader/postprocessing.fs'

const MAX_LAYER_LEN = 360

const initWebgl = canvas => {
    let gl = canvas.getContext('webgl2', { alpha: true })
    if (gl) {
        gl.clearColor(0.0, 0.0, 0.0, 0.0)

        gl.disable(gl.DEPTH_TEST)
        gl.enable(gl.BLEND)
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
        gl.clear(gl.COLOR_BUFFER_BIT)
    }
    return gl
}

const compileShader = (gl, shaderSource, shaderType) => {
    let shader = gl.createShader(shaderType)
    gl.shaderSource(shader, shaderSource)
    gl.compileShader(shader)
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    if (!success) {
        throw 'could not compile shader:' + gl.getShaderInfoLog(shader)
    }
    return shader
}

const createProgram = (gl, vertexShader, fragmentShader) => {
    let program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    let success = gl.getProgramParameter(program, gl.LINK_STATUS)
    if (!success) {
        throw 'program filed to link:' + gl.getProgramInfoLog(program)
    }
    return program
}

const initShader = gl => {
    let vertexShader = compileShader(gl, sa_vs, gl.VERTEX_SHADER)
    let fragmentShader = compileShader(gl, sa_fs, gl.FRAGMENT_SHADER)
    let program = createProgram(gl, vertexShader, fragmentShader)
    return {
        program: program,
        attributes: {
            position: gl.getAttribLocation(program, 'position'),
            type: gl.getAttribLocation(program, 'type'),
            color: gl.getAttribLocation(program, 'color'),
            corner: gl.getAttribLocation(program, 'corner'),
        },
        uniforms: {
            texture: gl.getUniformLocation(program, 'myTextureSampler'),
        },
    }
}

class SymbolArtDrawer {
    constructor(canvas) {
        this.gl = null
        this.shaderProgram = null
        this.buffers = null
        this.init(canvas)
    }
    init(canvas) {
        let gl = initWebgl(canvas)
        this.gl = gl
        this.shaderProgram = initShader(gl)
        gl.useProgram(this.shaderProgram.program)
        this.initVAO()
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
    }
    resize(width, height) {
        let gl = this.gl
        if (gl.canvas.width !== width || gl.canvas.height !== height) {
            gl.canvas.width = width
            gl.canvas.height = height
            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
        }
    }
    updateVertices(vertices) {
        let gl = this.gl
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.vertices)
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
    }
    updateColors(colors) {
        let gl = this.gl
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.colors)
        gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW)
    }
    updateTypes(types) {
        let gl = this.gl
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.types)
        gl.bufferData(gl.ARRAY_BUFFER, types, gl.STATIC_DRAW)
    }
    initTexture(image) {
        let gl = this.gl
        gl.bindTexture(gl.TEXTURE_2D, this.buffers.texture)
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            image.width,
            image.height,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            image
        )
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.generateMipmap(gl.TEXTURE_2D)
    }
    initVAO() {
        let gl = this.gl
        let attr = this.shaderProgram.attributes
        let uni = this.shaderProgram.uniforms
        this.buffers = {
            vertices: gl.createBuffer(),
            colors: gl.createBuffer(),
            types: gl.createBuffer(),
            corners: gl.createBuffer(),
            indices: gl.createBuffer(),
            texture: gl.createTexture(),
        }
        let corners = new Uint8Array(MAX_LAYER_LEN * 4)
        let indices = new Uint16Array(MAX_LAYER_LEN * 6)
        for (let i = 0; i < MAX_LAYER_LEN; i++) {
            let os = i * 4
            corners.set([0, 1, 2, 3], os)
            indices.set([os, os + 1, os + 2, os + 2, os + 1, os + 3], i * 6)
        }
        gl.enableVertexAttribArray(attr.position)
        gl.enableVertexAttribArray(attr.color)
        gl.enableVertexAttribArray(attr.type)
        gl.enableVertexAttribArray(attr.corner)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.vertices)
        gl.vertexAttribIPointer(attr.position, 2, gl.BYTE, false, 0, 0)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.colors)
        gl.vertexAttribPointer(attr.color, 4, gl.UNSIGNED_BYTE, true, 0, 0)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.types)
        gl.vertexAttribIPointer(attr.type, 1, gl.UNSIGNED_SHORT, false, 0, 0)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.corners)
        gl.bufferData(gl.ARRAY_BUFFER, corners, gl.STATIC_DRAW)
        gl.vertexAttribIPointer(attr.corner, 1, gl.UNSIGNED_BYTE, false, 0, 0)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

        gl.activeTexture(gl.TEXTURE0 + 0)
        gl.bindTexture(gl.TEXTURE_2D, this.buffers.texture)
        gl.uniform1i(uni.texture, 0)
    }
    draw(n) {
        let gl = this.gl
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.drawElements(gl.TRIANGLES, n * 6, gl.UNSIGNED_SHORT, 0)
    }
}

export default SymbolArtDrawer
