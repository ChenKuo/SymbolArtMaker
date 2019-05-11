<template>
    <div class="save_message" v-on:click="onClickSave">
        {{message}}
    </div>
</template>

<script>
export default {
    name: 'SaveMessage',
    data(){
        return{
            message: 'save changes'
        }
    },
    methods: {
        onClickSave(){
            this.message = "can't save yet"
        }
    }
}
</script>

<style>
.save_message {
    background-color: rgb(255, 255, 123);
    border: 1px solid orange;
    border-radius: 5px;
    padding-left: 2px;
    padding-right: 2px;
    margin-left: 10px;
}
</style>
