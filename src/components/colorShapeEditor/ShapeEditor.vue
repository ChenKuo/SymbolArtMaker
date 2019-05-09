<template>
    <div class="shape_editor">
        <div class="shape_thumb" v-for="shape in shapeList" :key="shape.type">
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
            //return [...Array(360)].map((x,index)=>({type:index, src:""}))
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



