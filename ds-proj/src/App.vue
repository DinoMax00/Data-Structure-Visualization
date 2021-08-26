<template>
  <router-view/>
  <Particles id="tsparticles" :options="particles"/>
</template>

<script>
import particles from './particles.json'
export default {
  name: 'App',
  setup () {
    return {
      particles
    }
  }
}
</script>

<style>
#app {
    font-family: helvetica;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
}
#tsparticles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #2c3e50;
  z-index: -10;
}
</style>
