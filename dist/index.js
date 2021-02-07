"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.json = exports.ajax = exports.url = exports.defaultInit = void 0;
/**
 * Content-Type for JSON without UTF-8.
 */
var JSON_CONTENT_TYPE_BASIC = 'application/json';
/**
 * Content-Type for JSON with UTF-8.
 */
var JSON_CONTENT_TYPE_UTF8 = JSON_CONTENT_TYPE_BASIC + '; charset=utf-8';
/**
 * Default options for every request.
 */
exports.defaultInit = {
    headers: {}
};
/**
 * Helper for inline building a URL.
 * @param url The URL.
 * @param query The search params.
 */
exports.url = function (p) {
    if (typeof p === 'string') {
        return p;
    }
    var url = '';
    if (Array.isArray(p.url)) {
        url = p.url
            .filter(function (element) { return element !== null && element !== undefined; })
            .map(function (element) { return encodeURIComponent(element.toString()); })
            .join('/');
    }
    else {
        url = p.url;
    }
    var obj = new URL(url, p.origin || window.location.origin);
    if (p.protocol) {
        obj.protocol = p.protocol;
    }
    if (p.port) {
        obj.port = p.port.toString(10);
    }
    if (p.hash) {
        obj.hash = p.hash;
    }
    if (p.username) {
        obj.username = p.username;
    }
    if (p.password) {
        obj.password = p.password;
    }
    if (p.search) {
        for (var key in p.search) {
            var value = p.search[key];
            if (p.search.hasOwnProperty(key) && value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                    // Multiple query values
                    for (var i = 0; i < value.length; i++) {
                        var valueI = value[i];
                        if (valueI !== undefined && valueI !== null) {
                            obj.searchParams.append(key, valueI.toString());
                        }
                    }
                }
                else {
                    // Single query value
                    obj.searchParams.set(key, value.toString());
                }
            }
        }
    }
    return obj.toString();
};
/**
 * Makes an AJAX request.
 * @param req The request.
 * @param init Some details.
 */
exports.ajax = function (req, init) {
    if (init === void 0) { init = {}; }
    return __awaiter(void 0, void 0, void 0, function () {
        var headers, res, type, json_1, text;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    headers = new Headers();
                    mergeHeaders(headers, exports.defaultInit.headers);
                    if (init.headers) {
                        mergeHeaders(headers, init.headers);
                    }
                    init.headers = headers;
                    init = Object.assign({}, exports.defaultInit, init);
                    // https://muffinman.io/uploading-files-using-fetch-multipart-form-data/
                    if (init.body instanceof FormData && init.headers) {
                        deleteHeader(init.headers, 'content-type');
                    }
                    return [4 /*yield*/, fetch(exports.url(req), init)];
                case 1:
                    res = _a.sent();
                    if (!(!res.ok && !init.allowNonSuccessStatusCode)) return [3 /*break*/, 5];
                    type = res.headers.get('content-type');
                    if (!(type && type.toLowerCase().startsWith(JSON_CONTENT_TYPE_BASIC))) return [3 /*break*/, 3];
                    return [4 /*yield*/, res.json()];
                case 2:
                    json_1 = _a.sent();
                    throw new APIError({
                        status: res.status,
                        code: 'code' in json_1 ? json_1.code : res.statusText,
                        message: 'message' in json_1 ? json_1.message : res.statusText,
                        details: json_1
                    });
                case 3: return [4 /*yield*/, res.text()];
                case 4:
                    text = _a.sent();
                    throw new APIError({
                        status: res.status,
                        code: res.statusText,
                        message: text || res.statusText,
                        details: {}
                    });
                case 5: return [2 /*return*/, res];
            }
        });
    });
};
/**
 * Loads the given request as JSON. You can also pass request JSON in the `json` prop.
 * Automatically sets the headers `accept` and `content-type` to `application/json; charset=utf-8`.
 * @param req The request.
 * @param init Some details.
 * @param init.json Pass the JSON payload here. The payload will be transformed to JSON using
 * `JSON.stringify`. Should this not be sufficent this parameter can be omitted and the already
 * seralized JSON may be passed as the body.
 */
