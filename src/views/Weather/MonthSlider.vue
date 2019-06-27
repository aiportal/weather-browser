<template>
  <div class="month_slider">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-slider
          :min="sliderOptions.yearMin"
          :max="sliderOptions.yearMax"
          v-model="year"
          show-stops
          :step="1"
        ></el-slider>
      </el-col>
      <el-col :span="18">
        <el-slider
          :min="1"
          :max="12"
          v-model="months"
          range
          show-stops
        ></el-slider>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import WeatherMeta from './weather-meta';
import dayjs from 'dayjs';
import _ from 'lodash';

@Component
export default class MonthSlider extends Vue {

  year: number = dayjs().year();
  months: number[] = [6, 6];

  get sliderOptions() {
    return {
      yearMin: dayjs(WeatherMeta.minMonth).year(),
      yearMax: dayjs(WeatherMeta.maxMonth).year(),
    }
  }

}
</script>

<style scoped>
  .month_slider {
    margin: 10px 50px 15px 50px;
  }
</style>
