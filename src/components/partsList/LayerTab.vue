<template>
    <div class="layer_tab"
        :class="{selected}"
    >
        <img class="image" :style="imageStyle" :src="imageSrc" />
        <NameInput v-if="editingName" 
            :value="name"
            :id="partId"
            v-on:finished="editingName=false"
            class="name" 
        />
        <div v-else v-on:dblclick="editingName=true" class="name">{{ name }}</div>
    </div>
</template>

<script>
import NameInput from './NameInput'
export default {
    components:{
        NameInput
    },
    props: { 
        partId: { type: Number, required: true } 
    },
    data(){
        return {
            editingName: false
        }
    },
    computed: {
        part() {
            return this.$store.state.symbolart.parts[this.partId]
        },
        name() {
            return this.part.name
        },
        selected() {
            return this.$store.state.symbolart.selected[this.partId]
        },
        imageStyle() {
            let p = this.part
            return {
                backgroundColor:
                    'rgb(' +
                    p.r +
                    ',' +
                    p.g +
                    ',' +
                    p.b +
                    ',' +
                    p.a / 255 +
                    ')',
            }
        },
        imageSrc() {
            let i =
                this.part.type >= 512
                    ? this.part.type - 512 + 325
                    : this.part.type
            return this.$store.state.symbolart.shapeList[i].url
        },
    },
}
</script>

<style>
.layer_tab {
    background-color: #fcfcfc;
    height: 40px;
    margin: 1px;
    display: flex;
    align-items: center;
}

</style>

<style scoped>
.image {
    height: 36px;
    width: 36px;
    margin-right: 4px;
    margin-left: 4px;
}
.name{
    width: 60%;
}
.selected {
    color: white;
    background-color: lightskyblue;
}
</style>
