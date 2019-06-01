<template>
    <div ref="draggable" class="draggable_area" :partId="partId">
        <PartTab v-for="id in children" :key="id" :partId="id" v-on:click.native.stop="select(id)"/>
    </div>
</template>

<script>
import Sortable from 'sortablejs'
import PartTab from './PartTab.vue'
export default {
    name: 'ChildPartsList',
    mounted() {
        Sortable.create(this.$refs.draggable, {
            onUpdate: this.moveParts,
            onAdd: this.moveParts,
            group: 'nested',
            invertSwap: true,
            swapThreshold: 1,
            direction: 'vertical',
            fallbackOnBody: true,
            emptyInsertThreshold: 5,
        })
    },
    props: {
        partId: { required: true },
    },
    components: {
        PartTab,
    },
    computed: {
        children() {
            return this.$store.state.symbolart.parts[this.partId].children
        },
    },
    methods: {
        moveParts(e) {
            let parentOld = e.from.getAttribute('partId')
            let parentNew = e.to.getAttribute('partId')
            let indexOld = e.oldIndex
            let indexNew = e.newIndex
            this.$store.commit('movePart', {
                parentOld,
                indexOld,
                parentNew,
                indexNew,
            })
            return false
        },

        select(id) {
            this.$store.commit('select', id)
        },

    },
}
</script>

<style>
.draggable_area {
    min-height: 20px;
    display: flex;
    flex-direction: column;
}
</style>
