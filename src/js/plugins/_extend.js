if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}
var tmpdiv = null;
(function ($) {
    $.extend({
        getTextWidth: function (text, fontsize) {
            fontSize = fontsize || $('body').css('fontSize').replace(/[a-z]/g,'') * 1;
            if (!tmpdiv) {
                tmpdiv = $("<div></div>").css({
                    position: 'absolute',
                    visibility: 'hidden',
                    height: 'auto',
                    width: 'auto',
                    whiteSpace: 'nowrap'
                });
                $('body').append(tmpdiv);
            }
            tmpdiv.css('fontSize',fontsize);
            tmpdiv.text(text);
            return tmpdiv.width();
        },
        insertCSS: function (selector, rules, contxt) {
            var context = contxt || document,
                stylesheet;

            if (typeof context.styleSheets == 'object') {
                if (context.styleSheets.length) {
                    stylesheet = context.styleSheets[context.styleSheets.length - 1];
                }
                if (context.styleSheets.length) {
                    if (context.createStyleSheet) {
                        stylesheet = context.createStyleSheet();
                    } else {
                        context.getElementsByTagName('head')[0].appendChild(context.createElement('style'));
                        stylesheet = context.styleSheets[context.styleSheets.length - 1];
                    }
                }
                if (stylesheet.addRule) {
                    for (var i = 0; i < selector.length; ++i) {
                        stylesheet.addRule(selector[i], rules);
                    }
                } else {
                    stylesheet.insertRule(selector.join(',') + '{' + rules + '}', stylesheet.cssRules.length);
                }
            }
        },
        isMobile: function () {
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                return true;
            } else {
                return false;
            }
        }
    });
})(jQuery);
