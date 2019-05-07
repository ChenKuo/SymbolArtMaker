<template>
    <canvas></canvas>
</template>

<script>
import SymbolArtDrawer from './SymbolArtDrawer.js'

export default {
    name: 'ViewCanvas',
    mounted(){
        SymbolArtDrawer.init(this.$el);
        let vertices = new Int8Array(360 * 8)
        let colors = new Uint8Array(360 * 16)
        let types = new Uint8Array(360 * 4)
       
        colors.fill(255)
        let row = 0
        let col = 0
        for(let i = 0; i<325; i++){
            types.set([i,i,i,i],i*4)
            // x(-96 to 96) y(-48 to 48) wh=6
            lx = 6 * col - 96
            rx = 6 * col + 6 - 96
            ty = 6 * row + 48
            by = 6 * row - 6 + 48
            vertices.set([lx,by,lx,ty,rx,by,rx,ty],i*8)
            col++
            if(col === 32){
                col = 0
                row++
            }
        }

        row = 11
        col = 0
        for(let i=0; i<34; i++){
            let t = i + 512
            types.set([t,t,t,t],(i+325)*4)
            lx = 6 * col - 96
            rx = 6 * col + 6 - 96
            ty = 6* row + 48
            by = 6 * row - 6 + 48
            vertices.set([lx,by,lx,ty,rx,by,rx,ty],(i+325)*8)
            col++
            if(col === 32){
                col = 0
                row++
            }
        }
        SymbolArtDrawer.Render(types,colors,vertices, 359)
    },
    data(){
        return{
            readyToRender: true,      
            vertices: new Int8Array(225 * 8),
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
