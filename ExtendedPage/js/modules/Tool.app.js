
import Helpers from './Helpers.js'
import debounce from "./Debounce.js";
import Loading from "./Loading.js";
import Checkbox from "./Checkbox.js";
// import NProgress from "../plugins/NProgress/NProgress.min.js";

/**
 * use <script src="./js/modules/Tool.app.js" type="module"></script>
 * @type {jQuery|HTMLElement}
 */

let $ = jQuery,
  $document = $(document);

class Tool {
  constructor(config) {
    // 延迟触发，消除重复触发
    this.debounce = debounce;
    // 工具函数
    this.Helpers = new Helpers();
    // NProgress
    // this.NProgress = NProgress;
    // loading
    new Loading();
    // checkbox selecter
    new Checkbox();

    /**
     * 交换两个元素的位置
     * @param another
     * @returns {jQuery}
     */
    $.fn.swap = function(another) {
      var me = this;
      var cloneMe = me.clone();
      var temp = $('<span/>');
      another.before(temp);
      me.replaceWith(another);
      temp.replaceWith(cloneMe);
      return this;
    };

    /**
     * 根据格式，返回时间格式化
     * @example  new Date().Format("yyyy-MM-dd hh:mm:ss");
     * @param fmt
     * @returns {*}
     * @constructor
     */
    Date.prototype.Format = function (fmt) {
      const o = {
        "M+": this.getMonth() + 1,   //月份
        "d+": this.getDate(),        //日
        "h+": this.getHours(),       //小时
        "m+": this.getMinutes(),     //分
        "s+": this.getSeconds(),     //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()  //毫秒
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
    };

    /**
     * 键盘监控事件
     * @example $("#input-test").judge(function() { alert('执行我的回调');});
     * @param call
     */
    $.fn.judge = function(call) {
      // 按下监控
      this.keypress(function() {
        var event = event || window.event;
        if(event.keyCode === 13) {
          call();
          return false;
        }
      });
    };

  }
}
window.Tools = new Tool();

