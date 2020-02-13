<template>
  <div class="app-footer">
    <!--<p> zhangxin@chinacloud.com.cn </p>-->
  </div>
</template>
<script>
  export default {
    name: 'Footer',
    data(){
      return {};
    }

  }
</script>
<style lang="scss" scoped>

  .app-footer {
    min-width: 1000px;
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1005;

    p{
      text-align: center;
      margin: 0;
    }
  }

</style>
