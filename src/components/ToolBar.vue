<template>
    <div class="toolbar">
        <div class="edit_buttons">
            <img src="./../assets/add.svg">
            <img src="./../assets/group.svg">
            <img src="./../assets/undo.svg">
            <img src="./../assets/redo.svg">
            <img src="./../assets/trash.svg">
        </div>
        <div class="view_buttons">
            <img src="./../assets/picture.svg">
            <img src="./../assets/opacity.svg">
            <img src="./../assets/cube.svg">
            <img src="./../assets/square.svg">
            <img src="./../assets/zoomout.svg">
            <img src="./../assets/zoomin.svg">
        </div>
        <div class="gen_buttons">
            <img src="./../assets/bot.svg">
            <img src="./../assets/setting.svg">
        </div>

    </div>
</template>

<script>
export default {
    name: 'ToolBar',
}
</script>

<style>
.toolbar {
    background-color: #cccccc;
    border-bottom: 1px solid #aaaaaa;
    display: flex;
    align-items: center;
}
.toolbar>div {
    border-right: 3px solid #bbbbbb;
    padding-left: 10px;
    padding-right: 10px;
    margin-right: 10px;
    display: flex;
    align-items: center;
}

.toolbar img {
    width: 30px;
    height: 30px;
    margin-right: 10px;
    opacity: 0.6;
}
.toolbar img:hover{
    opacity: 1;
}
</style>

<style scoped>

</style>

