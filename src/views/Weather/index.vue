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

// city list
import WeatherMeta from './weather-meta';
declare const prov: any;
declare const provqx: any;

// vue component
import { Component, Vue } from 'vue-property-decorator';
import _ from 'lodash';
import dayjs from 'dayjs';

@Component({
  components: {},
  props: {},
})
export default class Weather extends Vue {
  private cities: any[] = [];
  private month: Date = new Date();
  private cityOptions: any[] = [];
  private cityProps: any = {
    lazy: true,
    lazyLoad: this.loadCityList,
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
    this.appendScript(WeatherMeta.cityScriptUrl, 'gb2312');
    this.loadCityList();
  }

  loadCityList(node?: any, resolve?: any) {
    if (!node) {
      this.cityOptions = _(WeatherMeta.provinceMap)
        .map((v, k) => ({label: v, value: k}))
        .value();
      return;
    }
    const {level, value: key} = node;
    if (level === 1) {
      const cities = _((prov[key] || ''))
        .split('|')
        .map((x) => /(\d+)-\w (\S+)-(\d+)/.exec(x))
        .compact()
        .map((x) => ({value: x[1], label: x[2]}))
        .value();
      resolve(cities);
    }
    if (level === 2) {
      const province = _.get(node, 'parent.value');
      const counties = _(provqx[province])
        .split('|')
        .map((x) => /(\d+)-\w (\S+)-(\d+)/.exec(x))
        .compact()
        .map((x) => ({value: x[1], label: x[2], parent: x[3], leaf: true}))
        .filter((x) => x.parent === key || key.length < 5)
        .value();
      resolve(counties);
    }
  }

  loadScripts() {
    console.log(this.cities, typeof(this.month));
  }

  appendScript(url: string, charset = 'utf8') {
    const script = document.createElement('script');
    script.setAttribute('src', url);
    script.setAttribute('charset', charset);
    document.head.appendChild(script);
  }
}
</script>
