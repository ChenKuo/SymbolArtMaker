<template>
    <div class="dropdown_content" v-show="open">
        <div v-for="option in submenu.options" 
            :key="option.value||option"
            v-on:click.stop="onOptionClicked(option)"
            class="dropdown_item"
            :class="{active: optionOpen===option.value}"
        >
            <a> {{option.value||option}} </a>
            <a v-if="option.options">&#x23F5;</a>
            <DropdownContent class="sub_options" 
                v-if="option.options" 
                :open="optionOpen===option.value"
                :submenu="option"
                v-on:optionclick="propagateOptionClick"
            />
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
export default {
    name: 'DropdownContent',
    props: {
        submenu: Object,
        open: Boolean
    },
    data(){
        return{
            optionOpen: null
        }
    },
    watch:{
        open(opn){
            if(!opn){
                this.optionOpen = null
            }
        }
    },
    methods: {
        onOptionClicked(option){
            if(option.options){
                this.optionOpen = option.value===this.optionOpen? null: option.value
            }
            else{
                this.propagateOptionClick(option.value||option)
                this.optionOpen = null
            }
        },
        propagateOptionClick(optionValue){
            this.$emit('optionclick',this.submenu.value+'/'+optionValue)
        }
    }
}
</script>

 <style>
 .dropdown_content{
    position: absolute;
    z-index: 1;
    box-shadow: 4px 4px 4px 0px rgba(0,0,0,0.2);
    width: 200px;
    background-color: #ddd;
    display: flex;
    flex-direction: column;
}

.dropdown_item{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-left: 10px;
    padding-top: 4px;
    padding-bottom: 4px;
    height: 20px;
}
.dropdown_item:hover{
    background-color: #bbb;
}
.sub_options{
    left: 200px;
    top: 0;
}
 </style>
 <style scoped>
 .active{
     background-color: #bbb;
 }
 </style>
 