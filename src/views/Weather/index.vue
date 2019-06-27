<template>
  <div>
    
    <CitySelect v-model="cities"></CitySelect>
    
    <el-date-picker
      placeholder="请选择月份"
      type="month"
      v-model="month"
      :picker-options="monthOptions"
    ></el-date-picker>

    <el-button v-on:click="loadWeatherData">比较</el-button>

    <MonthSlider
      class="month_slider"
    ></MonthSlider>

    <LineChart
      title="历史天气比较"
      :dates="chartDates"
      :series="chartSeries"
    ></LineChart>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component'
import _ from 'lodash';
import dayjs from 'dayjs';

import WeatherMeta from './weather-meta';
import CitySelect from './CitySelect.vue';
import MonthSlider from './MonthSlider.vue';
import LineChart from './LineChart.vue';

@Component({
  components: {
    CitySelect,
    MonthSlider,
    LineChart,
  }
})
export default class Weather extends Vue {
  private cities: string[] = [];
  private month: Date = new Date();
  private chartDates: string[] = [];
  private chartSeries: any[] = [];

  get monthOptions() {
    return {
      disabledDate: (time: Date): boolean =>
        dayjs(time).isBefore(WeatherMeta.minMonth, 'M') ||
        dayjs(time).isAfter(WeatherMeta.maxMonth, 'M'),
    }
  }

  async loadWeatherData() {
    const dates: string[] = [];
    const series: any[] = [];

    for (const city of this.cities) {
      const {days, stat} = await WeatherMeta.queryWeatherData(city, this.month);
      if (_.isEmpty(dates)) {
        dates.push(..._.map(days, 'ymd'));
      }
      const serialMin = {
        name: stat.city,
        type: 'line',
        data: _(days).map((x) => Number.parseInt(x.bWendu, 10)).value(),
      }
      const serialMax = {
        name: stat.city,
        type: 'line',
        data: _(days).map((x) => Number.parseInt(x.yWendu, 10)).value(),
      }
      series.push(serialMin, serialMax);
    }

    this.chartDates = dates;
    this.chartSeries = series;
  }
}
</script>

<style scoped>
  #chart {
    width: 100%;
    height: 500px;
  }
</style>
