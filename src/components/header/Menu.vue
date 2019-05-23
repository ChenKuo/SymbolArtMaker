<template>
    <DropdownMenu :menu="menulist" id="menu" v-on:optionclick="onOption" />
</template>

<script>
import DropdownMenu from './dropDown/DropdownMenu.vue'

export default {
    name: 'Menu',
    components: {
        DropdownMenu,
    },
    data() {
        return {
            menulist: [
                {
                    value: 'File',
                    options: [
                        { value: 'Import from', options: ['.saml file'] },
                        'more will be added',
                    ],
                },
                {
                    value: 'Edit',
                    options: ['not implemented'],
                },
                {
                    value: 'View',
                    options: ['not implemented'],
                },
                {
                    value: 'Generator',
                    options: ['not implemented'],
                },
                {
                    value: 'Help',
                    options: ['sorry cant halp u'],
                },
            ],
        }
    },
    methods: {
        onOption(value) {
            switch (value) {
                case 'File/Import from/.saml file': {
                    const x = document.createElement('INPUT')
                    x.setAttribute('type', 'file')
                    x.click()
                    x.onchange = () =>
                        this.$store.dispatch('loadSamlFile', x.files[0])
                    break
                }
            }
        },
    },
}
</script>

<style>
#menu {
    height: 100%;
}
</style>
