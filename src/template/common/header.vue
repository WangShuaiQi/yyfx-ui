<template>
  <div class="app-header">
    <div class="logo">
      <img class="w-100" src="../../assets/images/header.png">
    </div>
  </div>

</template>

<script >
  export default {
    name: 'Header',
    data () {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    }
  }
</script>

<style lang='scss' scoped>
  .app-header{
    z-index: 1;
    position: relative;
    .logo {
      img {
        padding-left: 0px;
      }
    }
  }
</style>
