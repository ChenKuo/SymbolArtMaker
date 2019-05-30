<template>
    <div class="color_editor">
        <ColorPicker
            :value="color"
            @color-change="updateColor"
            @finish-edit="finishUpdateColor"
            :size="200"
        />
        <div id="alpha-editor">
            <svg
                id="alpha-bg"
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                viewbox="0 0 192 24"
            >
                <rect fill="white" x="0" y="0" width="100%" height="24" />
                <pattern
                    id="pattern"
                    x="0"
                    y="0"
                    width="12"
                    height="12"
                    patternUnits="userSpaceOnUse"
                >
                    <rect fill="gray" x="0" width="6" height="6" y="0" />
                    <rect fill="gray" x="6" width="6" height="6" y="6" />
                </pattern>
                <g>
                    <rect
                        fill="url(#pattern)"
                        y="0"
                        x="0"
                        width="192"
                        height="24"
                    />
                    <rect
                        :fill="colorCode"
                        opacity="0.125"
                        y="0"
                        x="0"
                        width="24"
                        height="24"
                    />
                    <rect
                        :fill="colorCode"
                        opacity="0.25"
                        y="0"
                        x="24"
                        width="24"
                        height="24"
                    />
                    <rect
                        :fill="colorCode"
                        opacity="0.375"
                        y="0"
                        x="48"
                        width="24"
                        height="24"
                    />
                    <rect
                        :fill="colorCode"
                        opacity="0.5"
                        y="0"
                        x="72"
                        width="24"
                        height="24"
                    />
                    <rect
                        :fill="colorCode"
                        opacity="0.625"
                        y="0"
                        x="96"
                        width="24"
                        height="24"
                    />
                    <rect
                        :fill="colorCode"
                        opacity="0.75"
                        y="0"
                        x="120"
                        width="24"
                        height="24"
                    />
                    <rect
                        :fill="colorCode"
                        opacity="0.875"
                        y="0"
                        x="144"
                        width="24"
                        height="24"
                    />
                    <rect
                        :fill="colorCode"
                        opacity="1"
                        y="0"
                        x="168"
                        width="24"
                        height="24"
                    />
                </g>
            </svg>
            <input
                type="range"
                min="1"
                max="8"
                :value="alpha"
                @input="updateAlpha"
                id="alpha-slider"
            />
        </div>
    </div>
</template>

<script>
import ColorPicker from './ColorPicker.vue'
export default {
    name: 'ColorEditor',
    components: {
        ColorPicker,
    },
    data(){
        return {
            selfColor: {r:255, g:0, b:0}
        }
    },
    computed: {
        id() {
            let selected = this.$store.getters.selected
            if (selected.length === 1) return selected[0]
            return null
        },
        layer() {
            return this.id && this.$store.state.symbolart.parts[this.id]
        },
        color() {
            let l = this.layer
            if (!l) {
                return this.selfColor
            }
            return {r:l.r, g:l.g, b:l.b}
        },
        colorCode() {
            let {r, g, b} = this.color
            return 'rgb('+r+','+g+','+b+')'
        },
        alpha() {
            let l = this.layer
            if (!l) {
                return 8
            }
            return (this.layer.a + 1) / 32
        },
    },
    methods: {
        updateColor(color) {
            if (!this.layer) {
                this.selfColor = color
                return
            }
            this.$store.commit('continuousEdit', {
                id: this.id,
                edits: color,
                editType: 0b010,
            })
        },
        updateAlpha(e) {
            if (!this.layer) {
                return
            }
            let a = +e.srcElement.value * 32 - 1
            this.$store.commit('editPart', {
                id: this.id,
                edits: { a },
                editType: 0b010,
            })
        },
        finishUpdateColor(color){
            if (!this.layer) {
                this.selfColor = color
                return
            }
            this.$store.commit('finishEdit', {
                id: this.id,
                edits: color,
                editType: 0b010,
            })
        }
    },
}
</script>

<style>
.color_editor {
    display: flex;
    flex-direction: column;
    align-items: center;
}
#alpha-editor {
    position: relative;
    width: 192px;
    height: 24px;
}
#alpha-bg {
    width: 100%;
    height: 100%;
}
#alpha-slider {
    width: 100%;
    height: 100%;
    -webkit-appearance: none; /* Override default CSS styles */
    appearance: none;
    width: 192px; /* Full-width */
    height: 24px; /* Specified height */
    background: transparent; /* Grey background */
    outline: none; /* Remove outline */
    opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
    -webkit-transition: 0.2s; /* 0.2 seconds transition on hover */
    transition: opacity 0.2s;
    position: absolute;
    top: 0;
    left: 0;
    padding: 0;
    margin: 0;
}
#alpha-slider:hover {
    opacity: 1; /* Fully shown on mouse-over */
}
#alpha-slider::-webkit-slider-thumb {
    -webkit-appearance: none; /* Override default look */
    appearance: none;
    width: 24px;
    height: 24px;
    background: transparent;
    border: 2px solid white;
    outline: 2px solid black;
    cursor: pointer;
}
#alpha-slider::-moz-range-thumb {
    width: 24px;
    height: 24px;
    background: transparent;
    border: 2px solid white;
    outline: 2px solid black;
    cursor: pointer;
}
</style>

<style scoped></style>
