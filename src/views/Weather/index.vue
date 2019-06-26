<template>
  <div>
    <el-button v-on:click="loadScripts">el-button</el-button>
    <el-cascader
      placeholder="请选择城市"
      clearable
      v-model="city"
      :options="cityOptions"
      :props="cityProps"
    ></el-cascader>
  </div>
</template>

<script lang="ts">

// city list
import { ProvinceList } from './province-list';
const CITY_SELECT_SCRIPT = 'http://tianqi.2345.com/js/citySelectData.js';
declare const prov: any;
declare const provqx: any;

// vue component
import { Component, Vue } from 'vue-property-decorator';
import _ from 'lodash';

@Component({
  components: {},
  props: {},
})
export default class Weather extends Vue {
  private city = '';
  private cityOptions: any[] = [];
  private cityProps: any = {
    lazy: true,
    lazyLoad: this.loadCityList,
    expandTrigger: 'hover',
    multiple: true,
  }

  mounted() {
    this.appendScript(CITY_SELECT_SCRIPT, 'gb2312');
    this.loadCityList();
  }

  loadCityList(node?: any, resolve?: any) {
    if (!node) {
      this.cityOptions = _(ProvinceList)
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
    // console.log(prov);
    // console.log(provqx);
    // this.appendScript(CITY_SELECT_SCRIPT, 'gb2312');
  }

  appendScript(url: string, charset = 'utf8') {
    const script = document.createElement('script');
    script.setAttribute('src', url);
    script.setAttribute('charset', charset);
    document.head.appendChild(script);
  }
}
</script>
