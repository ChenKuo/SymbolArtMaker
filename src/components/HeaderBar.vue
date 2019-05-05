<template>
    <div class="header">
        <div>
            <Menu/>
            <SaveMessage/>
        </div>
            <SymbolArtTitle/>
            <Logo/>
    </div>
</template>

<script>
import Menu from './header/Menu.vue'
import SaveMessage from './header/SaveMessage.vue'
import SymbolArtTitle from './header/SymbolArtTitle.vue'
import Logo from './header/Logo.vue'

export default {
    name: 'HeaderBar',
    components: {
        Menu,
        SaveMessage,
        SymbolArtTitle,
        Logo
    }
}
</script>

<style>
.header {
    background-color: #eeeeee;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}
.header>div{
    flex: 1 1;
    display: flex;
    align-items: center;
}

</style>
