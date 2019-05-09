<template>
    <div class="shape_editor">
        <div class="shape_thumb" 
            v-for="shape in shapeList" 
            :key="shape.type" 
            :class="{ active: shape.type === layerShape}" 
            v-on:click="updateShape(shape.type)">
            <img class="shape_image" :src="shape.url">
        </div>
    </div>
</template>

<script>
export default {
    name: "ShapeEditor",
    computed: {
        shapeList() {
            return this.$store.state.shapeList;
        },
        LayerId: function(){
            let selected = this.$store.state.selected
            if(selected.length === 1 && !selected[0].children)
                return selected[0]
            return null
        },
        layer: function(){
            return this.$store.state.parts[this.LayerId]
        },
        layerShape: function(){
            return this.layer? this.layer.type : null
        }
    },
    methods: {
        updateShape(type) {
            if(!this.layer){
                return
            }
            this.$store.commit('editLayerType',{id: this.LayerId, type})
        }
    }
}
</script>

<style>
.shape_editor{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    overflow-y: scroll;
}

</style>

<style scoped>
.shape_thumb{
    width: 38px;
    height: 38px;
    background-color: black;
}
.shape_thumb:hover{
    background-color: skyblue;
    cursor: pointer;
}
.shape_image{
    background-color:transparent;
    width: 100%;
    height: 100%;
}
</style>



