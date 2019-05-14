<template>
    <div class="parts_list">
        <PartTab v-for="id in children" :key="id" :id="id" />
    </div>
</template>

<script>
import PartTab from './partsList/PartTab.vue'
export default {
    name: 'PartsList',
    components: {
        PartTab,
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
