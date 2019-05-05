<template>
    <div class="cs_editor">
        <ColorEditor/>
    </div>
</template>

<script>
import ColorEditor from './colorEditor/ColorEditor.vue'

export default {
    name: 'ColorShapeEditor',
    components: {
        ColorEditor
    }
}
</script>

<style>
.cs_editor {
    background-color: #cccccc;
}
</style>
