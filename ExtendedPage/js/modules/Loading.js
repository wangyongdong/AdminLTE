let LOADING_SVG = '<svg xmlns="http://www.w3.org/2000/svg" class="mx-auto block" style="margin: auto;width:{width};{svg_style}" viewBox="0 0 120 30" fill="{color}"><circle cx="15" cy="15" r="15"><animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"/><animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite" /></circle><circle cx="60" cy="15" r="9" fill-opacity="0.3"><animate attributeName="r" from="9" to="9" begin="0s" dur="0.8s" values="9;15;9" calcMode="linear" repeatCount="indefinite" /><animate attributeName="fill-opacity" from="0.5" to="0.5" begin="0s" dur="0.8s" values=".5;1;.5" calcMode="linear" repeatCount="indefinite" /></circle><circle cx="105" cy="15" r="15"><animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite" /><animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite" /></circle></svg>';

function random(len) {
  return Math.random().toString(12).substr(2, len || 16)
}

/**
 * 自定义 全屏居中loading
 */
class Loading {
  constructor(options) {
    options = $.extend({
      box: 'box-loading',
      container: 'body',
      zIndex: 999991014,
      width: '52px',
      color: '#bacad6',
      background: 'transparent',
      style: '',
      defStyle: 'position:fixed;',//absolute
      svg: LOADING_SVG,
      top: 100,
      left: 100,
      shade: 'rgba(0,0,0,0.4)',
    }, options);

    let _this = this, content;

    _this.$container = $(options.container);
    _this.$boxName = options.box;

    content = $('<div class="{class}" style="{style}">{svg}</div>'
      .replace('{class}', _this.$boxName)
      .replace('{svg}', options.svg)
      .replace('{color}', options.color)
      .replace('{width}', options.width)
      .replace('{style}', `${options.defStyle}background:${options.background};z-index:${options.zIndex};${options.style}`)
    );
    content.appendTo(_this.$container);

    var win = $(window);
    // 遮罩层
    var shadow = $('<div></div>')
      .attr('class', _this.$boxName)
      .css('z-index', (options.zIndex - 2))
      .css('background-color', options.shade)
      .css('position', 'fixed')
      .css('top', 0)
      .css('left', 0)
      .css('bottom', 0)
      .css('right', 0)
      .css('width', '100%')
      .css('height', '100%');

    if (options.shade) {
      shadow.appendTo(_this.$container);
    }

    function resize() {
      content.css({
        left: (win.width() - options.left) / 2,
        top: (win.height() - options.top) / 2
      });
    }

    // 自适应窗口大小
    win.on('resize', resize);
    resize();
  }

  destroy() {
    var _box = '.' + this.$boxName;
    this.$container.find(_box).remove();
  }
}

/**
 * 基于bootstrap progress
 * https://v4.bootcss.com/docs/components/progress/
 */
class Progress {
  constructor(rate, options) {
    options = $.extend({
      container: '.progress-box',
      height: '',
      background: 'bg-success',
      maxrate: 100,
    }, options);

    let _this = this;
    _this.$maxrate = options.maxrate;
    _this.$rate = rate;
    _this.$container = $(options.container);

    // 不能超过最大
    if(_this.$rate > _this.$maxrate) {
      _this.$rate = _this.$maxrate;
    }

    _this.progress = $('<div class="progress"></div>').append(
      $('<div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100"></div>')
        .attr('aria-valuenow', _this.$ratet)
        .css('width', _this.$rate+'%')
        .addClass(options.background)
        .css('height', options.height)
        .text(_this.$rate+'%')
    );
    _this.progress.appendTo(options.container);
  }

  // 加
  inc(speed) {
    this.$rate = this.$rate+Number(speed);
    if(this.$rate > this.$maxrate) {
      this.$rate = this.$maxrate;
    }
    this.progress.find('.progress-bar')
      .attr('aria-valuenow', this.$rate)
      .css('width', this.$rate+'%')
      .text(this.$rate+'%');

    return this.$rate;
  }

  // 设置值
  set(rate) {
    this.rate = rate;
    if(this.$rate > this.$maxrate) {
      this.$rate = this.$maxrate;
    }
    this.progress.find('.progress-bar')
      .attr('aria-valuenow', rate)
      .css('width', rate+'%')
      .text(rate+'%');
    return this.$rate;
  }

  // 销毁 // false是直接到100%，然后结束；true 是直接在当前进度结束
  destroy(force = false) {
    if(!force) {
      this.set(this.$maxrate);
    }
    this.progress.remove();
  }
}

function extendLoading() {

  // 全屏loading
  $.fn.loadingScreen = function (opt) {
    if (opt === false) {
      return $(this).find(loading).remove();
    }

    opt = opt || {};
    // opt.container = $(this);

    return new Loading(opt);
  };

  // 给元素附加loading {div span button input}
  $.fn.loadingBlock = function (start) {
    let $this = $(this),
      loadingId = $this.attr('data-loading'),
      content;

    // 移除效果
    if (start === false) {
      if (!loadingId) {
        return $this;
      }

      $this.find('.waves-ripple').remove();

      return $this
        .removeClass('disabled btn-loading waves-effect')
        .removeAttr('disabled')
        .removeAttr('data-loading')
        .html($this.find('.' + loadingId).html())
        .val($this.find('.' + loadingId).text()); // 兼容input
    }

    if (loadingId) {
      return $this;
    }

    content = $this.html() || $this.val();  // 兼容input

    loadingId = 'ld-' + random();

    // 获取原内容
    let loading = `<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>`;
    let btnClass = ['loading-btn', 'loading-block'];
    for (let i in btnClass) {
      if ($this.hasClass(btnClass[i])) {
        loading = LOADING_SVG.replace('{color}', 'currentColor').replace('{width}', '50px;height:11px;');
      }
    }

    return $this
      .addClass('disabled btn-loading')
      .attr('disabled', true)
      .attr('data-loading', loadingId)
      .css('width', $this.outerWidth())
      .css('height', $this.outerHeight())
      .html(`<div class="${loadingId}" style="display:none">${content}</div>${loading}`)
      .val('加载中...'); // 兼容input
  };

  // 进度条
  $.fn.loadingProgress = function (set, speed, options) {
    return new Progress(set, speed, options);
  }
}

export default extendLoading
