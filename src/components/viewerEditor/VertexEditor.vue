<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        
        
        viewBox="-127 -127 255 255"
        transform="scale(1, 1)"
        v-on:mousedown.self="selectLayerHit"
    >
        <g v-show="layer"
            v-on:mousedown="onDragStart"
            v-on:wheel.stop.prevent="selectNextLayerHit">
            <polygon
                :points="
                    [
                        v.ltx,
                        v.lty,
                        v.rtx,
                        v.rty,
                        v.rbx,
                        v.rby,
                        v.lbx,
                        v.lby,
                    ].join(' ')
                "
                opacity="0"
                vert="lt rt rb lb"
            />

            <line
                :x1="v.ltx"
                :y1="v.lty"
                :x2="v.rtx"
                :y2="v.rty"
                vert="lt rt"
                class ="line"
                
            />
            <line
                :x1="v.rtx"
                :y1="v.rty"
                :x2="v.rbx"
                :y2="v.rby"
                vert="rt rb"
                class ="line"
            />
            <line
                :x1="v.rbx"
                :y1="v.rby"
                :x2="v.lbx"
                :y2="v.lby"
                vert="rb lb"
                class ="line"
            />
            <line
                :x1="v.lbx"
                :y1="v.lby"
                :x2="v.ltx"
                :y2="v.lty"
                vert="lb lt"
                class ="line"
            />

            <circle :cx="v.ltx" :cy="v.lty" class="point" vert="lt" />
            <circle :cx="v.rtx" :cy="v.rty" class="point" vert="rt" />
            <circle :cx="v.rbx" :cy="v.rby" class="point" vert="rb" />
            <circle :cx="v.lbx" :cy="v.lby" class="point" vert="lb" />
        </g>
    </svg>
</template>

<script>
export default {
    name: 'VertexEditor',
    data() {
        return {
            editId: null,
            dragStartX: null, //mouse position before drag
            dragStartY: null,
            verticesBeforeDrag: null, //copy of the vertices before dragging
            dragVertex: null,
            scale: 256 / 1024,
            updateReady: true,
        }
    },
    computed: {
        layerId() {
            let selected = this.$store.getters.selected
            if (selected.length === 1)
                return selected[0]
            return null
        },
        layer() {
            return this.$store.state.symbolart.parts[this.layerId]
        },
        // shortened for vertices
        v() {
            return this.layer || {}
        },
        layers() {
            return this.$store.getters.layers
        }
    },
    methods: {
        onDragStart(e) {
            let vert = e.srcElement.getAttribute('vert')
            if (!vert) return
            this.editId = this.layerId
            this.dragVertex = vert.split(' ')
            this.dragStartX = e.x
            this.dragStartY = e.y
            let { lbx, lby, ltx, lty, rbx, rby, rtx, rty } = this.layer
            this.verticesBeforeDrag = { lbx, lby, ltx, lty, rbx, rby, rtx, rty }
            document.addEventListener('mousemove', this.onDragging, false)
            document.addEventListener('mouseup', this.onDragEnd, false)
        },
        onDragging(e) {
            if (this.updateReady) {
                requestAnimationFrame(() => {
                    let moveX = (e.x - this.dragStartX) * this.scale
                    let moveY = (e.y - this.dragStartY) * this.scale
                    let changedVertices = {}
                    for (let i = 0; i < this.dragVertex.length; i++) {
                        let vertName = this.dragVertex[i]
                        changedVertices[vertName + 'x'] =
                            this.verticesBeforeDrag[vertName + 'x'] + moveX
                        changedVertices[vertName + 'y'] =
                            this.verticesBeforeDrag[vertName + 'y'] + moveY
                    }
                    this.$store.commit('continuousEdit', {
                        id: this.editId,
                        edits: changedVertices,
                        editType: 0b001
                    })
                    this.updateReady = true
                })
                this.updateReady = false
            }
        },
        onDragEnd(e) {
            requestAnimationFrame(()=>{
                let moveX = (e.x - this.dragStartX) * this.scale
                let moveY = (e.y - this.dragStartY) * this.scale
                let changedVertices = {}
                for (let i = 0; i < this.dragVertex.length; i++) {
                    let vertName = this.dragVertex[i]
                    changedVertices[vertName + 'x'] =
                        this.verticesBeforeDrag[vertName + 'x'] + moveX
                    changedVertices[vertName + 'y'] =
                        this.verticesBeforeDrag[vertName + 'y'] + moveY
                }
                this.$store.commit('finishEdit', {
                    id: this.editId,
                    edits: changedVertices,
                    editType: 0b001
                })
            })
            document.removeEventListener('mousemove', this.onDragging, false)
            document.removeEventListener('mouseup', this.onDragEnd, false)
        },
        selectLayerHit(e, from=-1, dir = -1){
            if(!this.layers) return
            let clientRect = this.$el.getBoundingClientRect()
            let x = (e.pageX - clientRect.left - 512)*(256/1024)
            let y = (e.pageY - clientRect.top -512)*(256/1024)
            from = this.layers.length + from
            for(let i =0; i<this.layers.length; i++){
                //check if x,y lies inside the layer
                let j = (from + i*dir)%this.layers.length
                let id = this.layers[j]
                let l = this.$store.state.symbolart.parts[id]
                if(pointInTriangle(x, y, l.lbx, l.lby, l.ltx, l.lty, l.rbx, l.rby)
                    ||pointInTriangle(x, y, l.rbx, l.rby, l.ltx, l.lty, l.rtx, l.rty)){
                        this.$store.commit('select', id)
                        return
                    }
            }
        },
        selectNextLayerHit(e){
            let dir = - Math.sign(e.deltaY)
            this.selectLayerHit(e,this.layer.index+dir, +dir)
        }
    },
}

const pointInTriangle = (px, py, p0x, p0y, p1x, p1y, p2x, p2y) => {
    let Area = 0.5 *(-p1y*p2x + p0y*(-p1x + p2x) + p0x*(p1y - p2y) + p1x*p2y)
    let sign = Math.sign(Area)
    let s = (p0y*p2x - p0x*p2y + (p2y - p0y)*px + (p0x - p2x)*py) * sign
    let t = (p0x*p1y - p0y*p1x + (p0y - p1y)*px + (p1x - p0x)*py) * sign
     return s>0 && t>0 && (s+t) < 2*Area*sign
}

</script>

<style>
.point{
    r: 1;
    stroke: white;
    stroke-width: 0.5;
    fill: black;
}
.line{
    stroke-width: 0.5;
    stroke: black;
    stroke-dasharray: 1 1;
}
</style>
