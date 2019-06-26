<template>
  <div>
    <el-button v-on:click="loadScripts">el-button</el-button>
  </div>
</template>

<script lang="ts">
const CITY_SELECT_SCRIPT = 'http://tianqi.2345.com/js/citySelectData.js';

import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {},
  props: {},
})
export default class Weather extends Vue {
  private myName = 'Hello!';

  mounted() {
    this.appendScript(CITY_SELECT_SCRIPT, 'gb2312');
  }

  loadScripts() {
    this.appendScript(CITY_SELECT_SCRIPT, 'gb2312');
  }

  appendScript(url: string, charset = 'utf8') {
    const script = document.createElement('script');
    script.setAttribute('src', url);
    script.setAttribute('charset', charset);
    document.head.appendChild(script);
  }

  get name() {
    return this.myName;
  }
  set name(value: string) {
    this.myName = value;
  }
}
</script>
