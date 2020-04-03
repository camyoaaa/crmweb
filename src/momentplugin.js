import Vue from 'vue';
import moment from "moment";

Vue.prototype.$moment = moment; //赋值使用
Vue.filter('dateformat', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)

})
