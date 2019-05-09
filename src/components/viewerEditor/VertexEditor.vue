<template>
    <svg xmlns="http://www.w3.org/2000/svg"
		v-show="layer"
        v-on:mousedown="onDragStart"
        viewBox="-127 -127 255 255"
        transform="scale(1, -1)"
	>
        <g>
            <polygon 
                :points="[v.ltx,v.lty,v.rtx,v.rty,v.rbx,v.rby,v.lbx,v.lby].join(' ')"
                opacity="0"
                vert="lt rt rb lb"
			/>
	
			<line :x1="v.ltx" :y1="v.lty" :x2="v.rtx" :y2="v.rty" vert="lt rt"
				stroke-width="0.5" stroke="black"/>
			<line :x1="v.rtx" :y1="v.rty" :x2="v.rbx" :y2="v.rby" vert="rt rb"
				stroke-width="0.5" stroke="black" />
			<line :x1="v.rbx" :y1="v.rby" :x2="v.lbx" :y2="v.lby" vert="rb lb"
				stroke-width="0.5" stroke="black" />
			<line :x1="v.lbx" :y1="v.lby" :x2="v.ltx" :y2="v.lty" vert="lb lt"
				stroke-width="0.5" stroke="black" />

            <circle :cx="v.ltx" :cy="v.lty" r="1" class="point" vert="lt"/> 
            <circle :cx="v.rtx" :cy="v.rty" r="1" class="point" vert="rt"/>
            <circle :cx="v.rbx" :cy="v.rby" r="1" class="point" vert="rb"/>	
            <circle :cx="v.lbx" :cy="v.lby" r="1" class="point" vert="lb"/>	
        </g>
    </svg>
</template>

<script>
export default {
    name: 'VertexEditor',
    data () {
        return {
            dragStartX: null, //mouse position before drag
            dragStartY: null,
            verticesBeforeDrag: null, //copy of the vertices before dragging
            dragVertex: null,
            scale: 256/1024,
            updateReady: true
        }
    },
    computed: {
        layerId(){
            let selected = this.$store.state.selected
            if(selected.length === 1 && !selected[0].children)
                return selected[0]
            return null
        },
        layer(){
            return this.$store.state.parts[this.layerId]
        },
        // shortened for vertices
        v(){
            return this.layer||{}
        },
    },
    methods: {
        onDragStart(e){
            let vert = e.srcElement.getAttribute('vert')
            if(!vert) return
            
            this.dragVertex = vert.split(' ')
            this.dragStartX = e.x
            this.dragStartY = e.y
            let {lbx,lby, ltx, lty, rbx, rby, rtx,rty, ...rest} = this.layer
            this.verticesBeforeDrag = {lbx, lby, ltx, lty, rbx, rby, rtx, rty }
            document.addEventListener('mousemove', this.onDragging, false)
            document.addEventListener('mouseup', this.onDragEnd, false)
        },
        onDragging(e){
            if(this.updateReady){
                requestAnimationFrame(()=>{
                    let moveX=(e.x-this.dragStartX) * this.scale
                    let moveY=(this.dragStartY-e.y) * this.scale
                    let changedVertices = {}
                    for(let i = 0; i<this.dragVertex.length; i++){
                        let vertName = this.dragVertex[i]
                        changedVertices[vertName+'x'] = this.verticesBeforeDrag[vertName+'x'] + moveX
                        changedVertices[vertName+'y'] = this.verticesBeforeDrag[vertName+'y'] + moveY
                    }
                    this.$store.commit('editLayerVertices',{id: this.layerId, vertices: changedVertices})
                    this.updateReady = true
                })
                this.updateReady = false
            }
        },
        onDragEnd(){
            document.removeEventListener("mousemove", this.onDragging, false)
            document.removeEventListener("mouseup", this.onDragEnd, false)
        }
    }
}
</script>

<style>

</style>
