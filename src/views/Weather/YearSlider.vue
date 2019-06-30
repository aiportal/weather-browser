<template>
  <el-slider
    :min="min"
    :max="max"
    v-model="years"
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
    min: {
      type: Number,
      default: dayjs().add(-5, 'year').year(),
    },
    max: {
      type: Number,
      default: dayjs().year(),
    },
    range: {
      type: Boolean,
      default: true,
    }
  }
})
export default class YearSlider extends Vue {

  years: number[] = [dayjs().year(), dayjs().year()];

  @Watch('years')
  @Emit('input')
  @Emit('change')
  onYearsChanged() {
    return this.years;
  }
}
</script>

<style scoped>
</style>
