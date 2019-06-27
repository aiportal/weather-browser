import dayjs from 'dayjs';

/**
 * meta data from http://tianqi.2345.com
 */
export default class Tianqi2345 {
  public static readonly minMonth = new Date('2011-01');
  public static readonly maxMonth = new Date();

  public static get provinceMap() { return PROVINCE_MAP; }
  public static get cityScriptUrl() { return CITY_SCRIPT_URL; }

  public static watherUrl(city: string, month: Date): string {
    const m1 = dayjs(month).format('YYYYM');
    const m2 = dayjs(month).format('YYYYMM');

    const path = dayjs(month).isBefore('2016-03') ? `${city}_${m1}.js` : `${m2}/${city}_${m2}.js`;
    return `http://tianqi.2345.com/t/wea_history/js/${path}`;
  }
}

const CITY_SCRIPT_URL = 'http://tianqi.2345.com/js/citySelectData.js';

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
