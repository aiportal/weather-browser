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
    <el-button v-on:click="loadScripts">比较</el-button>
  </div>
</template>

<script lang="ts">

// vue component
import { Component, Vue } from 'vue-property-decorator';
import _ from 'lodash';
import dayjs from 'dayjs';

import WeatherMeta from './weather-meta';

@Component({
  components: {},
  props: {},
})
export default class Weather extends Vue {
  private cities: any[] = [];
  private month: Date = new Date();
  private cityOptions: any[] = WeatherMeta.getProvinceList();
  private cityProps: any = {
    lazy: true,
    lazyLoad: this.loadCityList,
    value: 'code',
    label: 'name',
    expandTrigger: 'hover',
    multiple: true,
    emitPath: false,
  }
  private monthOptions: any = {
    disabledDate: (time: Date): boolean =>
      dayjs(time).isBefore(WeatherMeta.minMonth, 'M') ||
      dayjs(time).isAfter(WeatherMeta.maxMonth, 'M'),
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

  loadScripts() {
    for (const city of this.cities) {
      const url = WeatherMeta.watherScriptUrl(city, this.month);
    }
    // console.log(this.cities, typeof(this.month));
  }
}
</script>
