<template>
  <div id='app'>
    <v-chart class='my-chart' :options='bar'/>
  </div>
</template>
<script>
import ECharts from 'vue-echarts/components/ECharts';
import 'echarts/lib/chart/bar';
export default {
  name: 'App',
  components: {
    'v-chart': ECharts
  },
  data() {
    return {
      bar: {
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20],
          }
        ]
      }
    };
  }
};
</script>
<style>
.my-chart {
  width: 800px;
  height: 500px;
}
</style>
