<template>
    <div class="viewer_editor">
        <div id="viewer-content" class="limit_area">
            <div class="canvas_area">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    viewbox="0 0 768 384"
                    width="100%"
                    height="100%"
                >
                    <rect fill="white" x="0" y="0" width="100%" height="100%" />
                    <pattern
                        id="pattern24"
                        x="0"
                        y="0"
                        width="24"
                        height="24"
                        patternUnits="userSpaceOnUse"
                    >
                        <rect
                            fill="#cccccc"
                            x="0"
                            width="12"
                            height="12"
                            y="0"
                        />
                        <rect
                            fill="#cccccc"
                            x="12"
                            width="12"
                            height="12"
                            y="12"
                        />
                    </pattern>
                    <rect
                        fill="url(#pattern24)"
                        y="0"
                        x="0"
                        width="100%"
                        height="100%"
                    />
                </svg>
                <img class="reference_image" :src="backgroundImage" />
                <ViewCanvas class="canvas" />
            </div>
            <VertexEditor class="vert_editor" />
        </div>
    </div>
</template>

<script>
import ViewCanvas from './viewerEditor/ViewCanvas.vue'
import VertexEditor from './viewerEditor/VertexEditor.vue'

export default {
    name: 'ViewerEditor',
    mounted() {
        this.center()
    },
    components: {
        ViewCanvas,
        VertexEditor,
    },
    computed: {
        backgroundImage() {
            return this.$store.state.symbolart.referenceImage
        },
    },
    methods: {
        center() {
            let el = this.$el
            let content = document.getElementById('viewer-content')
            let xdiff = content.clientWidth - el.clientWidth
            let ydiff = content.clientHeight - el.clientHeight
            el.scroll(xdiff / 2, ydiff / 2)
        },
    },
}
</script>

<style>
.viewer_editor {
    background-color: #cccccc;
    overflow: scroll;
}
.limit_area {
    background-color: rgb(127, 127, 127);
    width: 1024px;
    height: 1024px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}
.canvas_area {
    width: 75%;
    height: 37.5%;
    position: relative;
    background-color: black;
}
.canvas {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    position: absolute;
}
.vert_editor {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    position: absolute;
}
</style>

<style scoped>
.reference_image {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    position: absolute;
}
</style>
