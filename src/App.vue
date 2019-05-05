<template>
    <div id="app">
        <HeaderBar id="header" />
        <ToolBar id="top" />
        <PartsList id="left" />
        <ViewerEditor id="middle" />
        <ColorShapeEditor id="right" />
        <FooterBar id="footer" />
    </div>
</template>

<script>
import HeaderBar from './components/HeaderBar.vue'
import ToolBar from './components/ToolBar.vue'
import PartsList from './components/PartsList.vue'
import ViewerEditor from './components/ViewerEditor.vue'
import ColorShapeEditor from './components/ColorShapeEditor.vue'
import FooterBar from './components/FooterBar.vue'

export default {
    name: 'app',
    components: {
        HeaderBar,
        ToolBar,
        PartsList,
        ViewerEditor,
        ColorShapeEditor,
        FooterBar,
    },
}
</script>

<style>
html,
body {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    border: 0;
    outline: 0;
    font-size: 100%;
    vertical-align: baseline;
    background: transparent;
    display: inline-block;
    overflow: hidden;
}

#app {
    position: fixed;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    color: #2c3e50;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
}

::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}
::-webkit-scrollbar-track {
    background: rgba(119, 119, 119, 0.315);
    border-radius: 4px;
}
::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.24);
    border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
    background: rgb(0, 0, 0, 0.8);
}
</style>

<style scoped>
#app {
    display: inline-grid;
    grid-template-columns: 200px 1fr 200px;
    grid-template-rows: 40px 40px 1fr 20px;
    grid-template-areas:
        'h h h'
        't t t'
        'l m r'
        'f f f';
}
#header {
    grid-area: h;
}
#top {
    grid-area: t;
}
#left {
    grid-area: l;
}
#middle {
    grid-area: m;
}
#right {
    grid-area: r;
}
#footer {
    grid-area: f;
}
</style>
