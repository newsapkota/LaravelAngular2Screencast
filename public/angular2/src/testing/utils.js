'use strict';var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('angular2/core');
var collection_1 = require('angular2/src/facade/collection');
var dom_adapter_1 = require('angular2/src/platform/dom/dom_adapter');
var lang_1 = require('angular2/src/facade/lang');
var Log = (function () {
    function Log() {
        this._result = [];
    }
    Log.prototype.add = function (value) { this._result.push(value); };
    Log.prototype.fn = function (value) {
        var _this = this;
        return function (a1, a2, a3, a4, a5) {
            if (a1 === void 0) { a1 = null; }
            if (a2 === void 0) { a2 = null; }
            if (a3 === void 0) { a3 = null; }
            if (a4 === void 0) { a4 = null; }
            if (a5 === void 0) { a5 = null; }
            _this._result.push(value);
        };
    };
    Log.prototype.clear = function () { this._result = []; };
    Log.prototype.result = function () { return this._result.join("; "); };
    Log = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], Log);
    return Log;
})();
exports.Log = Log;
var BrowserDetection = (function () {
    function BrowserDetection(ua) {
        if (lang_1.isPresent(ua)) {
            this._ua = ua;
        }
        else {
            this._ua = lang_1.isPresent(dom_adapter_1.DOM) ? dom_adapter_1.DOM.getUserAgent() : '';
        }
    }
    Object.defineProperty(BrowserDetection.prototype, "isFirefox", {
        get: function () { return this._ua.indexOf('Firefox') > -1; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BrowserDetection.prototype, "isAndroid", {
        get: function () {
            return this._ua.indexOf('Mozilla/5.0') > -1 && this._ua.indexOf('Android') > -1 &&
                this._ua.indexOf('AppleWebKit') > -1 && this._ua.indexOf('Chrome') == -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BrowserDetection.prototype, "isEdge", {
        get: function () { return this._ua.indexOf('Edge') > -1; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BrowserDetection.prototype, "isIE", {
        get: function () { return this._ua.indexOf('Trident') > -1; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BrowserDetection.prototype, "isWebkit", {
        get: function () {
            return this._ua.indexOf('AppleWebKit') > -1 && this._ua.indexOf('Edge') == -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BrowserDetection.prototype, "isIOS7", {
        get: function () {
            return this._ua.indexOf('iPhone OS 7') > -1 || this._ua.indexOf('iPad OS 7') > -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BrowserDetection.prototype, "isSlow", {
        get: function () { return this.isAndroid || this.isIE || this.isIOS7; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BrowserDetection.prototype, "supportsIntlApi", {
        // The Intl API is only properly supported in recent Chrome and Opera.
        // Note: Edge is disguised as Chrome 42, so checking the "Edge" part is needed,
        // see https://msdn.microsoft.com/en-us/library/hh869301(v=vs.85).aspx
        get: function () {
            return this._ua.indexOf('Chrome/4') > -1 && this._ua.indexOf('Edge') == -1;
        },
        enumerable: true,
        configurable: true
    });
    return BrowserDetection;
})();
exports.BrowserDetection = BrowserDetection;
exports.browserDetection = new BrowserDetection(null);
function dispatchEvent(element, eventType) {
    dom_adapter_1.DOM.dispatchEvent(element, dom_adapter_1.DOM.createEvent(eventType));
}
exports.dispatchEvent = dispatchEvent;
function el(html) {
    return dom_adapter_1.DOM.firstChild(dom_adapter_1.DOM.content(dom_adapter_1.DOM.createTemplate(html)));
}
exports.el = el;
var _RE_SPECIAL_CHARS = ['-', '[', ']', '/', '{', '}', '\\', '(', ')', '*', '+', '?', '.', '^', '$', '|'];
var _ESCAPE_RE = lang_1.RegExpWrapper.create("[\\" + _RE_SPECIAL_CHARS.join('\\') + "]");
function containsRegexp(input) {
    return lang_1.RegExpWrapper.create(lang_1.StringWrapper.replaceAllMapped(input, _ESCAPE_RE, function (match) { return ("\\" + match[0]); }));
}
exports.containsRegexp = containsRegexp;
function normalizeCSS(css) {
    css = lang_1.StringWrapper.replaceAll(css, /\s+/g, ' ');
    css = lang_1.StringWrapper.replaceAll(css, /:\s/g, ':');
    css = lang_1.StringWrapper.replaceAll(css, /'/g, '"');
    css = lang_1.StringWrapper.replaceAll(css, / }/g, '}');
    css = lang_1.StringWrapper.replaceAllMapped(css, /url\((\"|\s)(.+)(\"|\s)\)(\s*)/g, function (match) { return ("url(\"" + match[2] + "\")"); });
    css = lang_1.StringWrapper.replaceAllMapped(css, /\[(.+)=([^"\]]+)\]/g, function (match) { return ("[" + match[1] + "=\"" + match[2] + "\"]"); });
    return css;
}
exports.normalizeCSS = normalizeCSS;
var _singleTagWhitelist = ['br', 'hr', 'input'];
function stringifyElement(el) {
    var result = '';
    if (dom_adapter_1.DOM.isElementNode(el)) {
        var tagName = dom_adapter_1.DOM.tagName(el).toLowerCase();
        // Opening tag
        result += "<" + tagName;
        // Attributes in an ordered way
        var attributeMap = dom_adapter_1.DOM.attributeMap(el);
        var keys = [];
        attributeMap.forEach(function (v, k) { return keys.push(k); });
        collection_1.ListWrapper.sort(keys);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var attValue = attributeMap.get(key);
            if (!lang_1.isString(attValue)) {
                result += " " + key;
            }
            else {
                result += " " + key + "=\"" + attValue + "\"";
            }
        }
        result += '>';
        // Children
        var childrenRoot = dom_adapter_1.DOM.templateAwareRoot(el);
        var children = lang_1.isPresent(childrenRoot) ? dom_adapter_1.DOM.childNodes(childrenRoot) : [];
        for (var j = 0; j < children.length; j++) {
            result += stringifyElement(children[j]);
        }
        // Closing tag
        if (!collection_1.ListWrapper.contains(_singleTagWhitelist, tagName)) {
            result += "</" + tagName + ">";
        }
    }
    else if (dom_adapter_1.DOM.isCommentNode(el)) {
        result += "<!--" + dom_adapter_1.DOM.nodeValue(el) + "-->";
    }
    else {
        result += dom_adapter_1.DOM.getText(el);
    }
    return result;
}
exports.stringifyElement = stringifyElement;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhbmd1bGFyMi9zcmMvdGVzdGluZy91dGlscy50cyJdLCJuYW1lcyI6WyJMb2ciLCJMb2cuY29uc3RydWN0b3IiLCJMb2cuYWRkIiwiTG9nLmZuIiwiTG9nLmNsZWFyIiwiTG9nLnJlc3VsdCIsIkJyb3dzZXJEZXRlY3Rpb24iLCJCcm93c2VyRGV0ZWN0aW9uLmNvbnN0cnVjdG9yIiwiQnJvd3NlckRldGVjdGlvbi5pc0ZpcmVmb3giLCJCcm93c2VyRGV0ZWN0aW9uLmlzQW5kcm9pZCIsIkJyb3dzZXJEZXRlY3Rpb24uaXNFZGdlIiwiQnJvd3NlckRldGVjdGlvbi5pc0lFIiwiQnJvd3NlckRldGVjdGlvbi5pc1dlYmtpdCIsIkJyb3dzZXJEZXRlY3Rpb24uaXNJT1M3IiwiQnJvd3NlckRldGVjdGlvbi5pc1Nsb3ciLCJCcm93c2VyRGV0ZWN0aW9uLnN1cHBvcnRzSW50bEFwaSIsImRpc3BhdGNoRXZlbnQiLCJlbCIsImNvbnRhaW5zUmVnZXhwIiwibm9ybWFsaXplQ1NTIiwic3RyaW5naWZ5RWxlbWVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEscUJBQXlCLGVBQWUsQ0FBQyxDQUFBO0FBQ3pDLDJCQUFzQyxnQ0FBZ0MsQ0FBQyxDQUFBO0FBQ3ZFLDRCQUFrQix1Q0FBdUMsQ0FBQyxDQUFBO0FBQzFELHFCQUF3RSwwQkFBMEIsQ0FBQyxDQUFBO0FBRW5HO0lBS0VBO1FBQWdCQyxJQUFJQSxDQUFDQSxPQUFPQSxHQUFHQSxFQUFFQSxDQUFDQTtJQUFDQSxDQUFDQTtJQUVwQ0QsaUJBQUdBLEdBQUhBLFVBQUlBLEtBQUtBLElBQVVFLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO0lBRTlDRixnQkFBRUEsR0FBRkEsVUFBR0EsS0FBS0E7UUFBUkcsaUJBRUNBO1FBRENBLE1BQU1BLENBQUNBLFVBQUNBLEVBQVNBLEVB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LENBQUNBLFlBQVlBLENBQUNBLEdBQUdBLGlCQUFHQSxDQUFDQSxVQUFVQSxDQUFDQSxZQUFZQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQTtRQUMzRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsUUFBUUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7WUFDekNBLE1BQU1BLElBQUlBLGdCQUFnQkEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDMUNBLENBQUNBO1FBRURBLGNBQWNBO1FBQ2RBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLHdCQUFXQSxDQUFDQSxRQUFRQSxDQUFDQSxtQkFBbUJBLEVBQUVBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3hEQSxNQUFNQSxJQUFJQSxPQUFLQSxPQUFPQSxNQUFHQSxDQUFDQTtRQUM1QkEsQ0FBQ0E7SUFDSEEsQ0FBQ0E7SUFBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsaUJBQUdBLENBQUNBLGFBQWFBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1FBQ2pDQSxNQUFNQSxJQUFJQSxTQUFPQSxpQkFBR0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsUUFBS0EsQ0FBQ0E7SUFDMUNBLENBQUNBO0lBQUNBLElBQUlBLENBQUNBLENBQUNBO1FBQ05BLE1BQU1BLElBQUlBLGlCQUFHQSxDQUFDQSxPQUFPQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQTtJQUM1QkEsQ0FBQ0E7SUFFREEsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7QUFDaEJBLENBQUNBO0FBMUNlLHdCQUFnQixtQkEwQy9CLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuaW1wb3J0IHtMaXN0V3JhcHBlciwgTWFwV3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcbmltcG9ydCB7RE9NfSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vZG9tL2RvbV9hZGFwdGVyJztcbmltcG9ydCB7aXNQcmVzZW50LCBpc1N0cmluZywgUmVnRXhwV3JhcHBlciwgU3RyaW5nV3JhcHBlciwgUmVnRXhwfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTG9nIHtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcmVzdWx0OiBhbnlbXTtcblxuICBjb25zdHJ1Y3RvcigpIHsgdGhpcy5fcmVzdWx0ID0gW107IH1cblxuICBhZGQodmFsdWUpOiB2b2lkIHsgdGhpcy5fcmVzdWx0LnB1c2godmFsdWUpOyB9XG5cbiAgZm4odmFsdWUpIHtcbiAgICByZXR1cm4gKGExID0gbnVsbCwgYTIgPSBudWxsLCBhMyA9IG51bGwsIGE0ID0gbnVsbCwgYTUgPSBudWxsKSA9PiB7IHRoaXMuX3Jlc3VsdC5wdXNoKHZhbHVlKTsgfVxuICB9XG5cbiAgY2xlYXIoKTogdm9pZCB7IHRoaXMuX3Jlc3VsdCA9IFtdOyB9XG5cbiAgcmVzdWx0KCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9yZXN1bHQuam9pbihcIjsgXCIpOyB9XG59XG5cblxuZXhwb3J0IGNsYXNzIEJyb3dzZXJEZXRlY3Rpb24ge1xuICBwcml2YXRlIF91YTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHVhOiBzdHJpbmcpIHtcbiAgICBpZiAoaXNQcmVzZW50KHVhKSkge1xuICAgICAgdGhpcy5fdWEgPSB1YTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdWEgPSBpc1ByZXNlbnQoRE9NKSA/IERPTS5nZXRVc2VyQWdlbnQoKSA6ICcnO1xuICAgIH1cbiAgfVxuXG4gIGdldCBpc0ZpcmVmb3goKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl91YS5pbmRleE9mKCdGaXJlZm94JykgPiAtMTsgfVxuXG4gIGdldCBpc0FuZHJvaWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3VhLmluZGV4T2YoJ01vemlsbGEvNS4wJykgPiAtMSAmJiB0aGlzLl91YS5pbmRleE9mKCdBbmRyb2lkJykgPiAtMSAmJlxuICAgICAgICAgICB0aGlzLl91YS5pbmRleE9mKCdBcHBsZVdlYktpdCcpID4gLTEgJiYgdGhpcy5fdWEuaW5kZXhPZignQ2hyb21lJykgPT0gLTE7XG4gIH1cblxuICBnZXQgaXNFZGdlKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fdWEuaW5kZXhPZignRWRnZScpID4gLTE7IH1cblxuICBnZXQgaXNJRSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX3VhLmluZGV4T2YoJ1RyaWRlbnQnKSA+IC0xOyB9XG5cbiAgZ2V0IGlzV2Via2l0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl91YS5pbmRleE9mKCdBcHBsZVdlYktpdCcpID4gLTEgJiYgdGhpcy5fdWEuaW5kZXhPZignRWRnZScpID09IC0xO1xuICB9XG5cbiAgZ2V0IGlzSU9TNygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fdWEuaW5kZXhPZignaVBob25lIE9TIDcnKSA+IC0xIHx8IHRoaXMuX3VhLmluZGV4T2YoJ2lQYWQgT1MgNycpID4gLTE7XG4gIH1cblxuICBnZXQgaXNTbG93KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5pc0FuZHJvaWQgfHwgdGhpcy5pc0lFIHx8IHRoaXMuaXNJT1M3OyB9XG5cbiAgLy8gVGhlIEludGwgQVBJIGlzIG9ubHkgcHJvcGVybHkgc3VwcG9ydGVkIGluIHJlY2VudCBDaHJvbWUgYW5kIE9wZXJhLlxuICAvLyBOb3RlOiBFZGdlIGlzIGRpc2d1aXNlZCBhcyBDaHJvbWUgNDIsIHNvIGNoZWNraW5nIHRoZSBcIkVkZ2VcIiBwYXJ0IGlzIG5lZWRlZCxcbiAgLy8gc2VlIGh0dHBzOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvaGg4NjkzMDEodj12cy44NSkuYXNweFxuICBnZXQgc3VwcG9ydHNJbnRsQXBpKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl91YS5pbmRleE9mKCdDaHJvbWUvNCcpID4gLTEgJiYgdGhpcy5fdWEuaW5kZXhPZignRWRnZScpID09IC0xO1xuICB9XG59XG5leHBvcnQgdmFyIGJyb3dzZXJEZXRlY3Rpb246IEJyb3dzZXJEZXRlY3Rpb24gPSBuZXcgQnJvd3NlckRldGVjdGlvbihudWxsKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BhdGNoRXZlbnQoZWxlbWVudCwgZXZlbnRUeXBlKTogdm9pZCB7XG4gIERPTS5kaXNwYXRjaEV2ZW50KGVsZW1lbnQsIERPTS5jcmVhdGVFdmVudChldmVudFR5cGUpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVsKGh0bWw6IHN0cmluZyk6IEhUTUxFbGVtZW50IHtcbiAgcmV0dXJuIDxIVE1MRWxlbWVudD5ET00uZmlyc3RDaGlsZChET00uY29udGVudChET00uY3JlYXRlVGVtcGxhdGUoaHRtbCkpKTtcbn1cblxudmFyIF9SRV9TUEVDSUFMX0NIQVJTID1cbiAgICBbJy0nLCAnWycsICddJywgJy8nLCAneycsICd9JywgJ1xcXFwnLCAnKCcsICcpJywgJyonLCAnKycsICc/JywgJy4nLCAnXicsICckJywgJ3wnXTtcbnZhciBfRVNDQVBFX1JFID0gUmVnRXhwV3JhcHBlci5jcmVhdGUoYFtcXFxcJHtfUkVfU1BFQ0lBTF9DSEFSUy5qb2luKCdcXFxcJyl9XWApO1xuZXhwb3J0IGZ1bmN0aW9uIGNvbnRhaW5zUmVnZXhwKGlucHV0OiBzdHJpbmcpOiBSZWdFeHAge1xuICByZXR1cm4gUmVnRXhwV3JhcHBlci5jcmVhdGUoXG4gICAgICBTdHJpbmdXcmFwcGVyLnJlcGxhY2VBbGxNYXBwZWQoaW5wdXQsIF9FU0NBUEVfUkUsIChtYXRjaCkgPT4gYFxcXFwke21hdGNoWzBdfWApKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUNTUyhjc3M6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNzcyA9IFN0cmluZ1dyYXBwZXIucmVwbGFjZUFsbChjc3MsIC9cXHMrL2csICcgJyk7XG4gIGNzcyA9IFN0cmluZ1dyYXBwZXIucmVwbGFjZUFsbChjc3MsIC86XFxzL2csICc6Jyk7XG4gIGNzcyA9IFN0cmluZ1dyYXBwZXIucmVwbGFjZUFsbChjc3MsIC8nL2csICdcIicpO1xuICBjc3MgPSBTdHJpbmdXcmFwcGVyLnJlcGxhY2VBbGwoY3NzLCAvIH0vZywgJ30nKTtcbiAgY3NzID0gU3RyaW5nV3JhcHBlci5yZXBsYWNlQWxsTWFwcGVkKGNzcywgL3VybFxcKChcXFwifFxccykoLispKFxcXCJ8XFxzKVxcKShcXHMqKS9nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG1hdGNoKSA9PiBgdXJsKFwiJHttYXRjaFsyXX1cIilgKTtcbiAgY3NzID0gU3RyaW5nV3JhcHBlci5yZXBsYWNlQWxsTWFwcGVkKGNzcywgL1xcWyguKyk9KFteXCJcXF1dKylcXF0vZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChtYXRjaCkgPT4gYFske21hdGNoWzFdfT1cIiR7bWF0Y2hbMl19XCJdYCk7XG4gIHJldHVybiBjc3M7XG59XG5cbnZhciBfc2luZ2xlVGFnV2hpdGVsaXN0ID0gWydicicsICdocicsICdpbnB1dCddO1xuZXhwb3J0IGZ1bmN0aW9uIHN0cmluZ2lmeUVsZW1lbnQoZWwpOiBzdHJpbmcge1xuICB2YXIgcmVzdWx0ID0gJyc7XG4gIGlmIChET00uaXNFbGVtZW50Tm9kZShlbCkpIHtcbiAgICB2YXIgdGFnTmFtZSA9IERPTS50YWdOYW1lKGVsKS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgLy8gT3BlbmluZyB0YWdcbiAgICByZXN1bHQgKz0gYDwke3RhZ05hbWV9YDtcblxuICAgIC8vIEF0dHJpYnV0ZXMgaW4gYW4gb3JkZXJlZCB3YXlcbiAgICB2YXIgYXR0cmlidXRlTWFwID0gRE9NLmF0dHJpYnV0ZU1hcChlbCk7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBhdHRyaWJ1dGVNYXAuZm9yRWFjaCgodiwgaykgPT4ga2V5cy5wdXNoKGspKTtcbiAgICBMaXN0V3JhcHBlci5zb3J0KGtleXMpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGtleSA9IGtleXNbaV07XG4gICAgICB2YXIgYXR0VmFsdWUgPSBhdHRyaWJ1dGVNYXAuZ2V0KGtleSk7XG4gICAgICBpZiAoIWlzU3RyaW5nKGF0dFZhbHVlKSkge1xuICAgICAgICByZXN1bHQgKz0gYCAke2tleX1gO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0ICs9IGAgJHtrZXl9PVwiJHthdHRWYWx1ZX1cImA7XG4gICAgICB9XG4gICAgfVxuICAgIHJlc3VsdCArPSAnPic7XG5cbiAgICAvLyBDaGlsZHJlblxuICAgIHZhciBjaGlsZHJlblJvb3QgPSBET00udGVtcGxhdGVBd2FyZVJvb3QoZWwpO1xuICAgIHZhciBjaGlsZHJlbiA9IGlzUHJlc2VudChjaGlsZHJlblJvb3QpID8gRE9NLmNoaWxkTm9kZXMoY2hpbGRyZW5Sb290KSA6IFtdO1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcbiAgICAgIHJlc3VsdCArPSBzdHJpbmdpZnlFbGVtZW50KGNoaWxkcmVuW2pdKTtcbiAgICB9XG5cbiAgICAvLyBDbG9zaW5nIHRhZ1xuICAgIGlmICghTGlzdFdyYXBwZXIuY29udGFpbnMoX3NpbmdsZVRhZ1doaXRlbGlzdCwgdGFnTmFtZSkpIHtcbiAgICAgIHJlc3VsdCArPSBgPC8ke3RhZ05hbWV9PmA7XG4gICAgfVxuICB9IGVsc2UgaWYgKERPTS5pc0NvbW1lbnROb2RlKGVsKSkge1xuICAgIHJlc3VsdCArPSBgPCEtLSR7RE9NLm5vZGVWYWx1ZShlbCl9LS0+YDtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQgKz0gRE9NLmdldFRleHQoZWwpO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiJdfQ==