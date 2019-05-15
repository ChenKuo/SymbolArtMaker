<template>
    <div class="group_tab">
        <div class="group_handle">
            <CollapseImg class="collapse_img"/>
            <span>{{name}}</span>
            <input type='checkbox' />
        </div>
        <draggable v-model="children" class="group_content">
            <PartTab v-for="id in children" :key="id"/>
        </draggable>
    </div>
</template>
<script>
import draggable from 'vuedraggable'
import PartTab from './PartTab.vue'
import CollapseImg from '@/assets/play.svg'
export default {
    name:'GroupTab',
    components: {
        draggable,
        CollapseImg,
        PartTab
    },
    props: {
        id: {required: true}
    },
    computed: {
        group() {
            return this.$store.state.symbolart.parts[this.id]
        },
        name () {
            return this.group.name
        },
        children(){
                return this.group.children
        }
        
    }
    
}
</script>
<style>
.group_tab{
    display: flex;
    flex-direction: column;
    align-items: stretch;
}
.group_handle{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: #444;
    color: #ddd;
    height: 25px;
}
.collapse_img{
    width: 10px;
    height: 10px;
    fill: #ddd;
}
.group_content{
    display: flex;
    flex-direction: column;
}
</style>
