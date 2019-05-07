import sa_vs from './shader/sa_drawer.vs'
import sa_fs from './shader/sa_drawer.fs'
import post_vs from './shader/postprocessing.vs'
import post_fs from './shader/postprocessing.'
import texImage from '../../assets/symbols.png'

let textureImage = new Image()

let gl = undefined
let shaderProgram = {
    program: null,
    attributes: {},
    uniforms: {},
    arrays: {
        vertices: null,
        colors: null,
        texCoords: null,
        texChannels: null,
    },
}

let buffers = {}
let lenSymbols = 0

const initWebgl = canvas => {
    gl = canvas.getContext('webgl', { alpha: true })
    if (gl) {
        gl.clearColor(0.0, 0.0, 0.0, 0.0)
        gl.clearDepth(1.0)

        gl.disable(gl.DEPTH_TEST)
        gl.enable(gl.BLEND)
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
        //gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    }
    textureImage.src = texImage
    textureImage.onload = initBuffers
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

const initShader = () => {
    let vertexShader = compileShader(gl, vs, gl.VERTEX_SHADER)
    let fragmentShader = compileShader(gl, fs, gl.FRAGMENT_SHADER)
    let program = createProgram(gl, vertexShader, fragmentShader)
    shaderProgram.program = program
    shaderProgram.attributes = {
        vertexPositionAttribute: gl.getAttribLocation(
            shaderProgram.program,
            'aVertexPosition'
        ),
        vertexTexCoordAttribute: gl.getAttribLocation(
            shaderProgram.program,
            'aVertexTexCoord'
        ),
        vertexColorAttribute: gl.getAttribLocation(
            shaderProgram.program,
            'aVertexColor'
        ),
        vertexTexChannelAttribute: gl.getAttribLocation(
            shaderProgram.program,
            'aVertexTexChannel'
        ),
    }
    shaderProgram.uniforms = {
        pUniform: gl.getUniformLocation(shaderProgram.program, 'uPMatrix'),
        uTextureLoc: gl.getUniformLocation(shaderProgram.program, 'uTexture'),
    }
}

const initBuffers = () => {
    buffers = {
        vertices: gl.createBuffer(),
        colors: gl.createBuffer(),
        texCoords: gl.createBuffer(),
        texChannels: gl.createBuffer(),
        texture: gl.createTexture(),
    }

    gl.bindTexture(gl.TEXTURE_2D, buffers.texture)

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        textureImage
    )
    gl.bindTexture(gl.TEXTURE_2D, null)
}

const webgl = {
    init(canvas) {
        initWebgl(canvas)
        initShader()
        gl.useProgram(shaderProgram.program)
        gl.enableVertexAttribArray(
            shaderProgram.attributes.vertexPositionAttribute
        )
        gl.enableVertexAttribArray(
            shaderProgram.attributes.vertexTexCoordAttribute
        )
        gl.enableVertexAttribArray(
            shaderProgram.attributes.vertexTexChannelAttribute
        )
        gl.enableVertexAttribArray(
            shaderProgram.attributes.vertexColorAttribute
        )
    },
    changeCanvasSize(w, h) {
        //TODO: implement
        w=h
        return this
    },
    updateSymbols(symbols) {
        lenSymbols = symbols.length
        let numVertices = symbols.length * 6
        let vertices = []
        vertices.length = numVertices * 3
        let colors = []
        colors.length = numVertices * 4
        let texCoords = []
        texCoords.length = numVertices * 2
        let texChannels = []
        texChannels.length = numVertices

        for (let i = 0; i < symbols.length; i++) {
            let symbol = symbols[i]
            let v = i * 6 //index of first vertex
            vertices[i * 18] = symbol.ltx
            vertices[i * 18 + 1] = symbol.lty
            vertices[i * 18 + 2] = i
            vertices[i * 18 + 3] = symbol.rtx
            vertices[i * 18 + 4] = symbol.rty
            vertices[i * 18 + 5] = i
            vertices[i * 18 + 6] = symbol.lbx
            vertices[i * 18 + 7] = symbol.lby
            vertices[i * 18 + 8] = i
            vertices[i * 18 + 9] = symbol.rtx
            vertices[i * 18 + 10] = symbol.rty
            vertices[i * 18 + 11] = i
            vertices[i * 18 + 12] = symbol.lbx
            vertices[i * 18 + 13] = symbol.lby
            vertices[i * 18 + 14] = i
            vertices[i * 18 + 15] = symbol.rbx
            vertices[i * 18 + 16] = symbol.rby
            vertices[i * 18 + 17] = i

            //for grayscale ...
            let texCoord = {
                x: Math.floor((symbol.type % 64) / 4) / 1024,
                y: Math.floor(symbol.type / 64) / 512,
                channel: symbol.type % 4,
            }
            let dx = 64 / 1024
            let dy = 64 / 512
            texCoords[i * 12] = texCoord.x
            texCoords[i * 12 + 1] = texCoord.y
            texCoords[i * 12 + 2] = texCoord.x + dx
            texCoords[i * 12 + 3] = texCoord.y
            texCoords[i * 12 + 4] = texCoord.x
            texCoords[i * 12 + 5] = texCoord.y + dy
            texCoords[i * 12 + 6] = texCoord.x + dx
            texCoords[i * 12 + 7] = texCoord.y
            texCoords[i * 12 + 8] = texCoord.x
            texCoords[i * 12 + 9] = texCoord.y + dy
            texCoords[i * 12 + 10] = texCoord.x + dx
            texCoords[i * 12 + 11] = texCoord.y + dy

            for (let j = 0; j < 6; j++) {
                texChannels[v + j] = texCoord.channel
                colors[v * 4 + j * 4] = symbol.r
                colors[v * 4 + j * 4 + 1] = symbol.g
                colors[v * 4 + j * 4 + 2] = symbol.b
                colors[v * 4 + j * 4 + 3] = symbol.a
            }
        } //end for each symbol

        shaderProgram.arrays.vertices = new Float32Array(vertices)
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertices)
        gl.bufferData(
            gl.ARRAY_BUFFER,
            shaderProgram.arrays.vertices,
            gl.STATIC_DRAW
        )
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.colors)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.texCoords)
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(texCoords),
            gl.STATIC_DRAW
        )
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.texChannels)
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(texChannels),
            gl.STATIC_DRAW
        )
        return this
    },
    updateVertices(symbolIndex, symbol) {
        let v = symbolIndex * 18
        let vertices = shaderProgram.arrays.vertices
        vertices[v] = symbol.ltx
        vertices[v + 1] = symbol.lty

        vertices[v + 3] = symbol.rtx
        vertices[v + 4] = symbol.rty

        vertices[v + 6] = symbol.lbx
        vertices[v + 7] = symbol.lby

        vertices[v + 9] = symbol.rtx
        vertices[v + 10] = symbol.rty

        vertices[v + 12] = symbol.lbx
        vertices[v + 13] = symbol.lby

        vertices[v + 15] = symbol.rbx
        vertices[v + 16] = symbol.rby

        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertices)
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
        return this
    },
    updateColor(symbolIndex, color) {
        symbolIndex = color //TODO CHNAGE THIS
        return this
    },
    updateType(symbolIndex, type) {
        symbolIndex = type //TODO CHANGE THIS
        return this
    },
    draw() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertices)
        gl.vertexAttribPointer(
            shaderProgram.attributes.vertexPositionAttribute,
            3,
            gl.FLOAT,
            false,
            0,
            0
        )
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.texCoords)
        gl.vertexAttribPointer(
            shaderProgram.attributes.vertexTexCoordAttribute,
            2,
            gl.FLOAT,
            false,
            0,
            0
        )
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.texChannels)
        gl.vertexAttribPointer(
            shaderProgram.attributes.vertexTexChannelAttribute,
            1,
            gl.FLOAT,
            false,
            0,
            0
        )
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.colors)
        gl.vertexAttribPointer(
            shaderProgram.attributes.vertexColorAttribute,
            4,
            gl.FLOAT,
            false,
            0,
            0
        )

        gl.bindTexture(gl.TEXTURE_2D, buffers.texture)
        gl.uniform1i(shaderProgram.uniforms.uTextureLoc, 0)
        //gl.activeTexture(gl.TEXTURE0);

        gl.uniformMatrix4fv(shaderProgram.uniforms.pUniform, false, ortho)
        gl.drawArrays(gl.TRIANGLES, 0, lenSymbols * 6)
    },
}

export default webgl
