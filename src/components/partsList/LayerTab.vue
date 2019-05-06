<template>
    <div class="layer_tab" v-on:click.stop.prevent="select" :class="{selected:selected}">
        <img class="image" :style="imageStyle">
        <div>{{name}}</div>
    </div>
</template>

<script>
export default {
    props: {id:{type:Number, required:true}},
    computed:{
        selected: function(){
            return this.$store.state.nodes[this.id].selected
        },
        part: function(){
            return this.$store.state.layers[this.id]
        },
        name: function(){
            return this.$store.state.nodes[this.id].name
        },
        imageStyle: function(){
            let p = this.part
            return {
                backgroundColor:'rgb('+p.r+','+p.g+','+p.b+','+p.a/255+')'
            }
        }
    },
    methods: {
        select: function(){
            this.$store.commit("select", this.id)
        },
    }
}
</script>

<style>
.layer_tab{
    background-color: #fcfcfc;
    height: 40px;
    margin: 1px;
    display: flex;
    align-items: center;
}
</style>

<style scoped>
.selected {
    color: white;
    background-color: lightskyblue;
}
.image{
    height:36px;
    width: 36px;
    margin-right: 4px;
    margin-left: 4px;
}
</style>
