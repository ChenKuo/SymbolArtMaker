<template>
    <draggable v-model="children" class="parts_list">
        <PartTab v-for="id in children" :key="id" :id="id" />
    </draggable>
</template>

<script>
import draggable from 'vuedraggable'
import PartTab from './partsList/PartTab.vue'
export default {
    name: 'PartsList',
    components: {
        draggable,
        PartTab,
    },
    computed: {
        children:{
            get(){
                return this.$store.state.treeData
            },
            set(children){
                this.$store.commit('setGroupChildren',{id:null,children})
            }
        },
    },
    methods: {},
}
</script>

<style>
.parts_list {
    background-color: #cccccc;
    overflow: scroll;
}
</style>
