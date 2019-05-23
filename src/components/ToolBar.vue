<template>
    <div class="toolbar">
        <div class="edit_buttons">
            <button class="toolbar-btn" v-on:click="addLayer"><AddImg /></button>
            <button class="toolbar-btn" v-on:click="addGroup"><GroupImg /></button>
            <button class="toolbar-btn" v-on:click="undo" :disabled="undoEmpty"><UndoImg /></button>
            <button class="toolbar-btn" v-on:click="redo" :disabled="redoEmpty"><RedoImg /></button>
            <button class="toolbar-btn" v-on:click="deletePart" :disabled="!selected.length"><DeleteImg /></button>
        </div>
        <div class="view_buttons">
            <button class="toolbar-btn" disabled><PictureImg /></button>
            <button class="toolbar-btn" disabled><OpacityImg /></button>
            <button class="toolbar-btn" disabled><CubeImg /></button>
            <button class="toolbar-btn" disabled><SquareImg /></button>
            <button class="toolbar-btn" disabled><ZoomoutImg /></button>
            <button class="toolbar-btn" disabled><ZoominImg /></button>
        </div>
        <div class="gen_buttons">
            <button class="toolbar-btn" disabled><BotImg /></button>
            <button class="toolbar-btn" disabled><SettingImg /></button>
        </div>
    </div>
</template>

<script>
import AddImg from './../assets/add.svg'
import GroupImg from './../assets/group.svg'
import UndoImg from './../assets/undo.svg'
import RedoImg from './../assets/redo.svg'
import DeleteImg from './../assets/trash.svg'
import PictureImg from './../assets/picture.svg'
import OpacityImg from './../assets/opacity.svg'
import CubeImg from './../assets/cube.svg'
import SquareImg from './../assets/square.svg'
import ZoomoutImg from './../assets/zoomout.svg'
import ZoominImg from './../assets/zoomin.svg'
import BotImg from './../assets/bot.svg'
import SettingImg from './../assets/setting.svg'

export default {
    name: 'ToolBar',
    components: {
        AddImg,
        GroupImg,
        UndoImg,
        RedoImg,
        DeleteImg,
        PictureImg,
        OpacityImg,
        CubeImg,
        SquareImg,
        ZoomoutImg,
        ZoominImg,
        BotImg,
        SettingImg,
    },
    computed: {
        selected() {
            return this.$store.getters.selected
        },
        undoEmpty(){
            return !this.$store.state.symbolart.undoStack.length
        },
        redoEmpty(){
            return !this.$store.state.symbolart.redoStack.length
        }
    },
    methods: {
        addLayer() {
            let selectedId = this.selected[0]
            let parent = this.$store.getters.parentOf[selectedId] || 0
            let index = this.$store.getters.indexOf[selectedId] || 0
            this.$store.commit('addLayer', { parent, index })
        },
        addGroup() {
            let selectedId = this.selected[0]
            let parent = this.$store.getters.parentOf[selectedId] || 0
            let index = this.$store.getters.indexOf[selectedId] || 0
            this.$store.commit('addGroup', { parent, index })
        },
        deletePart() {
            if (this.selected.length === 1) {
                let selectedId = this.selected[0]
                let parent = this.$store.getters.parentOf[selectedId] || 0
                let index = this.$store.getters.indexOf[selectedId] || 0
                this.$store.commit('deletePart', { parent, index })
            }
        },
        undo() {
            this.$store.commit('undo')
        },
        redo() {
            this.$store.commit('redo')
        },
    },
}
</script>

<style>
.toolbar {
    background-color: #cccccc;
    border-bottom: 1px solid #aaaaaa;
    display: flex;
    align-items: center;
}
.toolbar > div {
    border-right: 3px solid #bbbbbb;
    padding-left: 10px;
    padding-right: 10px;
    margin-right: 10px;
    display: flex;
    align-items: center;
}

.toolbar-btn {
    width: 30px;
    height: 30px;
    margin: 0;
    margin-right: 10px;
    opacity: 0.6;
    -webkit-appearance: none;
    -moz-appearance: none;
    display: inline-block;
    border: none;
    background: transparent;
    padding: 0;
}
.toolbar-btn:hover {
    opacity: 1;
}
.toolbar-btn:focus {
    outline: 0;
}
.toolbar-btn:enabled:active{
    transform: scale(1.1);
}
.toolbar-btn:disabled{
    opacity: 0.2;
}
</style>

<style scoped></style>
