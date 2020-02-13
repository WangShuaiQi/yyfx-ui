<template>
  <div class="pgis">
    <div :id="id" class="pgis-map" ref="pgis-map"></div>
  </div>
</template>

<script>
  import PgisInit from './PgisInit'
  export default {
    name: "PgisComponent",
    props:{
      id:{
        default:'pgis-map',
        type:String
      }
    },
    data(){
      return {
      }
    },
    async mounted(){
      await PgisInit.loadScript();
      this.mapInstance = new PgisMapApp().loadMap(this.id);
    },
    methods:{
      getMapInstance(){
        return this.mapInstance;
      }
    }

  };
</script>

<style lang="scss" scoped>
  .pgis{
    height: 100%;
    width: 100%;
    .pgis-map{
      height: 100%;
      width: 100%;
    }
  }
</style>
