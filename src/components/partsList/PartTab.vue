<template>
    <GroupTab v-if="isGroup" :id="id"/>
    <LayerTab v-else :id="id"/>
</template>

<script>
export default {
    name: 'PartTab',
    components: {
        GroupTab: () => import('./GroupTab.vue'),
        LayerTab: () => import('./LayerTab.vue')
    },
    props: {
        id : {required: true}
    },
    computed: {
        isGroup() {
            return !!this.$store.state.parts[this.id].children
        }
    },
    methods:{
        onDragBegin(){
            
        },
    }
}
</script>

