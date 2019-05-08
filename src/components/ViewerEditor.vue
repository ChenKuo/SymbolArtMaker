<template>
    <div class="viewer_editor">
        <div class="limit_area">
            <div class="canvas_area">
                <svg xmlns="http://www.w3.org/2000/svg" v-show="false" version="1.1" viewbox="0 0 768 384" width="100%" height="100%">
                    <rect fill="white" x="0" y="0" width="100%" height="100%"/>
                    <pattern id="pattern24"
                            x="0" y="0" width="24" height="24"
                            patternUnits="userSpaceOnUse">
                        <rect fill="#cccccc" x="0" width="12" height="12" y="0"/>
                        <rect fill="#cccccc" x="12" width="12" height="12" y="12"/>
                    </pattern>
                    <rect fill="url(#pattern24)" y="0" x="0" width="100%" height="100%"/>
                </svg>
                <ViewCanvas class="canvas"></ViewCanvas>
            </div>
        </div>
    </div>
</template>

<script>
import ViewCanvas from './viewerEditor/ViewCanvas.vue'

export default {
    name: 'ViewerEditor',
    components: {
        ViewCanvas
    }
}
</script>

<style>
.viewer_editor {
    background-color: #cccccc;
    overflow: scroll;
}
.limit_area {
    background-color: rgb(127,127,127);
    width: 1024px;
    height: 1024px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.canvas_area {
    width: 75%;
    height: 37.5%;
    position: relative;
    background-color: black;
}
.canvas {
    top:0;
    left:0;
    width: 100%;
    height: 100%;
    position: absolute;
}
</style>
