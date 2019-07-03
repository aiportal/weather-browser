<template>
  <el-cascader
    placeholder="请选择城市"
    clearable
    v-model="city"
    :options="cityOptions"
    :props="cityProps"
    :collapse-tags="collapse"
  ></el-cascader>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import _ from 'lodash';
import WeatherMeta from './weather-meta';

@Component({
  props: {
    value: Array,
    placeholder: {
      type: String,
      default: '请选择城市',
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    multiple: {
      type: Boolean,
      default: true,
    },
    collapse: {
      type: Boolean,
      default: true,
    },
  }
})
export default class CitySelect extends Vue {

  get city() {
    return _.get(this.$props, 'value');
  }
  set city(value: any) {
    this.$emit('input', value);
  }

  get cityProps() {
    return {
      lazy: true,
      lazyLoad: this.loadCityList,
      value: 'code',
      label: 'name',
      expandTrigger: 'hover',
      multiple: this.$props.multiple,
      emitPath: false,
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
}

</script>

<style scoped>

</style>
