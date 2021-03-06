(function ($) {
    $.fn.shifter = function (options) {
        var defaultOpt = {
            duration: 300,
            height: 200,
            width: 375,
            clickable: true,
            lazingload: true,
            autoscroll: 0,
            onchange: null,
            onbefore: null,
            onafter: null,
        };
        var $this = $(this);
        var obj;
        var sign_isAuto = false;
        var lastScrollLeft = 0;
        var opt = $.extend({}, defaultOpt, options);
        var timer = null;
        var $list;
        var $wrap;
        var $items;
        var innerW = 0;
        var shift = 0;
        var maxOffsetX = 0;
        var autoTimer = null;
        var prevLink = $('<a href="javascript:;" class="prev"><i class="icon-angle-left"></i></a>');
        var nextLink = $('<a href="javascript:;" class="next"><i class="icon-angle-right"></i></a>');
        var _resize = function () {
            innerW = 0;
            $items.each(function (i, item) {
                var screenwidth = $this.width();
                var height = opt.height;
                var width = screenwidth > opt.width ? opt.width : screenwidth - 2;
                $(item).css({
                    width: width,
                    height: opt.height
                });
                $(item).children().css({
                    width: width,
                    height: opt.height,
                });
                innerW += $(item).outerWidth();
            });
            $list.width(innerW);
        };
        var _markActive = function () {
            var list = [];
            var maxwidth = $wrap.outerWidth();
            $items.each(function (index, item) {
                var $item = $(item);
                $item.removeClass("active");
                var left = $item.position().left;
                var right = left + $item.outerWidth();
                if (left >= 0 && left <= maxwidth || right >= 0 && right <= maxwidth) {
                    if (opt.lazingload) {
                        $item.find("img").each(function (index, img) {
                            if ($(img).data("src")) {
                                $(img).attr("src", $(img).data("src"));
                                $(img).data("src", null);
                            }
                        });
                    }
                    list.push({
                        isFull: left >= 0 && right <= maxwidth,
                        element: $item
                    });
                }
            });
            if (list.length > 2) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].isFull) {
                        list[i].element.addClass("active");
                    }
                }
            } else if (list.length == 1) {
                list[0].element.addClass("active");
            } else if (list.length == 2) {
                var width1 = list[0].element.outerWidth() + list[0].element.position().left;
                var width2 = maxwidth - width1;
                if (width1 > width2) {
                    list[0].element.addClass("active");
                } else {
                    list[1].element.addClass("active");
                }
            }
            if (opt.onchange && lastScrollLeft !== $wrap.scrollLeft()) {
                var isNext = lastScrollLeft < $wrap.scrollLeft();
                if ($.isFunction(opt.onchange)) {
                    opt.onchange($list.find('.active'), sign_isAuto, isNext);
                } else {
                    $(document).trigger(opt.onchange, [$list.find('.active'), sign_isAuto, isNext]);
                }
                lastScrollLeft = $wrap.scrollLeft();
                sign_isAuto = false;
            }
        };
        var _scroll = function () {
            _markActive();
            maxOffsetX = $wrap.prop('scrollWidth') - $wrap.width();
            if ($wrap.scrollLeft() <= 0) {
                prevLink.addClass('disable');
                nextLink.removeClass('disable');
            } else if (($wrap.scrollLeft() - maxOffsetX) <= 3 && ($wrap.scrollLeft() - maxOffsetX) >= -3) {
                prevLink.removeClass('disable');
                nextLink.addClass('disable');
            } else {
                prevLink.removeClass('disable');
                nextLink.removeClass('disable');
            }
        };
        var _shift = function (index) {
            if ($.isInt(index)) {
                var item = $items.eq(index - 1);
                var offset = ($wrap.outerWidth() - item.outerWidth()) / 2;
                var left = $wrap.scrollLeft() + $(item).position().left - offset;
                $wrap.stop().animate({
                    "scrollLeft": left
                }, opt.duration);
                return index;
            } else {
                if (index) {
                    var begin = $wrap.scrollLeft();
                    var end = $wrap.outerWidth();
                    var ismove = false;
                    $items.each(function (j, item) {
                        var left = $(item).position().left;
                        var width = $(item).outerWidth();
                        if (left > 0 && left < end && (left + width) > end) {
                            ismove = true;
                            $wrap.stop().animate({
                                "scrollLeft": begin + $(item).position().left
                            }, opt.duration);
                            return false;
                        }
                    });
                    return ismove;
                } else {
                    var begin = $wrap.scrollLeft();
                    var end = $wrap.outerWidth();
                    var ismove = false;
                    $items.each(function (j, item) {
                        var left = $(item).position().left;
                        var width = $(item).outerWidth();
                        if (left <= 0 && (left + width) > 0) {
                            var ismove = true;
                            $wrap.stop().animate({
                                "scrollLeft": begin - end + ($(item).width() + $(item).position().left)
                            }, opt.duration);
                            return true;
                        }
                    });
                    return ismove;
                }
            }
        };
        var _prev = function () {
            return _shift(false);
        };
        var _next = function () {
            return _shift(true);
        };
        var _go = function (index) {
            return _shift(index);
        };
        var _option = function (option) {
            opt = $.extend(opt, option);
            return opt;
        };
        var _init = function () {
            if (opt.onbefore) {
                if ($.isFunction(opt.onbefore)) {
                    opt.onbefore($this);
                } else {
                    $(document).trigger(opt.onbefore, [$this]);
                }
            }
            $this.css('height', opt.height);
            $list = $this.find("ul");
            $list.wrap('<div class="wrap"></div>');
            $wrap = $this.find(".wrap");
            $items = $list.find("li");
            $items.each(function (index, item) {
                $(item).attr('shift-index', index);
                if (opt.clickable) {
                    var i = index + 1;
                    $(item).click(function () {
                        obj.go(i);
                    });
                }
                if (opt.lazingload) {
                    var img = $(item).find('img[src]');
                    img.data('src', img.attr("src"));
                    img.attr('src', 'data:image/gif;base64,R0lGODlhAQABAJEAAAAAAP///////wAAACH5BAEAAAIALAAAAAABAAEAAAICVAEAOw==');
                    $(item).addClass('img-loading');
                    img.on('load', function () {
                        if (img.data("src") == null) {
                            $(item).removeClass('img-loading');
                        } else {
                            $(item).addClass('img-loading');
                        }
                    });
                }
            });
            if (opt.autoscroll && $.isNumeric(opt.autoscroll)) {
                autoTimer = setInterval(function () {
                    obj.next();
                    sign_isAuto = true;
                }, opt.autoscroll * 1);
            }
            $this.css("height", opt.height);
            $wrap.css("height", opt.height + 21);
            prevLink.click(function (e) {
                obj.prev();
                return false;
            });
            nextLink.click(function (e) {
                obj.next();
                return false;
            });
            $this.append(prevLink);
            $this.append(nextLink);
            obj = {
                prev: function () {
                    return _prev();
                },
                next: function () {
                    return _next();
                },
                go: function (index) {
                    return _go(index);
                },
                option: _option
            };
            $(document).on("dom.resize.shifter", function () {
                _resize();
                _scroll();
            });
            $wrap.on("scroll", function () {
                if (timer) {
                    clearTimeout(timer);
                }
                timer = setTimeout(_scroll, 500);
            });
            $(document).on("dom.keydown", function (ctx, e) {
                if (e.keyCode == '37') {
                    obj.prev();
                }
                if (e.keyCode == '39') {
                    obj.next();
                }
            });
            _resize();
            _scroll();
            $this.data("shifter", obj);
            $this.attr('role', 'Shifter');
            if (opt.onafter) {
                if ($.isFunction(opt.onafter)) {
                    opt.onchange($this);
                } else {
                    $(document).trigger(opt.onafter, [$this]);
                }
            }
            return obj;
        };
        return _init();
    };

    $(document).on("dom.load.shifter", function () {
        $("[data-shifter]").each(function () {
            var $this = $(this);
            $this.shifter($this.data());
            $this.removeAttr('data-shifter');
        });
    });
})(jQuery);
