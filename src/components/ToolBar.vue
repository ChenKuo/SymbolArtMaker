<template>
    <div class="toolbar">
        <div class="edit_buttons">
            <AddImg class="logo" v-on:click="addLayer" />
            <GroupImg class="logo" />
            <UndoImg class="logo" v-on:click="undo"/>
            <RedoImg class="logo" v-on:click="redo"/>
            <DeleteImg class="logo" v-on:click="deleteLayer" />
        </div>
        <div class="view_buttons">
            <PictureImg class="logo" />
            <OpacityImg class="logo" />
            <CubeImg class="logo" />
            <SquareImg class="logo" />
            <ZoomoutImg class="logo" />
            <ZoominImg class="logo" />
        </div>
        <div class="gen_buttons">
            <BotImg class="logo" />
            <SettingImg class="logo" />
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
    methods: {
        addLayer() {
            this.$store.commit('addLayer')
        },
        deleteLayer(){
            let selected = this.$store.state.selected
            if(selected.length === 1)
                this.$store.commit('deleteLayer', selected[0])
        },
        undo(){
            this.$store.commit('undo')
        },
        redo(){
            this.$store.commit('redo')
        }
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

.logo {
    width: 30px;
    height: 30px;
    margin-right: 10px;
    opacity: 0.6;
}
.logo:hover {
    opacity: 1;
}
</style>

<style scoped></style>
