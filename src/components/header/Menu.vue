<template>
    <DropdownMenu :menu="menulist" id="menu" v-on:optionclick="onOption"/>
</template>

<script>
import DropdownMenu from './dropDown/DropdownMenu.vue'

export default {
    name: 'Menu',
    components: {
        DropdownMenu
    },
    data(){
        return{
            menulist: [
                {
                    value: 'File',
                    options: [
                        {value: 'import', options: ['saml']},
                        'more options will come'
                    ]
                },
                {
                    value: 'Edit',
                    options: ['edit option']
                },
                {
                    value: 'View',
                    options: ['view option']
                },
                {
                    value: 'Generator',
                    options: ['gen option']
                },
                {
                    value: 'Help',
                    options: ['sorry cant halp u']
                },
            ]
        }

    },
    methods: {
        onOption(value){
            switch(value){
                case 'File/import/saml':
                    
                    break;
            }
        }
    }
}
</script>

<style>

#menu{
    height: 100%;
}

</style>

