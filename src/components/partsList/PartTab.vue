<template>
    <GroupTab v-if="isGroup" :partId="partId"/>
    <LayerTab v-else :partId="partId"/>
</template>

<script>
import LayerTab from './LayerTab.vue'
import GroupTab from './GroupTab.vue'
export default {
    name: 'PartTab',
    components: {
        GroupTab,
        LayerTab,
    },
    props: {
        partId: { required: true },
    },
    computed: {
        isGroup() {
            return !!this.$store.state.symbolart.parts[this.partId].children
        },
        selected() {
            return this.$store.state.symbolart.selected[this.partId]
        },
    },
    watch: {
        selected(isSelected) {
            if (isSelected) {
                this.$el.scrollIntoView({ block: 'nearest' })
            }
        },
    },
    
}
</script>

<style>

</style>

