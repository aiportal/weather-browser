<template>
  <div>
    
    <el-cascader
      placeholder="请选择城市"
      clearable
      v-model="cities"
      :options="cityOptions"
      :props="cityProps"
      collapse-tags
    ></el-cascader>
    
    <el-date-picker
      placeholder="请选择月份"
      type="month"
      v-model="month"
      :picker-options="monthOptions"
    ></el-date-picker>

    <el-button v-on:click="loadWeatherData">比较</el-button>

    <LineChart
      title="天气历史比较"
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
import LineChart from './LineChart';

@Component({
  components: {
    LineChart,
  }
})
export default class Weather extends Vue {
  private cities: any[] = [];
  private month: Date = new Date();
  private chartDates: string[] = [];
  private chartSeries: any[] = [];

  get cityProps() {
    return {
      lazy: true,
      lazyLoad: this.loadCityList,
      value: 'code',
      label: 'name',
      expandTrigger: 'hover',
      multiple: true,
      emitPath: false,
    }
  }

  get monthOptions() {
    return {
      disabledDate: (time: Date): boolean =>
        dayjs(time).isBefore(WeatherMeta.minMonth, 'M') ||
        dayjs(time).isAfter(WeatherMeta.maxMonth, 'M'),
    }
  }

  get cityOptions() {
    return WeatherMeta.getProvinceList();
  }

  mounted() {
    WeatherMeta.initalize();
  }

  loadCityList(node: any, resolve: any) {
    if (node.level === 1) {
      const children = WeatherMeta.getCityList(node.value);
      resolve(children);
    } else {
      const province = _.get(node, 'parent.value');
      const children = WeatherMeta.getCountyList(province, node.value);
      _(children).each((x) => {
        _.assign(x, {leaf: true});
      });
      resolve(children);
    }
  }

  async loadWeatherData() {
    let dates = null;
    const series = [];
    for (const city of this.cities) {
      const {days, stat} = await WeatherMeta.queryWeatherData(city, this.month);
      if (!dates) {
        dates = _(days).map('ymd').value();
      }
      const serial = {
        name: stat.city,
        type: 'line',
        data: _(days).map((x) => Number.parseInt(x.bWendu, 10)).value(),
      }
      series.push(serial);
    }
    this.chartDates = dates;
    this.chartSeries = series;
  }
}
</script>

<style>
  #chart {
    width: 100%;
    height: 500px;
  }
</style>
