<template>
    <DropdownMenu :menu="menulist" id="menu" v-on:optionclick="onOption" />
</template>

<script>
import DropdownMenu from './dropDown/DropdownMenu.vue'
import convert from 'xml-js'

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
                    x.onchange = () => {
                        const reader = new FileReader()
                        reader.onload = e => this.loadSAR(e.target.result)
                        reader.readAsText(x.files[0])
                    }
                    break
                }
            }
        },
        loadSAR(sar) {
            let options = { compact: true, ignoreDeclaration: true }
            let symbolArt = convert.xml2js(sar, options).sa
            this.$store.commit('loadSymbolArt', symbolArt)
        },
    },
}
</script>

<style>
#menu {
    height: 100%;
}
</style>
