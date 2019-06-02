<template>
    <div class="shape_editor">
        <div
            class="shape_thumb"
            v-for="shape in shapeList"
            ref="shapes"
            :key="shape.type"
            :class="{ active: shape.type === layerShape }"
            v-on:click="updateShape(shape.type)"
        >
            <img class="shape_image" :src="shape.url" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'ShapeEditor',
    computed: {
        shapeList() {
            return this.$store.state.symbolart.shapeList
        },
        LayerId() {
            return this.$store.getters.selectedLayerId
        },
        layer() {
            return this.$store.state.symbolart.parts[this.LayerId]
        },
        layerShape() {
            return this.layer ? this.layer.type : null
        },
    },
    watch: {
        layerShape(shape) {
            if (shape == null) return
            if (shape < 512)
                this.$refs.shapes[shape].scrollIntoView({ block: 'nearest' })
            else
                this.$refs.shapes[shape - 512 + 325].scrollIntoView({
                    block: 'nearest',
                })
        },
    },
    methods: {
        updateShape(type) {
            if (!this.layer) {
                return
            }
            this.$store.commit('editPart', {
                id: this.LayerId,
                edits: { type },
                editType: 0b100,
            })
        },
    },
}
</script>

<style>
.shape_editor {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    overflow-y: scroll;
}
</style>

<style scoped>
.shape_thumb {
    isolation: isolate;
    width: 38px;
    height: 38px;
    background-color: rgb(255, 255, 255);
    box-sizing: border-box;
    border: 2px transparent;
    filter: invert(0);
}
.shape_thumb:hover {
    border: 2px solid rgba(255, 255, 255, 0.5);
    cursor: pointer;
}
.shape_image {
    background-color: black;
    width: 100%;
    height: 100%;
    background-blend-mode: color;
    mix-blend-mode: multiply;
    filter: invert(0);
}
.active {
    border: 2px solid rgb(72, 177, 177);
}
</style>
