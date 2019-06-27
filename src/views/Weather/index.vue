<template>
  <div>
    
    <el-cascader
      placeholder="请选择城市"
      clearable
      v-model="cities"
      :options="cityOptions"
      :props="cityProps"
    ></el-cascader>
    
    <el-date-picker
      placeholder="请选择月份"
      type="month"
      v-model="month"
      :picker-options="monthOptions"
    ></el-date-picker>

    <el-button v-on:click="loadWeatherData">比较</el-button>

    <div id="chart" ref="chart"></div>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component'
import echarts from 'echarts';
import _ from 'lodash';
import dayjs from 'dayjs';

import WeatherMeta from './weather-meta';

@Component
export default class Weather extends Vue {
  private cities: any[] = [];
  private month: Date = new Date();
  private chart: any;

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
//    echarts.init(this.$refs.chart);
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
    for (const city of this.cities) {
      const {days, stat} = await WeatherMeta.queryWeatherData(city, this.month);
      // this.message = JSON.stringify(days);
      // console.log(days, stat);
      // const url = WeatherMeta.watherScriptUrl(city, this.month);
    }
    // console.log(this.cities, typeof(this.month));
  }
}
</script>
