<template>
    <div class="group_tab">
        <div class="group_handle">
            <CollapseImg class="collapse_img" />
            <span>{{ name }}</span>
            <input type="checkbox" />
        </div>
        <ChildPartsList
            :partId="partId"
            v-show="expanded"
            class="group_content"
        />
    </div>
</template>

<script>
import CollapseImg from '@/assets/play.svg'
export default {
    name: 'GroupTab',
    data() {
        return {
            expanded: true,
        }
    },
    components: {
        ChildPartsList: () => import('./ChildPartsList.vue'),
        CollapseImg,
    },
    props: {
        partId: { required: true },
    },
    computed: {
        group() {
            return this.$store.state.symbolart.parts[this.partId]
        },
        name() {
            return this.group.name
        },
    },
}
</script>
<style>
.group_tab {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    border-left: 3px solid #444;
    border-bottom: 2px solid #444;
}
.group_handle {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: #444;
    color: #ddd;
    height: 25px;
}
.collapse_img {
    width: 10px;
    height: 10px;
    fill: #ddd;
}
.group_content {
    display: flex;
    flex-direction: column;
    background-color: #ddd;
    padding-left: 3px;
}
</style>
