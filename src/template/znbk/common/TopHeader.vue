<template>
  <section id="topHeader">
    <div class="left">
        <span>成都赞美医药销量分析系统</span>
    </div>
    <div class="right">
        <div></div> 
        <span @click="exit"><i class="fa fa-power-off"></i></span>
    </div>
  </section>
</template>

<script>
export default {
  name: "TopHeader",
  methods: {
    exit() {
      window.open("http://80.205.2.199:7070/", "_self");
    }
  }
};
</script>

<style lang="scss">
#topHeader {
  height: 100%;
  border-bottom: 1px solid #c8c8c8;
  display: flex;
  .left {
    flex: 30%;
    margin-left: 1.5rem;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    height: 100%;
    background-image: url("/static/znbk/img/logo.png");
    background-repeat: no-repeat;
    background-position: left center;
    background-size: 40px;
    padding-left: 40px;
    span {
      font-family: SimHei;
      font-size: 1.2rem;
      font-weight: 600;
      color: #323232;
      margin-left: 1rem;
    }
  }
  .right {
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    height: 100%;
    div {
      color: #989da1;
      font-size: 1rem;
      margin-right: 1rem;
      padding: 0 2rem;
      border-right: 1px solid #c8c8c8;
      cursor: pointer;
      display: flex;
      -ms-flex-align: center;
      align-items: center;
      height: 100%;
      a {
        color: #989da1;
        text-decoration: none;
      }
    }
    i {
      color: #0eb7eb;
      font-size: 1.8rem;
      margin-right: 1rem;
      cursor: pointer;
    }
  }
}
</style>
