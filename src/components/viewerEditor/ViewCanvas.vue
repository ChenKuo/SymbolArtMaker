<template>
    <canvas></canvas>
</template>

<script>
//import webgl from '../js/webgl.js'

export default {
    name: 'ViewCanvas',
    mounted(){
        //webgl.init(this.$el);
    },
    data(){
        return{
            readyToRender: true,      
            vertices: new Uint8Array(225 * 8),
            colors: new Uint8Array(225 * 16),
            types: new Uint16Array(225 * 4),

        }
    },
    computed: {
        rebuild(){
            return this.$store.state.requestRebuildList
        },
        updateColor(){
            return this.$store.state.requestUpdateColorLayers
        },
        updateVertices(){
            return this.$store.state.requestUpdateVerticesLayers
        },
        updateType(){
            return this.$store.state.requestUpdateTypeLayers
        }
    },
    watch: {
        rebuild(requested){
            if(this.readyToRender && requested) {
                requestAnimationFrame(this.rebuildListandRender)
            }
            this.readyToRender = false
        },
        updateColor(layers){
            if(this.readyToRender && layers.length){
                requestAnimationFrame(this.updateColorandRender)
            }
            this.readyToRender = false
        },
        updateVertices(layers){
            if(this.readyToRender && layers.length){
                requestAnimationFrame(this.updateVerticesandRender)
            }
            this.readyToRender = false
        },
        updateType(layers){
            if(this.readyToRender && layers.length) {
                requestAnimationFrame(this.updateTypeandRender)
            }
            this.readyToRender = false
        }

    },
    methods: {
        rebuildListandRender(){
            const updateArrays = (layerId, index) => {
                this.vertices.set(
                    [l.lbx, l.lby, l.ltx, l.lty, l.rbx, l.rby, l.rtx, l.rty],
                    index * 8
                )
                this.colors.set(
                    // eslint-disable-next-line prettier/prettier
                    [l.r, l.g, l.b, l.a, l.r, l.g, l.b, l.a, l.r, l.g, l.b, l.a, l.r, l.g, l.b, l.a],
                    index * 16
                )
                this.types.set(
                    [l.type, l.type, l.type, l.type],
                    index * 4
                )
            }
            DFT(0, this.$state.treeData, updateArrays)
            this.render()
            this.$store.commit(clearRebuildListRequest)
        },
        updateColorandRender(){
            let layers = this.$store.requestUpdateColorLayers
            for(let i = 0; i<layers.length; i++) {
                layers[i] //wut's the index...
            }
        },


        render(){

        }
    }
}


</script>

<style>

</style>
