
export default class Helpers {
  constructor() {
  }

  /**
   * 获取json对象或数组的长度
   *
   * @param obj
   * @returns {number}
   */
  len(obj) {
    if (typeof obj !== 'object') {
      return 0;
    }
    let i, len = 0;

    for(i in obj) {
      len += 1;
    }

    return len;
  }

  /**
   * 判断变量或key是否存在
   *
   * @param _var
   * @param key
   * @returns {boolean}
   */
  isset(_var, key) {
    let isset = (typeof _var !== 'undefined' && _var !== null);

    if (typeof key === 'undefined') {
      return isset;
    }

    return isset && typeof _var[key] !== 'undefined';
  };

  empty(obj, key) {
    return !(this.isset(obj, key) && obj[key]);
  };

  /**
   * 根据key获取对象的值，支持获取多维数据
   *
   * @param arr
   * @param key
   * @param def
   * @returns {null|*}
   */
  get(arr, key, def) {
    def = null;

    if (this.len(arr) < 1) {
      return def;
    }

    key = String(key).split('.');

    for (var i = 0; i < key.length; i++) {
      if (this.isset(arr, key[i])) {
        arr = arr[key[i]];
      } else {
        return def;
      }
    }

    return arr;
  }

  /**
   * 判断key是否存在
   *
   * @param arr
   * @param key
   * @returns {def|boolean}
   */
  has(arr, key) {
    if (this.len(arr) < 1) return def;
    key = String(key).split('.');

    for (var i = 0; i < key.length; i++) {
      if (this.isset(arr, key[i])) {
        arr = arr[key[i]];
      } else {
        return false;
      }
    }

    return true;
  }

  /**
   * 判断元素是否在对象中存在
   *
   * @param arr
   * @param val
   * @param strict
   * @returns {boolean}
   */
  inObject(arr, val, strict) {
    if (this.len(arr) < 1) {
      return false;
    }

    for (var i in arr) {
      if (strict) {
        if (val === arr[i]) {
          return true;
        }
        continue
      }

      if (val == arr[i]) {
        return true;
      }
    }
    return false;
  }

  // 判断对象是否相等
  equal(array, array2, strict) {
    if (!array || !array2) {
      return false;
    }

    let len1 = this.len(array),
      len2 = this.len(array2), i;

    if (len1 !== len2) {
      return false;
    }

    for (i in array) {
      if (! this.isset(array2, i)) {
        return false;
      }

      if (array[i] === null && array2[i] === null) {
        return true;
      }

      if (typeof array[i] === 'object' && typeof array2[i] === 'object') {
        if (! this.equal(array[i], array2[i], strict)) {
          return false;
        }
        continue;
      }

      if (strict) {
        if (array[i] !== array2[i]) {
          return false;
        }
      } else {
        if (array[i] != array2[i]) {
          return false;
        }
      }

    }
    return true;
  }

  // 字符串替换
  replace(str, replace, subject) {
    if (!str) {
      return str;
    }

    return str.replace(
      new RegExp(replace, "g"),
      subject
    );
  }

  /**
   * 生成随机字符串
   *
   * @returns {string}
   */
  random(len) {
    return Math.random().toString(12).substr(2, len || 16)
  }

  /**
   * 为1~9的数字前面加上0
   * @example Tools.Helpers.formatNumber(9); // return 09
   * @param val
   * @returns {string}
   */
  formatNumber(val) {
    if(val.length<2){
      val = "0" + val.toString();
    }
    return val.toString();
  };

  /**
   * @desc 跳转到指定元素位置
   * @example Tools.Helpers.goTo($("#footer"));
   * @param element
   */
  goTo(element) {
    const elH = element.offset().top;
    $("html,body").animate({scrollTop:elH}, 'slow');
  };

  /**
   * 加载图片，执行回跳
   * @example var img = Tools.Helpers.checkImg('http://baike.baidu.com/cms/rc/240x112dierzhou.jpg', function() { alert('加载成功'); });
   * @param imgUrl
   * @param callFun
   * @param errFun
   */
  checkImg(imgUrl, callFun, errFun) {
    // 定义一个Image对象
    const img = new Image();
    // 为Image对象添加图片加载成功的处理方法
    img.onload = function() {
      callFun();
      return true;
    };
    // 为Image对象添加图片加载失败的处理方法
    img.onerror = function() {
      alert("配图地址不可访问，请重新上传图片");
      if(errFun) {
        errFun();
      }
      return false;
    };
    // 开始加载图片
    img.src = imgUrl;
    return img;
  };

  /**
   * https://v4.bootcss.com/docs/components/modal/
   * @param options
   */
  confirms(options) {
    options = $.extend({
      title: '',
      message: '确认执行?',
      yesCallBack: '',
      noCallBack: '',
      footer: true,
    }, options);
    // 创建一个 modal
    const modal = this.modalCreate(options).modal('show');
    // 确认
    $(".btn-submit").click(function(event) {
      // modal.remove();
      modal.modal('hide');
      $('.modal-backdrop').remove();
      if(options.yesCallBack) {
        options.yesCallBack();
      }
      event.stopPropagation();
      return false;
    });
    // 隐藏事件
    modal.on('hidden.bs.modal', function (event) {
      if(options.noCallBack) {
        options.noCallBack();
      }
      event.stopPropagation();
      return false;
    });
  };

  /**
   * 创建一个空的 modal
   * @example Tools.Helpers.modalCreate({'id' :'modal-asyn-table','title': '异步加载表格'});
   * @param options
   * @returns {jQuery|HTMLElement|boolean}
   */
  modalCreate(options) {
    if(!options.title) {
      return false;
    }
    if(!options.id) {
      options.id = this.random(12);
    }
    const header = $('<div class="modal-header">\n' +
                      '<h4 class="modal-title">'+options.title+'</h4>\n' +
                      '<button type="button" class="close" data-dismiss="modal" aria-label="Close">\n' +
                      '<span aria-hidden="true">&times;</span>\n' +
                      '</button>\n' +
                    '</div>');
    const body = $('<div class="modal-body"><p>'+ options.message || '' +'</p></div>');
    const modal = $('<div id="'+options.id+'" class="modal fade"><div class="modal-dialog"><div class="modal-content"></div></div></div>');
    modal.find('.modal-content').append(header).append(body);
    if(options.footer) {
      const footer = $('<div class="modal-footer justify-content-between">' +
        '<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>\n' +
        '<button type="button" class="btn btn-primary btn-submit">确定</button>\n' +
        '</div>');
      modal.find('.modal-content').append(footer);
    }
    $("body").append(modal);
    return $("#"+options.id);
  };

  // 异步加载
  asyncRender = function(url, done, error) {
    $.ajax(url).then(function (data) {
      console.log('ajax success');
      done(data);
    }, function (a, b, c) {
      console.log('ajax faild');
      if (error) {
        if (error(a, b, c) === false) {
          return false;
        }
      }
    })
  }



}
