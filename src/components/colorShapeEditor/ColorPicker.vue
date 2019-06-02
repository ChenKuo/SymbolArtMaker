<template>
    <svg
        id="colorpicker"
        :width="size"
        :height="size"
        viewBox="-1 -1 2 2"
        transform="scale(1,-1)"
    >
        <defs>
            <pattern
                id="sat-lum-mask"
                patternUnits="userSpaceOnUse"
                x="0.95"
                y="1"
                width="1.9"
                height="1.5"
            >
                <image
                    :href="satLumMask"
                    x="0"
                    y="0"
                    width="1.9"
                    height="1.5"
                    preserveAspectRatio="none"
                />
            </pattern>
            <pattern
                id="hue-pattern"
                patternUnits="userSpaceOnUse"
                x="1"
                y="1"
                width="2"
                height="2"
            >
                <image :href="hueImg" x="0" y="0" width="2" height="2" />
            </pattern>
        </defs>

        <g v-on:mousedown="beginDragHue">
            <circle class="hue-wheel" stroke="url(#hue-pattern)" />
            <circle
                class="hue-picker-inner"
                :style="huePickerStyle"
                :class="{ active: editingHue }"
            />
            <circle
                class="hue-picker-outer"
                :style="huePickerStyle"
                :class="{ active: editingHue }"
            />
        </g>
        <circle class="blocker" />
        <g class="hsl-triangle" v-on:mousedown="beginDragSatLum">
            <polygon
                ref="triangle"
                :points="a"
                transform="scale(0.84)"
                :fill="hueColor"
                class="hue"
            />
            <polygon
                :points="a"
                transform="scale(0.84)"
                fill="url(#sat-lum-mask)"
                class="sl"
            />
            <g :transform="transformSatLum">
                <circle
                    cx="0"
                    cy="0"
                    class="sl-picker-inner"
                    :class="{ active: editingSatLum }"
                />
                <circle
                    cx="0"
                    cy="0"
                    class="sl-picker-outer"
                    :class="{ active: editingSatLum }"
                />
            </g>
        </g>
    </svg>
</template>

