<template>
    <svg xmlns="http://www.w3.org/2000/svg"
		v-show="layer"
		>
        <g>
            <polygon 
                :points="[v.ltx,v.lty,v.rtx,v.rty,v.rbx,v.rby,v.lbx,v.lby].join(' ')"
                opacity="0"
                v-on:mousedown="onDragStart(true,true,true,true)"
                tag="lt rt rb lb"
			/>
	
			<line :x1="v.ltx" :y1="v.lty" :x2="v.rtx" :y2="v.rty" 
                v-on:mousedown="onDragStart(true, true, false, false)" tag="lt rt"
				stroke-width="2" stroke="black"/>
			<line :x1="v.rtx" :y1="v.rty" :x2="v.rbx" :y2="v.rby" 
                v-on:mousedown="onDragStart(false, true, true, false)" tag="rt rb"
				stroke-width="2" stroke="black" />
			<line :x1="v.rbx" :y1="v.rby" :x2="v.lbx" :y2="v.lby" 
                v-on:mousedown="onDragStart(false, false, true, true)" tag="rb lb"
				stroke-width="2" stroke="black" />
			<line :x1="v.lbx" :y1="v.lby" :x2="v.ltx" :y2="v.lty" 
                v-on:mousedown="onDragStart(true, false, false, true)" tag="lb lt"
				stroke-width="2" stroke="black" />
	
            <circle :cx="v.ltx" :cy="v.lty" r="3" 
                v-on:mousedown="onDragStart(true, false, false, false)" tag="lt"/> 
            <circle :cx="v.rtx" :cy="v.rty" r="3" 
                v-on:mousedown="onDragStart(false, true, false, false)" tag="rt"/>
            <circle :cx="v.rbx" :cy="v.rby" r="3" 
                v-on:mousedown="onDragStart(false, false, true, false)" tag="rb"/>	
            <circle :cx="v.lbx" :cy="v.lby" r="3" 
                v-on:mousedown="onDragStart(false, false, false, true)" tag="lb"/>	
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
            partBeforeDrag: null //copy of the vertices of the  part before dragging
        }
    },
    computed: {
        layerId: function(){
            let selected = this.$store.state.selected
            if(selected.length === 1 && !selected[0].children)
                return selected[0]
            return null
        },
        layer: function(){
            return this.$store.state.parts[this.layerId]
        },
    },
    methods: {
        onDragStart(lt, rt, rb, lb){
            document.addEventListener("mousemove", this.onDragging, false)
            document.addEventListener("mouseup", this.onDragEnd, false)
            this.dragStartX = e.x
            this.dragStartY = e.y
            this.partBeforeDrag
        },
        onDragging(e){
            let moveX=e.x-this.dragStartX;
			let moveY=e.y-this.dragStartY;
        },
        onDragEnd(){
            this.dragElement = null
            document.removeEventListener("mousemove", this.onDragging, false)
            document.removeEventListener("mouseup", this.onDragEnd, false)
        }
    }
}
</script>

<style>

</style>
