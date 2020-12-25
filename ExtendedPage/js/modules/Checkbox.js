
class Checkbox {
    constructor(options) {
        let _this = this;

        _this.options = $.extend({
            // checkbox css选择器
            selectorRow: '',
            // 全选checkbox css选择器
            selectAllSelector: '',
            // 选中数量 选择器
            selectAllNum: '',
            // 选中效果颜色
            background: 'rgba(255, 255,213,0.4)',
            // 点击行事件
            clickRow: false,
            // 表格选择器
            container: 'table',
        }, options);

        _this.init(_this);

        return _this;
    }

    init(_this) {
        let options = this.options,
            selectorRow = options.selectorRow,
            $document = $(document),
            selectAll = options.selectAllSelector,
            selectAllNum = options.selectAllNum;

        // 全选触发
        $(selectAll).on('change', function() {
            $(this).parents(options.container).find(selectorRow).prop('checked', this.checked).trigger('change');
        });

        // 选中行触发：改变颜色、设置数量、设置全选与否
        $document.off('change', selectorRow).on('change', selectorRow, function (e) {
          var tr = $(this).closest('tr');
          e.stopPropagation();
          // 获取选中数量
          var selectNums = _this.getSelectedNums() || '';

          if (this.checked) {
            tr.css('background-color', options.background);
            if (selectNums === $(selectorRow).length) {
              $(selectAll).prop('checked', true);
            }
          } else {
            tr.css('background-color', '');
            if(!selectNums) {
              $(selectAll).prop('checked', false);
            }
          }

          // 设置选中数量
          $(this).parents(options.container).find(selectAllNum).text(selectNums);
        });

        // if (options.clickRow) {
        //     $document.off('click', selectorRow).on('click', selectorRow, function (e) {
        //         if (typeof e.cancelBubble != "undefined") {
        //             e.cancelBubble = true;
        //         }
        //         if (typeof e.stopPropagation != "undefined") {
        //             e.stopPropagation();
        //         }
        //     });
        //
        //     $document.off('click', options.container+' tr').on('click', options.container+' tr', function () {
        //         $(this).find(selectorRow).click();
        //     });
        // }
    }

    /**
     * 获取选中的数量
     *
     * @returns {Array}
     */
    getSelectedNums() {
      return $(this.options.selectorRow+':checked').length;
    }

    /**
     * 获取选中的指定元素值
     *
     * @returns {Array}
     */
    getSelectedElements(element) {
      let selected = [];

      $(this.options.selectorRow+':checked').each(function() {
        var val = $(this).attr(element);
        if (selected.indexOf(val) === -1) {
          selected.push(val);
        }
      });

      return selected;
    }


    /**
     * 获取选中的data值
     *
     * @returns {Array}
     */
    getSelectedDatas(element) {
      let selected = [];

      $(this.options.selectorRow+':checked').each(function() {
        var val = $(this).data(element);
        if (selected.indexOf(val) === -1) {
          selected.push(val);
        }
      });

      return selected;
    }

    /**
     * 获取选中的行数组
     *
     * @returns {Array}
     */
    getSelectedRows() {
        let selected = [];

        $(this.options.selectorRow+':checked').each(function() {
            var obj = $(this), i, exist;

            for (i in selected) {
                if (selected[i].obj === obj) {
                    exist = true
                }
            }

            exist || selected.push(obj)
        });

        return selected;
    }
}

export default function extendSelectCheckbox() {
  $.fn.selectAll = function (opt) {
    opt = opt || {};
    return new Checkbox(opt);
  };
}

