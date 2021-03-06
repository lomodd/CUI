(function ($) {
    $.fn.inputformat = function (option) {
        var $this = $(this);
        var defaultOpt = {
            type: 'phone'
        };
        var opt = $.extend(defaultOpt, option);
        var timer = null;
        var _get = function () {
            var value = $this.val();
            switch (opt.type) {
                case 'phone':
                    return value.replace(/-/g, '');
                case 'price':
                    return value.replace(/,/g, '');
                default:
                    return value;
            }
        };
        var _set = function (programmatic) {
            var value = _get();
            var formatString = '';
            switch (opt.type) {
                case 'phone':
                    if (value.length >= 4) {
                        formatString += value.slice(0, 3) + '-';
                        if (value.length >= 7) {
                            formatString += value.slice(3, 6) + '-';
                            formatString += value.slice(6, value.length);
                        } else {
                            formatString += value.slice(3, value.length);
                        }
                    } else {
                        formatString += value;
                    }
                    break;
                case 'price':
                    var arr = value.toString().split('.');
                    formatString = arr[0].replace(/[^0-9]/g,'');
                    var pattern = /(-?\d+)(\d{3})/;
                    while (pattern.test(formatString))
                        formatString = formatString.replace(pattern, "$1,$2");
                    break;
                case 'rate':
                    var fraction = $.isInt(opt.fraction) ? opt.fraction : 2;
                    var arr = value.toString().split('.');
                    formatString = arr[0].replace(/[^0-9]/g, '');
                    if (fraction > 0 && arr.length > 1) {
                        var decimals = arr[1].length > fraction ? arr[1].substring(0, fraction) : arr[1];
                        decimals = decimals.replace(/[^0-9]/g,'');
                        if(decimals){
                          formatString += '.' + decimals;
                        }else{
                          formatString += '.';
                        }
                    }
                    break;
                default:
                    formatString = value;
                    break;
            }
            $this.val(formatString);
            $this.prop('rawValue', value)
            if(!programmatic){
              $this.trigger('formatinput',[formatString,value]);
            }
        };

        if ($.isInt($this.val())) {
            _set();
        }

        $this.on('keyup input change', function (e,programmatic) {
            var $this = $(this);
            if (timer) {
                clearTimeout(timer);
            }
            if ($this.prop('rawValue') !== _get()) {
                timer = setTimeout(function(){
                    _set(programmatic===true);
                }, 10);
            }
        });
    }
})(jQuery);
