<template>
    <ChildPartsList :partId="0" class="sa_tree" />
</template>

<script>
import ChildPartsList from './partsList/ChildPartsList.vue'
export default {
    name: 'PartsList',
    components: {
        ChildPartsList,
    },
}
</script>

<style>
.sa_tree {
    background-color: #cccccc;
    overflow: scroll;
}
</style>