exports.json = function (req, _a) {
    if (_a === void 0) { _a = {}; }
    return __awaiter(void 0, void 0, void 0, function () {
        var body, headers, res;
        var json = _a.json, init = __rest(_a, ["json"]);
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    body = json ? JSON.stringify(json) : init.body;
                    headers = new Headers();
                    if (init.headers) {
                        mergeHeaders(headers, init.headers);
                    }
                    headers.set('accept', JSON_CONTENT_TYPE_UTF8);
                    headers.set('content-type', JSON_CONTENT_TYPE_UTF8);
                    init = __assign(__assign({}, init), { body: body, headers: headers });
                    return [4 /*yield*/, exports.ajax(req, init)];
                case 1:
                    res = _b.sent();
                    return [4 /*yield*/, res.json()];
                case 2: return [2 /*return*/, _b.sent()];
            }
        });
    });
};
var mergeHeaders = function (target, source, overwrite) {
    if (overwrite === void 0) { overwrite = true; }
    var setHeader = function (header, value) {
        return overwrite
            ? target.set(header, value)
            : target.append(header, value);
    };
    if (source instanceof Headers) {
        source.forEach(function (value, header) {
            setHeader(header, value);
        });
    }
    else if (Array.isArray(source)) {
        for (var i = 0; i < source.length; i++) {
            setHeader(source[i][0], source[i][1]);
        }
    }
    else {
        for (var header in source) {
            var value = source[header];
            setHeader(header, value);
        }
    }
};
var getHeader = function (h, name) {
    if (h instanceof Headers) {
        return h.get(name);
    }
    else if (Array.isArray(h)) {
        var entry = h.find(function (h) { return h[0].toLowerCase() === name.toLowerCase(); });
        return entry !== undefined ? entry[1] : null;
    }
    else {
        var entry = h[name];
        return entry !== undefined ? entry : null;
    }
};
var deleteHeader = function (h, name) { return setHeader(h, name, undefined); };
var setHeader = function (h, name, value) {
    if (h instanceof Headers) {
        if (value !== undefined) {
            h.set(name, value);
        }
        else {
            h.delete(name);
        }
    }
    else if (Array.isArray(h)) {
        var entry = h.findIndex(function (h) { return h[0].toLowerCase() === name.toLowerCase(); });
        if (entry !== -1 && value !== undefined) {
            h[entry][1] = value;
        }
        else if (entry !== -1 && value === undefined) {
            delete h[entry];
        }
        else if (entry === -1 && value !== undefined) {
            h.push([name, value]);
        }
    }
    else {
        if (value !== undefined) {
            h[name] = value;
        }
        else {
            delete h[name];
        }
    }
};
var APIError = /** @class */ (function (_super) {
    __extends(APIError, _super);
    function APIError(error) {
        var _this = _super.call(this, error.message) || this;
        _this.$code = error.code;
        _this.$details = error.details;
        _this.$status = error.status;
        // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        // Set the prototype explicitly.
        Object.setPrototypeOf(_this, APIError.prototype);
        // Capture the stack trace
        var myError = Error;
        if (myError.captureStackTrace) {
            myError.captureStackTrace(_this, _this.constructor);
        }
        return _this;
    }
    Object.defineProperty(APIError.prototype, "code", {
        /**
         * The error code. Typically the name of the error class.
         */
        get: function () {
            return this.$code;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(APIError.prototype, "status", {
        /**
         * The HTTP status code of this error.
         */
        get: function () {
            return this.$status;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(APIError.prototype, "details", {
        /**
         * The error details.
         */
        get: function () {
            return this.$details;
        },
        enumerable: false,
        configurable: true
    });
    return APIError;
}(Error));
exports.default = APIError;
