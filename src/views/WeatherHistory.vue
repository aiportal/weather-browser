<template>
  <div>
    <WeatherCitySelect/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import WeatherCitySelect from '~/components/WeatherCitySelect/index.vue';

@Component
export default class WeatherHistory extends Vue {

}
</script>

<style scoped>

</style>
