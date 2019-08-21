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

    <YearSlider v-model="years" :min="2011"></YearSlider>

    <MonthSlider v-model="months"></MonthSlider>

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
import YearSlider from './YearSlider.vue';
import MonthSlider from './MonthSlider.vue';
import LineChart from './LineChart.vue';

@Component({
  components: {
    CitySelect,
    YearSlider,
    MonthSlider,
    LineChart,
  }
})
export default class Weather extends Vue {
  private cities: string[] = [];
  private years: number[] = [];
  private months: number[] = [];
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
    const series: any[] = [];

    console.log(this.cities, this.years, this.months);
    console.log(_.range(this.years[0], this.years[1] + 1), _.range(this.months[0], this.months[1]));

    for (const city of this.cities) {

      const dates: string[] = [];
      const dataMin: number[] = [];
      const dataMax: number[] = [];
      const stats: any[] = [];

      for (const year of _.range(this.years[0], this.years[1] + 1)) {
        for (const month of _.range(this.months[0], this.months[1] + 1)) {

          let days: any[] = [];
          let stat: any;
          try {
            const date = dayjs(`${year}-${month}`).toDate();
            const res = await WeatherMeta.queryWeatherData(city, date);
            [days, stat] = [res.days, res.stat];
          } catch (ex) {
            alert(ex.message);
          }

          dates.push(..._.map(days, 'ymd'));
          dataMin.push(..._(days).map((x) => Number.parseInt(x.bWendu, 10)).value());
          dataMax.push(..._(days).map((x) => Number.parseInt(x.yWendu, 10)).value());
          stats.push(stat);
        }

        this.chartDates = _(dates).uniq().sort().value();

        const serialMin = {
          name: stats[0].city,
          type: 'line',
          smooth: true,
          data: dataMin,
        }
        const serialMax = {
          name: stats[0].city,
          type: 'line',
          smooth: true,
          data: dataMax,
        }
        series.push(serialMin, serialMax);
      }
    }
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
