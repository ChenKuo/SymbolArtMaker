<template>
    <div
        class="layer_tab"
        v-on:click.stop.prevent="select"
        :class="{ selected: selected }"
    >
        <img class="image" :style="imageStyle" :src="imageSrc" />
        <div>{{ name }}</div>
    </div>
</template>

<script>
export default {
    props: { id: { type: Number, required: true } },
    computed: {
        selected() {
            return this.$store.state.symbolart.selected[this.id]
        },
        part() {
            return this.$store.state.symbolart.parts[this.id]
        },
        name() {
            return this.part.name
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
    watch:{
        selected(isSelected){
            if(isSelected){
                this.$el.scrollIntoView({ block:'nearest'})
            }
        }
    },
    methods: {
        select() {
            this.$store.commit('select', this.id)
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
.selected {
    color: white;
    background-color: lightskyblue;
}
.image {
    height: 36px;
    width: 36px;
    margin-right: 4px;
    margin-left: 4px;
}
</style>
