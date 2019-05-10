<template>
    <div class="cs_editor">
        <ColorEditor class="color_editor" />
        <ShapeEditor class="shape_editor" />
    </div>
</template>

<script>
import ColorEditor from './colorShapeEditor/ColorEditor.vue'
import ShapeEditor from './colorShapeEditor/ShapeEditor.vue'

export default {
    name: 'ColorShapeEditor',
    components: {
        ColorEditor,
        ShapeEditor,
    },
}
</script>

<style>
.cs_editor {
    background-color: #cccccc;
    display: flex;
    flex-direction: column;
}

.shape_editor {
    margin-top: 10px;
    flex: 1 1 0;
}
</style>
