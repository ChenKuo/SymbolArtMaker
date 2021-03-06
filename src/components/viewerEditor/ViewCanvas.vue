<template>
    <canvas></canvas>
</template>

<script>
import SymbolArtDrawer from './SymbolArtDrawer.js'

export default {
    name: 'ViewCanvas',
    created() {
        this.texture.src = './symbols.png'
    },
    mounted() {
        this.canvas = this.$el
        this.renderer = new SymbolArtDrawer(this.canvas)
        let self = this
        this.texture.onload = () => {
            self.renderer.initTexture(self.texture)
            self.createShapeList()
        }
    },
    data() {
        return {
            canvas: null,
            texture: new Image(),
            renderer: null,
            readyToRender: true,
            vertices: new Int8Array(225 * 8),
            colors: new Uint8Array(225 * 16),
            types: new Uint16Array(225 * 4),
        }
    },
    computed: {
        layers() {
            return this.$store.getters.layers
        },
        updateRequest() {
            return this.$store.state.symbolart.requestRenderUpdate
        },
    },
    watch: {
        layers(list) {
            if (this.readyToRender && list) {
                requestAnimationFrame(this.rebuildListandRender)
                this.readyToRender = false
            }
        },
        updateRequest(layersUpdated) {
            if (this.readyToRender && Object.keys(layersUpdated).length) {
                requestAnimationFrame(this.updateAndRender)
                this.readyToRender = false
            }
        },
    },
    methods: {
        rebuildListandRender() {
            const list = this.layers
            const lastIndex = list.length - 1
            for (let i = 0; i < list.length; i++) {
                let l = this.$store.state.symbolart.parts[list[lastIndex - i]]
                this.vertices.set(
                    [l.lbx, l.lby, l.ltx, l.lty, l.rbx, l.rby, l.rtx, l.rty],
                    i * 8
                )
                this.colors.set(
                    // eslint-disable-next-line prettier/prettier
                    [l.r, l.g, l.b, l.a, l.r, l.g, l.b, l.a, l.r, l.g, l.b, l.a, l.r, l.g, l.b, l.a],
                    i * 16
                )
                this.types.set([l.type, l.type, l.type, l.type], i * 4)
            }
            this.renderer.updateTypes(this.types)
            this.renderer.updateColors(this.colors)
            this.renderer.updateVertices(this.vertices)
            this.render()
        },
        updateAndRender() {
            let layersToUpdate = this.updateRequest
            let flags = 0b000
            let lastIndex = this.layers.length - 1
            const layerIndexOf = this.$store.getters.layerIndexOf
            for (let i in layersToUpdate) {
                let l = this.$store.state.symbolart.parts[i]
                let flag = layersToUpdate[i]
                let index = lastIndex - layerIndexOf[i]
                flags |= flag
                if (flag | 0b100) {
                    this.types.set([l.type, l.type, l.type, l.type], index * 4)
                }
                if (flag | 0b010) {
                    this.colors.set(
                        // eslint-disable-next-line prettier/prettier
                        [l.r, l.g, l.b, l.a, l.r, l.g, l.b, l.a, l.r, l.g, l.b, l.a, l.r, l.g, l.b, l.a],
                        index * 16
                    )
                }
                if (flag | 0b001) {
                    this.vertices.set(
                        [
                            l.lbx,
                            l.lby,
                            l.ltx,
                            l.lty,
                            l.rbx,
                            l.rby,
                            l.rtx,
                            l.rty,
                        ],
                        index * 8
                    )
                }
            }
            if (flags | 0b100) {
                this.renderer.updateTypes(this.types)
            }
            if (flags | 0b010) {
                this.renderer.updateColors(this.colors)
            }
            if (flags | 0b001) {
                this.renderer.updateVertices(this.vertices)
            }
            this.render()
        },
        render() {
            this.resize()
            this.renderer.draw(this.layers.length)
            this.readyToRender = true
            this.$store.commit('clearRenderUpdateRequest')
        },
        resize() {
            let canvas = this.canvas
            let displayWidth = canvas.clientWidth
            let displayHeight = canvas.clientHeight
            this.renderer.resize(displayWidth, displayHeight)
        },
        createShapeList() {
            let vertices = new Int8Array(360 * 8)
            let colors = new Uint8Array(360 * 16)
            let types = new Uint16Array(360 * 4)

            colors.fill(255)
            let row = 0
            let col = 0
            let lx, rx, ty, by
            for (let i = 0; i < 325; i++) {
                types.set([i, i, i, i], i * 4)
                // x(-96 to 96) y(-48 to 48) wh=6
                lx = 6 * col - 96
                rx = 6 * col + 6 - 96
                ty = 6 * row - 48
                by = 6 * row + 6 - 48
                vertices.set([lx, by, lx, ty, rx, by, rx, ty], i * 8)
                col++
                if (col === 32) {
                    col = 0
                    row++
                }
            }

            row = 11
            col = 0
            for (let i = 0; i < 34; i++) {
                let t = i + 512
                types.set([t, t, t, t], (i + 325) * 4)
                lx = 6 * col - 96
                rx = 6 * col + 6 - 96
                ty = 6 * row - 48
                by = 6 * row + 6 - 48
                vertices.set([lx, by, lx, ty, rx, by, rx, ty], (i + 325) * 8)
                col++
                if (col === 32) {
                    col = 0
                    row++
                }
            }

            this.renderer.updateTypes(types)
            this.renderer.updateColors(colors)
            this.renderer.updateVertices(vertices)
            this.renderer.resize(1024, 512)
            this.renderer.draw(359)

            let shapeList = []
            let offscreenCanvas = document.createElement('canvas')
            offscreenCanvas.width = 32
            offscreenCanvas.height = 32
            let ctx2d = offscreenCanvas.getContext('2d')
            row = 0
            col = 0
            for (let i = 0; i < 325; i++) {
                let sx = col * 32
                let sy = row * 32
                ctx2d.drawImage(this.canvas, sx, sy, 32, 32, 0, 0, 32, 32)
                let type = i
                let url = offscreenCanvas.toDataURL()
                shapeList.push({ type, url })
                ctx2d.clearRect(0, 0, 32, 32)
                col++
                if (col === 32) {
                    col = 0
                    row++
                }
            }
            row = 11
            col = 0
            for (let i = 0; i < 34; i++) {
                let sx = col * 32
                let sy = row * 32
                ctx2d.drawImage(this.canvas, sx, sy, 32, 32, 0, 0, 32, 32)
                let type = i + 512
                let url = offscreenCanvas.toDataURL()
                shapeList.push({ type, url })
                ctx2d.clearRect(0, 0, 32, 32)
                col++
                if (col === 32) {
                    col = 0
                    row++
                }
            }

            this.renderer.updateTypes(this.types)
            this.renderer.updateColors(this.colors)
            this.renderer.updateVertices(this.vertices)
            this.renderer.draw(0)
            this.$store.commit('setShapeList', { shapeList })
        },
    },
}
</script>

<style></style>
