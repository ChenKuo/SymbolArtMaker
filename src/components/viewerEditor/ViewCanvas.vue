<template>
    <canvas></canvas>
</template>

<script>
import webgl from '../js/webgl.js'

export default {
    name: ViewCanvas,
    mounted(){
        webgl.init(this.$el);
        webgl.changeCanvasSize(512,256);
    },
    data(){
        return{
            vertices: new Int8Array(225*8),
            colors: new Uint8Array(225*16),
            types: new Uint16Array(225*4)
        }
    },
    computed: {
        layerList(){
            return this.$store.state.layerList;
        },
        selectedPart(){
            let selected=this.$store.state.selected;
            if(selected==null)return{};
            return this.$store.state.parts[selected];
        },
        selectedIndex(){
            return this.layerList.indexOf(this.$store.state.selected);
        },
        selectedVertices(){
            let {ltx,lty,lbx,lby,rtx,rty,rbx,rby}=this.selectedPart;
            return {ltx,lty,lbx,lby,rtx,rty,rbx,rby};
        },
        selectedColor(){
            let {r,g,b,a}=this.selectedPart;
            return {r,g,b,a};
        },
        selectedType(){
            return this.selectedPart.type;
        }
    },
    watch: {
        layerList(list){
            let symbols=list.map(id=>this.$store.state.layers[id]);
            webgl.updateSymbols(symbols).draw();
        },
        selectedVertices(vertices){
            webgl.updateVertices(this.selectedIndex,vertices).draw();
        },
        selectedColor(color){
            webgl.updateColor(this.selectedIndex, color).draw();
        },
        selectedType(type){
            webgl.updateType(this.selectedIndex,type).draw();
        }
    }
}
</script>

<style>

</style>
