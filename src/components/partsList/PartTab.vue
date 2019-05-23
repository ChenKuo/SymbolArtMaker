<template>
    <GroupTab v-if="isGroup" :partId="partId" />
    <LayerTab v-else :partId="partId" />
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
    },
    methods: {
        onDragBegin() {},
    },
}
</script>
