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
  $echarts: any;
  $refs!: {
    chart: HTMLDivElement,
  }

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
    this.chart = this.$echarts.init(this.$refs.chart);
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
    const series = [];
    for (const city of this.cities) {
      const {days, stat} = await WeatherMeta.queryWeatherData(city, this.month);
      const serial = {
        name: stat.city,
        type: 'line',
        data: _(days).map((x) => Number.parseInt(x.bWendu, 10)).value(),
      }
      series.push(serial);
    }
    this.setChartData(series);
  }

  setChartData(series: any[]) {
    this.chart.setOption({
      title: {
        text: '折线图堆叠'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        ...series,
        // {
        //   name: '邮件营销',
        //   type: 'line',
        //   stack: '总量',
        //   data: [120, 132, 101, 134, 90, 230, 210]
        // },
        // {
        //   name: '联盟广告',
        //   type: 'line',
        //   stack: '总量',
        //   data: [220, 182, 191, 234, 290, 330, 310]
        // },
        // {
        //   name: '视频广告',
        //   type: 'line',
        //   stack: '总量',
        //   data: [150, 232, 201, 154, 190, 330, 410]
        // },
        // {
        //   name: '直接访问',
        //   type: 'line',
        //   stack: '总量',
        //   data: [320, 332, 301, 334, 390, 330, 320]
        // },
        // {
        //   name: '搜索引擎',
        //   type: 'line',
        //   stack: '总量',
        //   data: [820, 932, 901, 934, 1290, 1330, 1320]
        // }
      ]
    })
  }
}
</script>

<style>
  #chart {
    width: 100%;
    height: 500px;
  }
</style>
