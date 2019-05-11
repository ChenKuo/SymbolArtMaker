<template>
    <div class="parts_list">
        <LayerTab v-for="id in children" :key="id" :id="id" />
    </div>
</template>

<script>
import LayerTab from './partsList/LayerTab.vue'
export default {
    name: 'PartsList',
    components: {
        LayerTab,
    },
    computed: {
        children: function() {
            // TODO: implement this properly when group is supported
            return this.$store.state.treeData.map(x => x.id).reverse()
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
