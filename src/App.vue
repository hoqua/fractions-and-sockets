<template>
  <router-view>
    <div class="home-link-wrapper">
      <router-link to="/">home</router-link>
    </div>
  </router-view>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style>
  html, body {
    height: 100%;
  }

  body {
    margin: 0;
  }

  a {
    display: inline-block;
    background-color: red;
    box-shadow: 0 5px 0 darkred;
    color: white;
    padding: 1em 1.5em;
    position: relative;
    text-decoration: none;
    text-transform: uppercase;
  }

  a:hover {
    background-color: #ce0606;
    cursor: pointer;
  }

  a:active {
    box-shadow: none;
    top: 5px;
  }

  .flex-container {
    height: 100%;
    padding: 20px;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .home-link-wrapper {
    position: fixed;
    left: 20px;
    top: 20px;
  }

</style>