<script>
import { HCLToRGB, RGBToHCL } from './rgb-hsl'
// this component emits 'color-change' and 'finish-edit'
export default {
    props: {
        size: { type: Number },
        value: { type: Object },
    },
    data() {
        return {
            currentHCL: { h: 0, c: 1, l: 0.5 },
            currentRGB: { r: 255, g: 0, b: 0 },
            satLumMask: '',
            hueImg: '',
            a: '0,1 0.8660254,-0.5 -0.8660254,-0.5',
            animationFrame: true,
            editingHue: false,
            editingSatLum: false,
        }
    },
    computed: {
        rgb: {
            get() {
                return this.value
            },
            set(rgb) {
                this.$emit('color-change', rgb)
            },
        },
        hcl: {
            get() {
                const v = this.rgb
                const c = this.currentRGB
                if (c.r === v.r && c.g === v.g && c.b === v.b) {
                    return this.currentHCL
                }
                let hcl = RGBToHCL(v)
                if (v.r === v.g && v.g === v.b) {
                    hcl.h = this.currentHCL.h
                }
                return hcl
            },
            set(hcl) {
                this.currentHCL = hcl
                const rgb = HCLToRGB(hcl)
                this.currentRGB = rgb
                this.rgb = rgb
            },
        },
        hsl() {
            const { h, c, l } = this.hcl
            let s = 0
            if (0 < l && l < 1) {
                s = c / (1 - Math.abs(2 * l - 1))
            }
            return { h, s, l }
        },
        hueColor() {
            return 'hsl(' + this.hsl.h + ', 100%, 50%)'
        },
        huePickerStyle() {
            const rad = (2 * Math.PI * this.hcl.h) / 360
            const r = 0.92
            const x = r * Math.cos(rad)
            const y = r * Math.sin(rad)
            return {
                cx: x,
                cy: y,
            }
        },
        transformSatLum() {
            const { c, l } = this.hcl
            const x = (l - 0.5) * 1.455
            const y = (c - 0.5) * 1.26 + 0.21
            return 'translate(' + x + ',' + y + ')'
        },
    },
    methods: {
        beginDragHue(e) {
            document.addEventListener('mousemove', this.onDragHue, false)
            document.addEventListener('mouseup', this.doneDragHue, false)
            this.editingHue = true
            this.onDragHue(e)
        },
        onDragHue(e) {
            if (this.animationFrame) {
                this.animationFrame = false
                requestAnimationFrame(() => {
                    const boundingBox = this.$el.getBoundingClientRect()
                    const offsetX = e.clientX - boundingBox.x
                    const offsetY = e.clientY - boundingBox.y
                    const x = offsetX - 0.5 * this.size
                    const y = offsetY - 0.5 * this.size
                    const deg = (Math.atan2(y, x) * 180) / Math.PI
                    const h = deg <= 0 ? -deg : 360 - deg
                    const { c, l } = this.hcl
                    this.hcl = { h, c, l }
                    this.animationFrame = true
                })
            }
        },
        doneDragHue() {
            document.removeEventListener('mousemove', this.onDragHue, false)
            document.removeEventListener('mouseup', this.doneDragHue, false)
            this.editingHue = false
            this.$emit('finish-edit', this.currentRGB)
        },
        beginDragSatLum(e) {
            document.addEventListener('mousemove', this.onDragSatLum, false)
            document.addEventListener('mouseup', this.doneDragSatLum, false)
            this.editingSatLum = true
            this.onDragSatLum(e)
        },
        onDragSatLum(e) {
            if (this.animationFrame) {
                this.animationFrame = false
                requestAnimationFrame(() => {
                    const boundingBox = this.$refs.triangle.getBoundingClientRect()
                    const x = (e.clientX - boundingBox.left) / boundingBox.width
                    const y =
                        (boundingBox.bottom - e.clientY) / boundingBox.height
                    const c = Math.max(0, Math.min(y, 1))
                    const minL = c / 2
                    const maxL = 1 - c / 2
                    const l = Math.max(minL, Math.min(x, maxL))
                    this.hcl = { h: this.hcl.h, c, l }
                    this.animationFrame = true
                })
            }
        },
        doneDragSatLum() {
            document.removeEventListener('mousemove', this.onDragSatLum, false)
            document.removeEventListener('mouseup', this.doneDragSatLum, false)
            this.editingSatLum = false
            this.$emit('finish-edit', this.currentRGB)
        },
    },
    mounted() {
        let size = this.size
        let r = 0.45 * size
        let canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        let ctx = canvas.getContext('2d')
        ctx.lineWidth = 0.1 * size
        const pi = Math.PI
        const N = 32
        let x1 = r,
            y1 = 0,
            deg1 = 0,
            rad1 = 0
        // from 0 to 2pi
        for (let i = 1; i <= N; i++) {
            let rad2 = i * (2 / N) * pi
            let deg2 = (i / N) * 360
            let x2 = r * Math.cos(rad2) + 0.5 * size
            let y2 = r * Math.sin(rad2) + 0.5 * size
            let grad = ctx.createLinearGradient(x1, y1, x2, y2)
            grad.addColorStop(0, 'hsl(' + deg1 + ', 100%, 50%)')
            grad.addColorStop(1, 'hsl(' + deg2 + ', 100%, 50%)')
            ctx.strokeStyle = grad
            ctx.beginPath()
            ctx.arc(0.5 * size, 0.5 * size, r, rad1, rad2 + 0.01)
            ctx.stroke()
            x1 = x2
            y1 = y2
            deg1 = deg2
            rad1 = rad2
        }
        this.hueImg = canvas.toDataURL()
        //triangle
        const res = Math.floor(0.84 * this.size * 0.5)
        const slCanvas = document.createElement('canvas')
        const slctx = slCanvas.getContext('2d')
        slCanvas.width = res
        slCanvas.height = res
        const buffer = slctx.createImageData(res, res)
        for (let x = 0; x < res; x++) {
            const l = x / (res - 1)
            for (let y = 0; y < res; y++) {
                const chroma = y / (res - 1)
                const s = chroma / (2 * Math.min(l, 1 - l))
                let a = 1 - 2 * Math.min(l * s, (1 - l) * s)
                let c = a > 0 ? (2 * l - 1 + a) * (0.5 / a) : 0
                a *= 255
                c *= 255
                buffer.data.set([c, c, c, a], 4 * (y * res + x))
            }
        }
        slctx.putImageData(buffer, 0, 0)
        this.satLumMask = slCanvas.toDataURL()
    },
}
</script>

<style>
#colorpicker {
    background-color: transparent;
}
.hue-wheel {
    fill: transparent;
    stroke-width: 8%;
    cx: 0;
    cy: 0;
    r: 46%;
}
.blocker {
    fill: transparent;
    stroke-width: 0;
    cx: 0;
    cy: 0;
    r: 42%;
}
.hsl-triangle {
    isolation: isolate;
}
.hue {
    mix-blend-mode: hue;
}
.sat {
    mix-blend-mode: saturation;
}
.lum {
    mix-blend-mode: luminosity;
}
.sl-picker-inner {
    r: 2%;
    fill: transparent;
    stroke: black;
    stroke-width: 0.02;
    opacity: 0.4;
}
.sl-picker-outer {
    r: 3%;
    fill: transparent;
    stroke: white;
    stroke-width: 0.021;
    opacity: 0.6;
}
.hue-picker-inner {
    r: 0.05;
    fill: transparent;
    stroke: black;
    stroke-width: 0.02;
    opacity: 0.4;
}
.hue-picker-outer {
    r: 0.07;
    fill: transparent;
    stroke: white;
    stroke-width: 0.02;
    opacity: 0.6;
}
</style>
<style scoped>
.active {
    opacity: 1;
}
</style>
