<template>
  <div class="flex-container">
    <router-link to="/fractions" class="link-separator">fractions</router-link>
    <router-link to="/sockets">sockets</router-link>
  </div>
</template>

<script>
  export default {
    name: 'HelloWorld'
  }
</script>

<style scoped>
  .link-separator {
    margin-right: 20px;
  }
</style>
