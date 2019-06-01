<template>
    <input type="text" :value="value" class="textinput" 
        v-on:keydown="edit"
        v-on:change="edit"
        v-on:blur="edit"
        ref="editname"
    />
</template>

<script>
export default {
    props: {
        value:{type:String},
        id:{required:true}
    },
    mounted() {
        this.$el.select()
    },
    methods:{
        edit(e){
            if( e.type == 'blur' || e.type == 'change' || e.key == 'Enter') {
                const name = e.target.value || "no name"
                if(this.value != name){
                    this.$store.commit('editPart', {
                        id:this.id, 
                        edits:{name}, 
                        editType:0
                    })
                }
                this.$emit('finished')
            }
        }
    }
}
</script>

<style>
.textinput{
    font-family: inherit;
    font-size: inherit;
    text-align: inherit;
}
</style>
