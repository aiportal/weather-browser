<template>
  <el-slider
    :min="1"
    :max="12"
    v-model="months"
    :range="range"
    show-stops
  ></el-slider>
</template>

<script lang="ts">
import { Component, Vue, Watch, Emit } from 'vue-property-decorator';
import dayjs from 'dayjs';

@Component({
  props: {
    value: Array,
    range: {
      type: Boolean,
      default: true,
    }
  }
})
export default class MonthSlider extends Vue {

  months: number[] = [1, dayjs().month() + 1];

  @Watch('months')
  @Emit('input')
  @Emit('change')
  onRangeChanged() {
    return this.months;
  }
}
</script>

<style scoped>
</style>
