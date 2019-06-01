<template>
    <div id="sa-title">
        <NameInput v-if="editingName" 
            :value="name"
            :id="id"
            v-on:finished="editingName=false"
            class="name" 
        />
        <div v-else v-on:click="editingName=true" class="name">
            {{ name }}
        </div>
    </div>
</template>

<script>
import NameInput from '@/components/partsList/NameInput.vue'
export default {
    name: 'SymbolArtTitle',
    components:{
        NameInput
    },
    data(){
        return {
            editingName: false,
            id: 0,
        }
    },
    computed:{
        name(){
            return this.$store.state.symbolart.parts[this.id].name
        }
    }
}
</script>

<style>
#sa-title {
    justify-content: center;
}
.name{
    width: 100%;
    height: 100%;
}
</style>
