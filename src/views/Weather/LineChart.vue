<template>
  <div>
    <div id="chart" ref="chart"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator';
import _ from 'lodash';

@Component({
  props: {
    title: String,
    dates: Array,
    series: Array,
  }
})
export default class LineChart extends Vue {
  $echarts: any;
  $refs!: {
    chart: HTMLDivElement,
  }

  chart: any;

  mounted() {
    this.chart = this.$echarts.init(this.$refs.chart);
  }

  @Watch('chartOption')
  onChartOptionChanged(value: any) {
    this.chart.clear();
    this.chart.setOption(value);
  }

  get chartOption() {
    const { title, dates, series } = this.$props;
    const legends = _(series).map('name').uniq().value();
    return {
      title: {
        text: title
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: legends,
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
        data: dates,
      },
      yAxis: {
        type: 'value'
      },
      series: [
        ...series,
      ],
    }
  }
}
</script>

<style>
  #chart {
    width: 100%;
    height: 500px;
  }
</style>
