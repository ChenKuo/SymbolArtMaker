<template>
    <div class="menu" v-on:click.stop.prevent="">
        <div v-for="menuItem in menu" :key="menuItem.value">
            <button class="dropdown_btn" v-on:click="open=menuItem.value"> {{menuItem.value}} </button>
            <DropdownContent 
                v-if="menuItem.options" 
                :submenu="menuItem" 
                :open="open===menuItem.value"
                v-on:optionclick="propagateOptionClick"
            />
        </div>
    </div>
</template>

<script>
import DropdownContent from './DropdownContent.vue'
export default {
    mounted(){
        document.body.addEventListener('click',this.close)
    },
    components: {
        DropdownContent
    },
    props: {
        menu: Array,
    },
    data(){
        return {
            open: null
        }
    },
    methods: {
        close(){
            this.open = null
        },
        propagateOptionClick(optionValue){
            this.$emit('optionclick',optionValue)
        }
    }
}
</script>

<style>
.menu {
    display: flex;
    flex-direction: row;
}

.dropdown_btn {
    display: inline-block;
    flex: 0 1 auto;
    padding: 8px;
    cursor: pointer;
    border: none;
    margin: 0;
    height: 100%;
}
.dropdown_btn:hover {
    background-color: #bbb;
}

</style>

