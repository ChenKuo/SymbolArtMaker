<template>
    <div class="menu">
        <div class="topic"> File </div>
        <div class="topic"> Edit </div>
        <div class="topic"> View </div>
        <div class="topic"> Generator </div>
        <div class="topic"> Help </div>
    </div>
</template>

<script>
export default {
    name: 'Menu',
}
</script>

<style>

.menu {
    display: flex;
    flex-direction: row;
}
.topic {
    flex: 0 0 auto;
    padding: 8px;
}
.topic:hover {
    background-color: gray;
}
</style>

