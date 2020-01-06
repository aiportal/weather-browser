import dayjs from 'dayjs';
import _ from 'lodash';

/**
 * meta data from https://tianqi.2345.com
 */
export default class Tianqi2345 {
  static readonly minMonth = new Date('2011-01');
  static readonly maxMonth = new Date();

  static getProvinceList(): Array<{code: string, name: string}> {
    const provinces = _(PROVINCE_MAP)
      .map((v, k) => ({code: k, name: v}))
      .value();
    return provinces;
  }

  static getCityList(province: string): Array<{code: string, name: string}> {
    const cities = _((prov[province] || ''))
      .split('|')
      .map((x) => /(\d+)-\w (\S+)-(\d+)/.exec(x))
      .compact()
      .map((x) => ({code: x[1], name: x[2]}))
      .value();
    return cities;
  }

  static getCountyList(province: string, city?: string): Array<{code: string, name: string}> {
    const counties = _(provqx[province])
      .split('|')
      .map((x) => /(\d+)-\w (\S+)-(\d+)/.exec(x))
      .compact()
      .map((x) => ({code: x[1], name: x[2], city: x[3]}))
      .filter((x) => (city && city.length > 2) ? x.city === city : true)
      .value();
    return counties;
  }

  static async queryWeatherData(city: string, month: Date): Promise<{
    days: WeatherDayInfo[],
    stat: WeatherMonthStat,
  }> {
    const url = this.dataScriptUrl(city, month);
    await this.appendScript(url);
    const days = _(weather_str.tqInfo).reject(_.isEmpty).value();
    const stat = _.omit(weather_str, 'tqInfo') as WeatherMonthStat;
    return {
      days,
      stat,
    }
  }

  static initalize() {
    this.appendScript(CITY_SCRIPT_URL);
  }

  private static dataScriptUrl(city: string, month: Date): string {
    const m1 = dayjs(month).format('YYYYM');
    const m2 = dayjs(month).format('YYYYMM');

    const path = dayjs(month).isBefore('2016-03') ? `${city}_${m1}.js` : `${m2}/${city}_${m2}.js`;
    return `https://tianqi.2345.com/t/wea_history/js/${path}`;
  }

  private static async appendScript(url: string, charset = 'gb2312') {
    const script = document.createElement('script');
    script.setAttribute('src', url);
    script.setAttribute('charset', charset);

    await new Promise((resolve, reject) => {
      script.onload = () => {
        resolve();
      }
      script.onerror = () => {
        reject();
      }
      document.head.appendChild(script);
    });
  }
}

declare const prov: any;
declare const provqx: any;
declare const weather_str: any;

const CITY_SCRIPT_URL = 'https://tianqi.2345.com/js/citySelectData.js';

const PROVINCE_MAP = {
  10: '安徽',
  11: '澳门',
  12: '北京',
  43: '重庆',
  13: '福建',
  14: '甘肃',
  15: '广东',
  16: '广西',
  17: '贵州',
  18: '海南',
  19: '河北',
  20: '河南',
  21: '黑龙江',
  22: '湖北',
  23: '湖南',
  24: '吉林',
  25: '江苏',
  26: '江西',
  27: '辽宁',
  28: '内蒙古',
  29: '宁夏',
  30: '青海',
  31: '山东',
  32: '山西',
  33: '陕西',
  34: '上海',
  35: '四川',
  36: '台湾',
  37: '天津',
  38: '西藏',
  39: '香港',
  40: '新疆',
  41: '云南',
  42: '浙江',
}

export interface WeatherDayInfo {
  aqi: number,
  aqiInfo: string,
  aqiLevel: number,
  bWendu: string,
  yWendu: string,
  fengli: string,
  fengxiang: string,
  tianqi: string,
  ymd: string,
}

export interface WeatherMonthStat {
  avgAqi: number,
  avgbWendu: number,
  avgyWendu: number,
  city: string,
  maxAqi: number,
  maxAqiDate: string,
  maxAqiInfo: string,
  maxAqiLevel: number,
  maxWendu: string,
  minAqi: number,
  minAqiDate: string
  minAqiInfo: string,
  minAqiLevel: number,
  minWendu: string,
}
