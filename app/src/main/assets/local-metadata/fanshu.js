// Metadata-only adapter. Playback remains in the authenticated server core.
globalThis.__niviiDetailRelatedVersion=1;
(function(){
var __auv_console = (typeof console !== 'undefined') ? console : { log: function(){}, error: function(){}, warn: function(){} };
var __auv_crypto = globalThis.CryptoJS || {};
var __auv_http_req = (typeof auvHttp === 'function' ? auvHttp : (globalThis.req || globalThis._http));
var timestamp = Math.floor(Date.now() / 1000);
function log(message) { try { __auv_console.log(String(message)); } catch (e) {} }
function base64Encode(value) { try { return __auv_crypto.enc.Base64.stringify(__auv_crypto.enc.Utf8.parse(value == null ? '' : String(value))); } catch (e) { return ''; } }
function base64Decode(value) { try { return __auv_crypto.enc.Base64.parse(value == null ? '' : String(value)).toString(__auv_crypto.enc.Utf8); } catch (e) { return ''; } }
function sha256(value) { value = value == null ? '' : String(value); try { return __auv_crypto.SHA256(value).toString(); } catch (e) { return ''; } }
function parseJson(value, fallback) { if (value == null || value === '') return fallback == null ? null : fallback; if (typeof value !== 'string') return value; try { return JSON.parse(value); } catch (e) { return fallback == null ? null : fallback; } }
function match(text, regex, group) { var m = String(text || '').match(new RegExp(regex)); return m ? (m[group || 0] || '') : ''; }
function request(url, options) { var res = __auv_http_req(url, __auv_options(options, 'get')); return res && res.content != null ? String(res.content) : ''; }
function post(url, body, options) {
    var opt;
    if (options == null && (typeof body === 'string' || typeof body === 'object') && body && String(body).indexOf('{') === 0) {
        opt = __auv_options(body, 'post');
    } else {
        opt = __auv_options(options, 'post');
        if (body != null && typeof body === 'object') {
            opt.data = body;
            opt.postType = opt.postType || 'json';
        } else {
            opt.body = body == null ? '' : String(body);
            var h = opt.headers || (opt.headers = {});
            var hasType = false;
            for (var k in h) if (String(k).toLowerCase() === 'content-type') hasType = true;
            if (!hasType) h['Content-Type'] = (/^\s*[\[{]/.test(opt.body)) ? 'application/json; charset=utf-8' : 'application/x-www-form-urlencoded; charset=utf-8';
        }
    }
    var res = __auv_http_req(url, opt);
    return res && res.content != null ? String(res.content) : '';
}
function __auv_word(value, format) {
    var text = value == null ? '' : String(value);
    format = String(format || 'utf8').toLowerCase();
    if (format === 'hex') return __auv_crypto.enc.Hex.parse(text);
    if (format === 'base64') return __auv_crypto.enc.Base64.parse(text);
    return __auv_crypto.enc.Utf8.parse(text);
}
function __auv_output(word, format) {
    format = String(format || 'hex').toLowerCase();
    if (format === 'base64') return word.toString(__auv_crypto.enc.Base64);
    if (format === 'utf8' || format === 'text') return word.toString(__auv_crypto.enc.Utf8);
    return word.toString(__auv_crypto.enc.Hex);
}
function __auv_hash(algo, text, options) {
    var fn = __auv_crypto[String(algo || '').replace(/-/g, '').toUpperCase()] || __auv_crypto.SHA256;
    return __auv_output(fn(__auv_word(text, options && options.input)), options && options.output);
}
function __auv_hmac(algo, key, text, options) {
    var name = String(algo || '').replace(/-/g, '').toUpperCase();
    var fn = __auv_crypto['Hmac' + (name === 'SHA1' ? 'SHA1' : name === 'MD5' ? 'MD5' : 'SHA256')] || __auv_crypto.HmacSHA256;
    return __auv_output(fn(__auv_word(text, options && options.input), __auv_word(key, options && options.keyFormat)), options && options.output);
}
function __auv_aes(value, key, options, decrypting) {
    options = options || {};
    var cfg = {};
    var mode = String(options.mode || 'CBC').toUpperCase();
    var padding = String(options.padding || 'Pkcs7');
    if (__auv_crypto.mode && __auv_crypto.mode[mode]) cfg.mode = __auv_crypto.mode[mode];
    if (__auv_crypto.pad && __auv_crypto.pad[padding]) cfg.padding = __auv_crypto.pad[padding];
    if (options.iv != null && options.iv !== '') cfg.iv = __auv_word(options.iv, options.ivFormat || options.keyFormat);
    var keyWord = __auv_word(key, options.keyFormat);
    var dataWord = __auv_word(value, options.input);
    var result = decrypting ? __auv_crypto.AES.decrypt(__auv_crypto.lib.CipherParams.create({ ciphertext: dataWord }), keyWord, cfg) : __auv_crypto.AES.encrypt(dataWord, keyWord, cfg).ciphertext;
    return __auv_output(result, options.output);
}
function __auv_rsa(value, key, options, decrypting) {
    options = options || {};
    if (typeof rsaX !== 'function') return '';
    var input = __auv_output(__auv_word(value, options.input), 'base64');
    var raw = rsaX(options.mode || 'RSA/PKCS1', !decrypting, !decrypting, input, true, String(key || ''), true);
    return __auv_output(__auv_word(raw, 'base64'), options.output);
}
var crypto = globalThis.crypto;
if (!crypto || typeof crypto.hash !== 'function' || !crypto.aes) {
    crypto = {
        hash: __auv_hash,
        hmac: __auv_hmac,
        aes: { encrypt: function(v, k, o) { return __auv_aes(v, k, o, false); }, decrypt: function(v, k, o) { return __auv_aes(v, k, o, true); } },
        rsa: { encrypt: function(v, k, o) { return __auv_rsa(v, k, o, false); }, decrypt: function(v, k, o) { return __auv_rsa(v, k, o, true); } },
        base64: { encode: base64Encode, decode: base64Decode }
    };
    globalThis.crypto = crypto;
}
function __auv_options(options, method) {
    var opt = {};
    if (typeof options === 'string') opt = parseJson(options, {}) || {};
    else if (options) opt = options;
    opt.method = method || opt.method || 'get';
    opt.async = false;
    if (!opt.headers) opt.headers = {};
    return opt;
}
var FANSHU_TOKEN = 'yoapp_a682c34e5cc0e0c38b4f749475074db7281791ad';
var FANSHU_VERSION = '1.4.0';
var FANSHU_APP_SIGNATURE = '1F83BDCA0957AADDCD3CE53088D60FD228ADC463EBA105495E4EBAE6962B54D6';
var FANSHU_SALT = '8124fb976064d07a5c6af58c771f1c87';
var FANSHU_DEFAULT_DEVICE_ID = '4a2af182-437a-45eb-9740-b47aeea74ff1';
var FANSHU_DEVICE_ID_KEY = 'fanshu_device_id_v2';
var FANSHU_REQUEST_HEADERS_CACHE_KEY = 'fanshu_request_headers_v1';
var FANSHU_REQUEST_HEADERS_FRESH_MS = 15 * 60 * 1000;
var FANSHU_FALLBACK_REQUEST_HEADERS = [
    { name: 'X-App-Guard-267c6839', value: '1d3f648c193aed385b5aeb096beb76675309c68ea4da0521' },
    { name: 'X-App-Guard-11e5dd28', value: 'a0bd49c572d5f5438f992bd7523d9868800e67041599aa9c' },
    { name: 'X-App-aowucaonima', value: '27b07838a6d58da572f44d862eadf1fe62e91a04520fbb49' },
    { name: 'X-App-Guard-8285a5e2', value: '8a7ae9c5e3cc6e321a4c5757ca21bc1c5f79e9c24cc3930d' },
    { name: 'X-App-auvvaonima', value: 'b7be3f62834ce47c5f47554051f00d192f267e152a9c3f69' }
];
var FANSHU_PRIMARY_HOSTS = [
    'https://yoapp.fsapi.me/yoapp.php',
    'https://yoapp-cf.fsapi.shop/yoapp.php',
    'https://yoapp-do.fsapi.shop/yoapp.php',
    'https://tpewkabdkhkwdwnwcorg.supabase.co/functions/v1/proxy/yoapp-cf.fsapi.shop/yoapp.php',
    'https://tpewkabdkhkwdwnwcorg.supabase.co/functions/v1/proxy/yoapp-do.fsapi.shop/yoapp.php'
];
var FANSHU_LEGACY_HOSTS = [
    'https://yoapp.bytegooty.com/yoapp.php',
    'https://tpewkabdkhkwdwnwcorg.supabase.co/functions/v1/proxy/yoapp.bytegooty.com/yoapp.php',
    'https://tpewkabdkhkwdwnwcorg.supabase.co/functions/v1/proxy/yoapp.fsapi.me/yoapp.php'
];
var FANSHU_HTTP_TIMEOUT = 4500;
var FANSHU_DEAD_HOST_RETRY_MS = 120000;
var FANSHU_HOME_CACHE_FRESH_MS = 10 * 60 * 1000;
var FANSHU_HOME_CACHE_KEY = 'fanshu_home_sections_v2';
var FANSHU_EXT = (function () {
    try {
        if (typeof ext === 'undefined' || !ext) return {};
        if (typeof ext === 'object') return ext;
        if (typeof ext === 'string') {
            var s = ext.replace(/^\s+|\s+$/g, '');
            if (s.charAt(0) === '{') {
                var parsed = (typeof parseJson === 'function') ? parseJson(s) : JSON.parse(s);
                if (parsed && typeof parsed === 'object') return parsed;
            }
            return { host: s };
        }
    } catch (e) {}
    return {};
})();
var FANSHU_DEVICE_ID = _initDeviceId();
var FANSHU_HOSTS = null;
var FANSHU_ACTIVE_HOST = '';
var FANSHU_DEAD_HOSTS = {};
var FANSHU_SECRET = null;
var FANSHU_REQUEST_HEADERS = null;
var FANSHU_REQUEST_HEADERS_SAVED_AT = 0;
var FANSHU_COOKIES = {};
var FANSHU_CHALLENGE_HOST = '';
var FANSHU_NONCE_SEQ = 0;
var FANSHU_HOME = null;
var FANSHU_HOME_SAVED_AT = 0;
var FANSHU_HOME_FAILED_AT = 0;
var FANSHU_DETAIL_CACHE = {};
try {
    if (typeof log === 'function') log('[fanshu] loaded v' + FANSHU_VERSION + ' (dynamic request guard)');
} catch (e) {}
function _deviceCheckChar(value) {
    var compact = String(value || '').toLowerCase().replace(/-/g, '');
    var weights = [3, 5, 7, 11, 13, 17, 19, 23];
    var alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
    if (compact.length !== 32) return '';
    var sum = 0;
    for (var i = 0; i < compact.length; i++) {
        if (i === 1) continue;
        var digit = parseInt(compact.charAt(i), 16);
        if (!isFinite(digit)) return '';
        sum += digit * weights[i % weights.length];
    }
    return alphabet.charAt(sum % alphabet.length);
}
function _validDeviceId(value) {
    var id = String(value || '').toLowerCase();
    if (!/^[0-9a-f][0-9a-z][0-9a-f]{6}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(id)) return false;
    return id.charAt(1) === _deviceCheckChar(id);
}
function _newDeviceId() {
    try {
        var seed = [
            FANSHU_APP_SIGNATURE,
            FANSHU_SALT,
            String(new Date().getTime()),
            String(Math.random()),
            String(Math.random())
        ].join(':');
        var compact = String(_sha256(seed) || '').toLowerCase().replace(/[^0-9a-f]/g, '').substring(0, 32);
        if (compact.length !== 32) throw new Error('device id entropy is unavailable');
        compact = compact.substring(0, 12) + '4' + compact.substring(13);
        var variants = '89ab';
        compact = compact.substring(0, 16) + variants.charAt(parseInt(compact.charAt(16), 16) % 4) + compact.substring(17);
        compact = compact.charAt(0) + _deviceCheckChar(compact) + compact.substring(2);
        var id = compact.substring(0, 8) + '-' + compact.substring(8, 12) + '-' + compact.substring(12, 16) + '-' + compact.substring(16, 20) + '-' + compact.substring(20);
        if (_validDeviceId(id)) return id;
    } catch (e) {}
    return FANSHU_DEFAULT_DEVICE_ID;
}
function _initDeviceId() {
    var custom = FANSHU_EXT.deviceId || FANSHU_EXT.device_id || '';
    if (_validDeviceId(custom)) return String(custom).toLowerCase();
    try {
        if (typeof getItem === 'function') {
            var saved = String(getItem(FANSHU_DEVICE_ID_KEY, '') || '');
            if (_validDeviceId(saved)) return saved.toLowerCase();
            var generated = _newDeviceId();
            if (typeof setItem === 'function') setItem(FANSHU_DEVICE_ID_KEY, generated);
            return generated;
        }
    } catch (e) {}
    return _newDeviceId();
}
function _trim(s) {
    return s == null ? '' : String(s).replace(/^\s+|\s+$/g, '');
}
function _parse(s) {
    if (s == null || s === '') return null;
    if (typeof s === 'object') return s;
    try {
        return typeof parseJson === 'function' ? parseJson(String(s)) : JSON.parse(String(s));
    } catch (e) {
        try { return JSON.parse(String(s)); } catch (e2) { return null; }
    }
}
function _json(o) {
    return JSON.stringify(o == null ? {} : o);
}
function _sha256(s) {
    return sha256(String(s == null ? '' : s));
}
function _rfc3986(s) {
    return encodeURIComponent(String(s == null ? '' : s)).replace(/[!'()*]/g, function (c) {
        return '%' + c.charCodeAt(0).toString(16).toUpperCase();
    });
}
function _queryPairs(obj) {
    var out = [], key, value, values, i;
    obj = obj || {};
    for (key in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
        value = obj[key];
        if (value == null) continue;
        values = Array.isArray(value) ? value : [value];
        for (i = 0; i < values.length; i++) {
            if (values[i] == null) continue;
            out.push([String(key), String(values[i])]);
        }
    }
    return out;
}
function _queryString(obj) {
    var pairs = _queryPairs(obj), out = [], i;
    for (i = 0; i < pairs.length; i++) {
        out.push(_rfc3986(pairs[i][0]) + '=' + _rfc3986(pairs[i][1]));
    }
    return out.join('&');
}
function _canonicalQuery(obj) {
    var pairs = _queryPairs(obj).filter(function (p) {
        return p[0].toLowerCase() !== 'token' && p[0].toLowerCase() !== 'sign';
    });
    pairs.sort(function (a, b) {
        return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0;
    });
    var out = [], i;
    for (i = 0; i < pairs.length; i++) {
        out.push(_rfc3986(pairs[i][0]) + '=' + _rfc3986(pairs[i][1]));
    }
    return out.join('&');
}
function _nowMs() {
    try {
        if (typeof timestamp === 'function') return Number(timestamp());
    } catch (e) {}
    return new Date().getTime();
}
function _nowSec() {
    return Math.floor(_nowMs() / 1000);
}
function _nonce() {
    FANSHU_NONCE_SEQ += 1;
    return _sha256(FANSHU_DEVICE_ID + ':' + _nowMs() + ':' + FANSHU_NONCE_SEQ).substring(0, 32);
}
function _hmacHex(key, message) {
    return crypto.hmac('SHA-256', String(key), String(message), {
        keyFormat: 'utf8',
        output: 'hex'
    });
}
function _hmacBase64Url(key, message) {
    var b64 = crypto.hmac('SHA-256', String(key), String(message), {
        keyFormat: 'utf8',
        output: 'base64'
    });
    return String(b64 || '').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}
function _signature(method, action, query, body, key, fixedTimestamp, fixedNonce) {
    var ts = fixedTimestamp == null ? String(_nowMs()) : String(fixedTimestamp);
    var nonce = fixedNonce || _nonce();
    var message = [
        String(method || 'GET').toUpperCase(),
        '/yoapp.php',
        String(action || ''),
        FANSHU_DEVICE_ID,
        ts,
        nonce,
        _sha256(_canonicalQuery(query || {})),
        _sha256(body || '')
    ].join('\n');
    return {
        timestamp: ts,
        nonce: nonce,
        sign: _hmacBase64Url(key, message),
        message: message
    };
}
function _hostList() {
    if (FANSHU_HOSTS) return FANSHU_HOSTS;
    var out = [], seen = {};
    function add(value) {
        var s = _trim(value);
        if (!s) return;
        if (/^\/?yoapp\.php/i.test(s)) s = 'https://' + s;
        if (!/^https?:\/\//i.test(s)) s = 'https://' + s;
        s = s.replace(/\/+$/, '');
        if (!/\/yoapp\.php$/i.test(s)) s += '/yoapp.php';
        if (!seen[s]) { seen[s] = 1; out.push(s); }
    }
    for (var p = 0; p < FANSHU_PRIMARY_HOSTS.length; p++) add(FANSHU_PRIMARY_HOSTS[p]);
    var custom = FANSHU_EXT.hosts || FANSHU_EXT.host;
    if (Array.isArray(custom)) {
        for (var i = 0; i < custom.length; i++) add(custom[i]);
    } else if (custom) {
        String(custom).split(',').forEach(add);
    }
    for (var j = 0; j < FANSHU_LEGACY_HOSTS.length; j++) add(FANSHU_LEGACY_HOSTS[j]);
    FANSHU_HOSTS = out.length ? out : FANSHU_PRIMARY_HOSTS.concat(FANSHU_LEGACY_HOSTS);
    return FANSHU_HOSTS;
}
function _hostOrder() {
    var all = _hostList(), out = [], seen = {}, now = _nowMs();
    function add(h) {
        if (!h || seen[h]) return;
        var failedAt = Number(FANSHU_DEAD_HOSTS[h] || 0);
        if (failedAt && now - failedAt < FANSHU_DEAD_HOST_RETRY_MS) return;
        seen[h] = 1;
        out.push(h);
    }
    add(FANSHU_ACTIVE_HOST);
    for (var i = 0; i < all.length; i++) add(all[i]);
    return out;
}
function _hostSucceeded(host) {
    FANSHU_ACTIVE_HOST = host;
    delete FANSHU_DEAD_HOSTS[host];
}
function _hostFailed(host, err) {
    if (err && err.auth) return;
    FANSHU_DEAD_HOSTS[host] = _nowMs();
    if (FANSHU_ACTIVE_HOST === host) FANSHU_ACTIVE_HOST = '';
}
function _origin(url) {
    var match = /^(https?:\/\/[^/]+)/i.exec(String(url || ''));
    return match ? match[1] : '';
}
function _cookieHeader(url) {
    var origin = _origin(url), cookies = {}, key;
    if (origin && FANSHU_COOKIES[origin]) {
        for (key in FANSHU_COOKIES[origin]) {
            if (Object.prototype.hasOwnProperty.call(FANSHU_COOKIES[origin], key)) cookies[key] = FANSHU_COOKIES[origin][key];
        }
    }
    try {
        if (origin && typeof http !== 'undefined' && http && typeof http.getCookies === 'function') {
            var builtIn = http.getCookies(origin) || {};
            for (key in builtIn) if (Object.prototype.hasOwnProperty.call(builtIn, key)) cookies[key] = builtIn[key];
        }
    } catch (e) {}
    var out = [];
    for (key in cookies) {
        if (Object.prototype.hasOwnProperty.call(cookies, key) && cookies[key] != null) out.push(key + '=' + String(cookies[key]));
    }
    return out.join('; ');
}
function _captureResponseCookies(url, headers) {
    if (!headers || typeof headers !== 'object') return;
    var values = [], key;
    for (key in headers) {
        if (!Object.prototype.hasOwnProperty.call(headers, key) || String(key).toLowerCase() !== 'set-cookie') continue;
        var value = headers[key];
        if (Array.isArray(value)) values = values.concat(value);
        else values.push(value);
    }
    if (!values.length) return;
    var text = values.join('\n'), found = {}, match;
    var pattern = /(?:^|[\n,]\s*)(YOAPPSESSID|YOAPP_SEARCH_CAPTCHA)=([^;\s,]*)/ig;
    while ((match = pattern.exec(text))) found[match[1]] = match[2];
    if (!Object.keys(found).length) return;
    var origin = _origin(url);
    if (!origin) return;
    if (!FANSHU_COOKIES[origin]) FANSHU_COOKIES[origin] = {};
    for (key in found) if (Object.prototype.hasOwnProperty.call(found, key)) FANSHU_COOKIES[origin][key] = found[key];
    try {
        if (typeof http !== 'undefined' && http && typeof http.setCookies === 'function') http.setCookies(origin, found);
    } catch (e) {}
}
function _headers(signature, secretRequest, omitRuntimeHeaders) {
    var h = {
        'User-Agent': 'Dart',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Yoapp-Device-Id': FANSHU_DEVICE_ID,
        'X-Yoapp-Timestamp': signature.timestamp,
        'X-Yoapp-Nonce': signature.nonce,
        'X-Yoapp-Sign': signature.sign
    };
    if (!omitRuntimeHeaders) {
        var rows = FANSHU_REQUEST_HEADERS || FANSHU_FALLBACK_REQUEST_HEADERS;
        for (var i = 0; i < rows.length; i++) {
            var name = String(rows[i] && rows[i].name || '');
            if (/^[A-Za-z0-9-]{1,80}$/.test(name) && !/^X-Yoapp-/i.test(name)) {
                h[name] = String(rows[i].value == null ? '' : rows[i].value);
            }
        }
    }
    if (secretRequest) h['X-API-TOKEN'] = FANSHU_TOKEN;
    return h;
}
function _http(method, url, body, headers) {
    var requestHeaders = {}, key;
    headers = headers || {};
    for (key in headers) if (Object.prototype.hasOwnProperty.call(headers, key)) requestHeaders[key] = headers[key];
    var cookie = _cookieHeader(url);
    if (cookie && !requestHeaders.Cookie && !requestHeaders.cookie) requestHeaders.Cookie = cookie;
    var opts = { headers: requestHeaders, timeout: FANSHU_HTTP_TIMEOUT };
    var optsJson = _json(opts);
    if (typeof http !== 'undefined' && http) {
        var nativeFn = method === 'POST' ? http.post2 : http.request2;
        if (typeof nativeFn === 'function') {
            var r = method === 'POST'
                ? nativeFn.call(http, url, body || '', optsJson)
                : nativeFn.call(http, url, optsJson);
            if (r && typeof r === 'object') {
                var result = {
                    status: Number(r.status || 0),
                    body: String(r.body == null ? '' : r.body),
                    ok: r.ok !== false,
                    headers: r.headers && typeof r.headers === 'object' ? r.headers : {}
                };
                _captureResponseCookies(url, result.headers);
                return result;
            }
        }
    }
    if (method === 'POST' && typeof post === 'function') {
        return { status: 200, body: String(post(url, body || '', optsJson) || ''), ok: true };
    }
    if (typeof request === 'function') {
        return { status: 200, body: String(request(url, optsJson) || ''), ok: true };
    }
    throw new Error('当前环境没有 request/http 内置函数');
}
function _apiError(message, status, auth) {
    var e = new Error(String(message || '番薯接口请求失败'));
    e.status = status || 0;
    e.auth = !!auth;
    return e;
}
function _authText(s) {
    return /signature|sign|device.secret|device_secret|nonce|token|guard|密钥|签名|设备/i.test(String(s || ''));
}
function _guardError(error) {
    return /guard|REQUEST_HEADER_(?:MISSING|INVALID)|request header/i.test(String(error && (error.message || error) || ''));
}
function _deviceRejected(error) {
    return /device(?:_id| id)?\s+is\s+(?:blacklisted|invalid)|request sign device_id is invalid/i.test(String(error && (error.message || error) || ''));
}
function _captchaRequired(error) {
    return /captcha(?:\s+is)?\s+required|captcha_required/i.test(String(error && (error.message || error) || ''));
}
function _decodeEnvelope(raw, status) {
    var outer = _parse(raw);
    if (!outer || typeof outer !== 'object') throw _apiError('番薯接口返回非法 JSON', status, false);
    if (outer.success === false) {
        var msg = outer.message || outer.msg || outer.error || outer.error_code || '接口返回失败';
        throw _apiError(msg, status, status === 401 || status === 403 || _authText(msg));
    }
    if (typeof outer.data === 'string' && outer.ek) {
        try {
            var kekHex = _sha256(FANSHU_SALT).substring(0, 32);
            var material = crypto.aes.decrypt(outer.ek, kekHex, {
                mode: 'ECB', padding: 'PKCS5', keyFormat: 'hex', input: 'base64', output: 'utf8'
            });
            if (!material) throw new Error('ek 解密结果为空');
            var keyHex = _sha256(material + FANSHU_SALT);
            var ivHex = _sha256(FANSHU_SALT + material).substring(0, 32);
            var plain = crypto.aes.decrypt(outer.data, keyHex, {
                mode: 'CBC', padding: 'PKCS5', keyFormat: 'hex', ivFormat: 'hex', iv: ivHex,
                input: 'base64', output: 'utf8'
            });
            if (!plain) throw new Error('data 解密结果为空');
            var decoded = _parse(plain);
            return decoded == null ? plain : decoded;
        } catch (e) {
            throw _apiError('番薯响应解密失败: ' + e, status, false);
        }
    }
    if (outer.data && typeof outer.data === 'object' && !outer.sections && !outer.play_sources) return outer.data;
    return outer;
}
function _storageKey() {
    return 'fanshu_secret_' + _sha256(FANSHU_DEVICE_ID).substring(0, 16);
}
function _readStoredSecret() {
    try {
        if (typeof getItem !== 'function') return null;
        var x = _parse(getItem(_storageKey(), ''));
        if (x && x.deviceId === FANSHU_DEVICE_ID && x.base && x.bound && Number(x.expiresAt) > _nowSec() + 30) return x;
    } catch (e) {}
    return null;
}
function _writeStoredSecret(x) {
    try {
        if (typeof setItem === 'function') setItem(_storageKey(), _json(x));
    } catch (e) {}
}
function _clearStoredSecret() {
    FANSHU_SECRET = null;
    try { if (typeof removeItem === 'function') removeItem(_storageKey()); } catch (e) {}
}
function _rotateDeviceId() {
    var oldKey = _storageKey();
    var oldId = FANSHU_DEVICE_ID;
    var next = _newDeviceId();
    for (var i = 0; i < 3 && next === oldId; i++) next = _newDeviceId();
    FANSHU_DEVICE_ID = next;
    FANSHU_SECRET = null;
    FANSHU_REQUEST_HEADERS = null;
    FANSHU_REQUEST_HEADERS_SAVED_AT = 0;
    FANSHU_COOKIES = {};
    FANSHU_CHALLENGE_HOST = '';
    try {
        if (typeof removeItem === 'function') {
            removeItem(oldKey);
            removeItem(FANSHU_REQUEST_HEADERS_CACHE_KEY);
        }
        if (typeof setItem === 'function') setItem(FANSHU_DEVICE_ID_KEY, next);
        if (typeof log === 'function') log('[fanshu] rotated rejected device id');
    } catch (e) {}
    return next;
}
function _normalizeRequestHeaders(configData) {
    var validation = configData && configData.request_validation;
    if (!validation || typeof validation !== 'object') return null;
    if (validation.enabled === 0 || validation.enabled === false) return [];
    if (!Array.isArray(validation.headers)) return null;
    var out = [], seen = {};
    for (var i = 0; i < validation.headers.length; i++) {
        var row = validation.headers[i] || {};
        var name = _trim(row.name), value = row.value == null ? '' : String(row.value);
        if (!/^[A-Za-z0-9-]{1,80}$/.test(name) || /^X-Yoapp-/i.test(name) || seen[name.toLowerCase()]) continue;
        seen[name.toLowerCase()] = 1;
        out.push({ name: name, value: value });
    }
    return out.length ? out : null;
}
function _readStoredRequestHeaders() {
    try {
        if (typeof getItem !== 'function') return null;
        var saved = _parse(getItem(FANSHU_REQUEST_HEADERS_CACHE_KEY, ''));
        if (saved && Array.isArray(saved.headers)) {
            return { headers: saved.headers, savedAt: Number(saved.savedAt || 0) };
        }
    } catch (e) {}
    return null;
}
function _writeStoredRequestHeaders(headers, savedAt) {
    try {
        if (typeof setItem === 'function') {
            setItem(FANSHU_REQUEST_HEADERS_CACHE_KEY, _json({ headers: headers, savedAt: savedAt }));
        }
    } catch (e) {}
}
function _callAppConfig(host) {
    var ts = String(_nowMs());
    var query = { action: 'app_config', token: FANSHU_TOKEN, _: ts };
    var bootstrapKey = _sha256(FANSHU_TOKEN + FANSHU_DEVICE_ID + FANSHU_SALT);
    var signature = _signature('GET', 'app_config', query, '', bootstrapKey, ts);
    var headers = _headers(signature, false, true);
    headers['User-Agent'] = 'Dart/3.11 (dart:io)';
    var res = _http('GET', host + '?' + _queryString(query), '', headers);
    if (res.status && (res.status < 200 || res.status >= 300)) {
        throw _apiError('app_config HTTP ' + res.status + ': ' + res.body, res.status, res.status === 401 || res.status === 403);
    }
    return _decodeEnvelope(res.body, res.status);
}
function _refreshRequestHeaders() {
    var last = null, rotated = false;
    for (var pass = 0; pass < 2; pass++) {
        var hosts = _hostOrder(), rejected = false;
        for (var i = 0; i < hosts.length; i++) {
            var host = hosts[i];
            try {
                var configData = _callAppConfig(host);
                var headers = _normalizeRequestHeaders(configData);
                if (headers == null) throw _apiError('app_config 缺少 request_validation.headers', 0, false);
                var now = _nowMs();
                FANSHU_REQUEST_HEADERS = headers;
                FANSHU_REQUEST_HEADERS_SAVED_AT = now;
                _writeStoredRequestHeaders(headers, now);
                _hostSucceeded(host);
                return headers;
            } catch (e) {
                last = e;
                if (_deviceRejected(e)) { rejected = true; break; }
                _hostFailed(host, e);
            }
        }
        if (rejected && !rotated) {
            _rotateDeviceId();
            rotated = true;
            continue;
        }
        break;
    }
    throw last || _apiError('app_config 请求失败', 0, false);
}
function _loadRequestHeaders(force) {
    var now = _nowMs();
    if (!force && FANSHU_REQUEST_HEADERS && now - FANSHU_REQUEST_HEADERS_SAVED_AT < FANSHU_REQUEST_HEADERS_FRESH_MS) {
        return FANSHU_REQUEST_HEADERS;
    }
    var stored = _readStoredRequestHeaders();
    if (!force && stored && now - stored.savedAt < FANSHU_REQUEST_HEADERS_FRESH_MS) {
        FANSHU_REQUEST_HEADERS = stored.headers;
        FANSHU_REQUEST_HEADERS_SAVED_AT = stored.savedAt;
        return FANSHU_REQUEST_HEADERS;
    }
    try { return _refreshRequestHeaders(); }
    catch (e) {
        var fallback = stored && Array.isArray(stored.headers) ? stored.headers : FANSHU_FALLBACK_REQUEST_HEADERS;
        FANSHU_REQUEST_HEADERS = fallback;
        FANSHU_REQUEST_HEADERS_SAVED_AT = now;
        try { if (typeof log === 'function') log('[fanshu] app_config: ' + e); } catch (e2) {}
        return FANSHU_REQUEST_HEADERS;
    }
}
function _publicIp() {
    var endpoints = [
        'https://api64.ipify.org?format=json',
        'https://api.ipify.org?format=json',
        'https://ifconfig.me/ip'
    ];
    for (var i = 0; i < endpoints.length; i++) {
        try {
            var raw = _http('GET', endpoints[i], '', { 'User-Agent': 'Dart', 'Accept': 'application/json', 'Content-Type': 'application/json' }).body;
            var j = _parse(raw);
            var ip = j && j.ip ? j.ip : _trim(raw);
            if (ip && /^[0-9a-f:.]+$/i.test(ip)) return ip;
        } catch (e) {}
    }
    return '';
}
function _requestDeviceSecret(body) {
    var q = { action: 'device_secret', token: FANSHU_TOKEN };
    var last = null;
    var hosts = _hostOrder();
    for (var i = 0; i < hosts.length; i++) {
        var host = hosts[i];
        if (host.indexOf('supabase.co/functions/v1/proxy/') >= 0) continue;
        try {
            var sig = _signature('POST', 'device_secret', q, body, _sha256(FANSHU_TOKEN + FANSHU_DEVICE_ID + FANSHU_SALT));
            var res = _http('POST', host + '?' + _queryString(q), body, _headers(sig, true));
            if (res.status && (res.status < 200 || res.status >= 300)) throw _apiError('device_secret HTTP ' + res.status + ': ' + res.body, res.status, res.status === 401 || res.status === 403);
            var d = _decodeEnvelope(res.body, res.status);
            if (!d || !d.device_secret) throw _apiError('device_secret 缺少 device_secret', res.status, true);
            var expires = Number(d.expires_at || (_nowSec() + Number(d.ttl || 86400)));
            var base = String(d.device_secret);
            var bound = _hmacHex(base, FANSHU_APP_SIGNATURE);
            FANSHU_SECRET = { deviceId: FANSHU_DEVICE_ID, base: base, bound: bound, expiresAt: expires };
            _writeStoredSecret(FANSHU_SECRET);
            _hostSucceeded(host);
            return FANSHU_SECRET;
        } catch (e) { last = e; _hostFailed(host, e); }
    }
    throw last || _apiError('device_secret 请求失败', 0, true);
}
function _refreshSecret() {
    _loadRequestHeaders(false);
    var ip = _publicIp();
    var body = _json({ device_id: FANSHU_DEVICE_ID, ip: base64Encode(ip) });
    try { return _requestDeviceSecret(body); }
    catch (e) {
        if (_deviceRejected(e)) {
            _rotateDeviceId();
            _loadRequestHeaders(true);
            body = _json({ device_id: FANSHU_DEVICE_ID, ip: base64Encode(ip) });
            return _requestDeviceSecret(body);
        }
        if (!_guardError(e)) throw e;
        _loadRequestHeaders(true);
        body = _json({ device_id: FANSHU_DEVICE_ID, ip: base64Encode(ip) });
        return _requestDeviceSecret(body);
    }
}
function _loadSecret(force) {
    if (!force && FANSHU_SECRET && FANSHU_SECRET.expiresAt > _nowSec() + 30) return FANSHU_SECRET;
    if (!force) {
        var stored = _readStoredSecret();
        if (stored) { FANSHU_SECRET = stored; return stored; }
    }
    return _refreshSecret();
}
function _callRawHost(host, action, params, key, method, body, extraHeaders) {
    var query = { action: action, token: FANSHU_TOKEN }, k;
    params = params || {};
    for (k in params) if (Object.prototype.hasOwnProperty.call(params, k)) query[k] = params[k];
    var payload = body || '';
    var sig = _signature(method || 'GET', action, query, payload, key);
    var headers = _headers(sig, false);
    extraHeaders = extraHeaders || {};
    for (k in extraHeaders) if (Object.prototype.hasOwnProperty.call(extraHeaders, k)) headers[k] = extraHeaders[k];
    var res = _http(method || 'GET', host + '?' + _queryString(query), payload, headers);
    if (res.status && (res.status < 200 || res.status >= 300)) {
        throw _apiError('HTTP ' + res.status + ': ' + res.body, res.status, res.status === 401 || res.status === 403 || _authText(res.body));
    }
    return res;
}
function _callHost(host, action, params, key, method, body) {
    var res = _callRawHost(host, action, params, key, method, body, null);
    return _decodeEnvelope(res.body, res.status);
}
function _api(action, params) {
    var last = null, forceSecret = false, forceGuard = false, attempt;
    for (attempt = 0; attempt < 3; attempt++) {
        _loadRequestHeaders(forceGuard);
        var secret;
        try { secret = _loadSecret(forceSecret); }
        catch (e) { last = e; break; }
        forceSecret = false;
        forceGuard = false;
        var guardRejected = false, secretRejected = false, deviceRejected = false;
        var hosts = _hostOrder();
        for (var i = 0; i < hosts.length; i++) {
            try {
                var value = _callHost(hosts[i], action, params, secret.bound, 'GET', '');
                _hostSucceeded(hosts[i]);
                return value;
            } catch (e2) {
                last = e2;
                if (_captchaRequired(e2)) {
                    FANSHU_CHALLENGE_HOST = hosts[i];
                    throw e2;
                } else if (_deviceRejected(e2)) deviceRejected = true;
                else if (_guardError(e2)) guardRejected = true;
                else if (e2 && e2.auth) secretRejected = true;
                else _hostFailed(hosts[i], e2);
            }
        }
        if (deviceRejected) {
            _rotateDeviceId();
            forceGuard = true;
            forceSecret = true;
            continue;
        }
        if (guardRejected) {
            forceGuard = true;
            continue;
        }
        if (secretRejected) {
            _clearStoredSecret();
            forceSecret = true;
            continue;
        }
        break;
    }
    throw last || _apiError('番薯接口请求失败', 0, false);
}
function _safeCall(action, params) {
    try { return _api(action, params); }
    catch (e) {
        try { if (typeof log === 'function') log('[fanshu] ' + action + ': ' + e); } catch (e2) {}
        return null;
    }
}
function _clean(s) {
    if (s == null) return '';
    return _trim(String(s).replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/&quot;/gi, '"')
        .replace(/&#0?39;/g, "'").replace(/&#x27;/gi, "'")
        .replace(/&lt;/gi, '<').replace(/&gt;/gi, '>')
        .replace(/&#(\d+);/g, function (m, n) { return String.fromCharCode(parseInt(n, 10)); }));
}
function _pic(v) {
    return _trim(v && (v.vod_pic_slide || v.vod_pic_thumb || v.vod_pic || v.pic || v.cover || v.image || ''));
}
function _typeName(typeId, fallback) {
    var id = String(typeId == null ? '' : typeId);
    if (id === '1') return 'TV番剧';
    if (id === '22') return '国产动漫';
    if (id === '3') return '剧场版';
    if (id === '20') return '4K分区';
    if (id === '21') return '欧美动漫';
    return _clean(fallback || '动漫');
}
function _card(v, fallbackType) {
    if (!v || typeof v !== 'object') return null;
    var id = v.vod_id == null ? (v.id == null ? '' : v.id) : v.vod_id;
    var name = v.vod_name || v.title || v.name || '';
    if (id == null || !String(id) || !name) return null;
    return {
        id: String(id),
        name: _clean(name),
        pic: _pic(v),
        type: _typeName(v.type_id, v.type_name || v.vod_type_name || v.type || fallbackType),
        year: v.vod_year == null ? (v.year == null ? '' : String(v.year)) : String(v.vod_year),
        remarks: _clean(v.vod_remarks || v.remarks || ''),
        desc: _clean(v.vod_blurb || v.vod_content || v.description || v.desc || '')
    };
}
function _mapList(rows, fallbackType) {
    var out = [], seen = {};
    rows = rows || [];
    for (var i = 0; i < rows.length; i++) {
        var c = _card(rows[i], fallbackType);
        if (!c || seen[c.id]) continue;
        seen[c.id] = 1;
        out.push(c);
    }
    return out;
}
function _extractRows(data) {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data !== 'object') return [];
    var direct = ['list', 'items', 'results', 'videos', 'rows'];
    for (var i = 0; i < direct.length; i++) if (Array.isArray(data[direct[i]])) return data[direct[i]];
    var keys = [], k;
    for (k in data) if (Object.prototype.hasOwnProperty.call(data, k) && /^\d+$/.test(k)) keys.push(k);
    keys.sort(function (a, b) { return Number(a) - Number(b); });
    var out = [];
    for (var j = 0; j < keys.length; j++) if (data[keys[j]] && typeof data[keys[j]] === 'object' && data[keys[j]].vod_id != null) out.push(data[keys[j]]);
    if (out.length) return out;
    for (k in data) if (Object.prototype.hasOwnProperty.call(data, k) && data[k] && typeof data[k] === 'object' && data[k].vod_id != null) out.push(data[k]);
    return out;
}
function _readHomeCache() {
    try {
        if (typeof getItem !== 'function') return null;
        var raw = _parse(getItem(FANSHU_HOME_CACHE_KEY, ''));
        if (raw && raw.data && Array.isArray(raw.data.sections) && raw.data.sections.length) {
            return { data: raw.data, savedAt: Number(raw.savedAt || 0) };
        }
        var legacy = _parse(getItem('fanshu_home_sections_v1', ''));
        if (legacy && Array.isArray(legacy.sections) && legacy.sections.length) {
            return { data: legacy, savedAt: 0 };
        }
    } catch (e) {}
    return null;
}
function _writeHomeCache(data, savedAt) {
    try {
        if (typeof setItem === 'function') {
            setItem(FANSHU_HOME_CACHE_KEY, _json({ savedAt: savedAt, data: data }));
        }
    } catch (e) {}
}
function _homeData() {
    var now = _nowMs();
    if (FANSHU_HOME && Array.isArray(FANSHU_HOME.sections) && FANSHU_HOME.sections.length) {
        if (now - FANSHU_HOME_SAVED_AT < FANSHU_HOME_CACHE_FRESH_MS ||
            now - FANSHU_HOME_FAILED_AT < FANSHU_DEAD_HOST_RETRY_MS) return FANSHU_HOME;
    }
    if (FANSHU_HOME && FANSHU_HOME._failedAt && now - FANSHU_HOME._failedAt < FANSHU_DEAD_HOST_RETRY_MS) return FANSHU_HOME;

    var cached = _readHomeCache();
    if (!FANSHU_HOME && cached && cached.savedAt > 0 && now - cached.savedAt < FANSHU_HOME_CACHE_FRESH_MS) {
        FANSHU_HOME = cached.data;
        FANSHU_HOME_SAVED_AT = cached.savedAt;
        return FANSHU_HOME;
    }

    var d = _safeCall('home_sections', { limit: 12 });
    if (d && Array.isArray(d.sections) && d.sections.length) {
        FANSHU_HOME = d;
        FANSHU_HOME_SAVED_AT = now;
        FANSHU_HOME_FAILED_AT = 0;
        _writeHomeCache(d, now);
        return FANSHU_HOME;
    }

    FANSHU_HOME_FAILED_AT = now;
    if (cached && cached.data && Array.isArray(cached.data.sections) && cached.data.sections.length) {
        FANSHU_HOME = cached.data;
        FANSHU_HOME_SAVED_AT = Number(cached.savedAt || 0);
        return FANSHU_HOME;
    }
    FANSHU_HOME = { sections: [], _failedAt: now };
    return FANSHU_HOME;
}
function _sectionClassItems(section) {
    var values = section && section.extend_class_items;
    if (!Array.isArray(values)) values = _trim(section && section.extend_class || '').split(/[,，]/);
    var out = [], seen = {};
    for (var i = 0; i < values.length; i++) {
        var x = _trim(values[i]);
        if (x && !seen[x]) { seen[x] = 1; out.push(x); }
    }
    return out;
}
function _sectionYearItems(section) {
    var values = section && section.extend_year_items;
    if (!Array.isArray(values)) values = _trim(section && section.extend_year || '').split(/[,，]/);
    var out = [], seen = {};
    for (var i = 0; i < values.length; i++) {
        var x = _trim(values[i]);
        if (/^\d{4}$/.test(x) && !seen[x]) { seen[x] = 1; out.push(x); }
    }
    return out;
}
function _filtersForSection(section) {
    var classes = _sectionClassItems(section), years = _sectionYearItems(section);
    var classValues = [{ n: '全部', v: '' }], yearValues = [{ n: '全部', v: '' }];
    for (var i = 0; i < classes.length && i < 80; i++) classValues.push({ n: classes[i], v: classes[i] });
    for (var j = 0; j < years.length && j < 40; j++) yearValues.push({ n: years[j], v: years[j] });
    var rows = [];
    if (classes.length) rows.push({ key: 'class', name: '题材', value: classValues });
    if (years.length) rows.push({ key: 'year', name: '年份', value: yearValues });
    rows.push({ key: 'sort', name: '排序', init: 'latest', value: [{ n: '最新', v: 'latest' }, { n: '最热', v: 'hot' }] });
    return rows;
}
function config() {
    return JSON.stringify({ browseOnly: false });
}
function categories() {
    var data = _homeData(), sections = Array.isArray(data.sections) ? data.sections : [], seen = {};
    var defs = [{ key: '', title: '精选' }];
    for (var i = 0; i < sections.length; i++) {
        var section = sections[i], id = String(section.type_id || '');
        if (!id || seen[id]) continue;
        seen[id] = true;
        defs.push({ key: id, title: _clean(section.type_name || _typeName(id, '动漫')), filters: _filtersForSection(section) });
    }
    return JSON.stringify(defs);
}
function _listAction(action, params) {
    var d = _safeCall(action, params);
    return _mapList(_extractRows(d), d && d.type_name);
}
function _searchData(keyword, page) {
    var params = { keyword: keyword, page: page, page_size: 12 };
    try { return _api('search_videos', params); }
    catch (e) {
        if (!_captchaRequired(e)) throw e;
        throw new Error('源站搜索需要手动验证码，当前线路仅支持分类浏览');
    }
}
function search(keyword, page) {
    keyword = _trim(keyword);
    page = Number(page || 1);
    if (page < 1) page = 1;
    var list;
    if (keyword) {
        try {
            var searchData = _searchData(keyword, page);
            list = _mapList(_extractRows(searchData), searchData && searchData.type_name);
        } catch (e) {
            try { if (typeof log === 'function') log('[fanshu] search_videos: ' + e); } catch (e2) {}
            list = [];
        }
    } else {
        if (page > 1) return '[]';
        var sections = _homeData().sections || [], rows = [];
        for (var i = 0; i < sections.length; i++) {
            var sectionCards = _mapList(sections[i].data || [], sections[i].type_name);
            for (var j = 0; j < sectionCards.length; j++) rows.push(sectionCards[j]);
        }
        list = _mapList(rows);
        if (!list.length) list = _listAction('category_videos', { type_id: 1, page: 1, page_size: 12, class: '', year: '', sort: 'latest' });
    }
    return JSON.stringify(list);
}
function searchFiltered(category, filtersJson, page) {
    page = Number(page || 1);
    if (page < 1) page = 1;
    var f = _parse(filtersJson) || {};
    var typeId = _trim(category) || '1';
    var sort = String(f.sort || 'latest').toLowerCase() === 'hot' ? 'hot' : 'latest';
    var list = _listAction('category_videos', {
        type_id: typeId,
        page: page,
        page_size: 12,
        class: f.class == null ? '' : String(f.class),
        year: f.year == null ? '' : String(f.year),
        sort: sort
    });
    return JSON.stringify(list);
}
function homeSections() {
    var d = _homeData(), sections = d.sections || [], out = [];
    for (var i = 0; i < sections.length; i++) {
        var s = sections[i] || {}, items = _mapList(s.data || [], s.type_name);
        if (!items.length) continue;
        out.push({ title: _clean(s.type_name || _typeName(s.type_id, '动漫')), key: String(s.type_id || ''), items: items });
    }
    var hero = _safeCall('anime_carousel', { limit: 10 });
    var heroItems = _mapList(_extractRows(hero), '精选');
    if (heroItems.length) out.push({ title: '精选推荐', key: '__hero__', items: heroItems });
    return JSON.stringify(out);
}
function _getDetail(id) {
    id = String(id == null ? '' : id);
    if (!id) return null;
    if (FANSHU_DETAIL_CACHE[id]) return FANSHU_DETAIL_CACHE[id];
    var d = _safeCall('video_detail', { vod_id: id });
    if (d && d.data && typeof d.data === 'object' && !d.play_sources) d = d.data;
    if (d) FANSHU_DETAIL_CACHE[id] = d;
    return d;
}
function detail(id) {
    var d = _getDetail(id) || {};
    var vodId = d.vod_id == null ? String(id == null ? '' : id) : d.vod_id;
    var sources = Array.isArray(d.play_sources) ? d.play_sources : [];
    var episodes = [], seen = {};
    for (var i = 0; i < sources.length; i++) {
        var source = sources[i] || {}, route = _clean(source.display_name || source.player_name || source.name || source.from || '在线播放');
        var eps = Array.isArray(source.episodes) ? source.episodes : [];
        for (var j = 0; j < eps.length; j++) {
            var ep = eps[j] || {}, eid = ep.episode_id == null ? (ep.id == null ? '' : ep.id) : ep.episode_id;
            if (eid === '') continue;
            var flag = _json({ v: String(vodId), s: String(source.from || source.source || ''), e: eid, i: j });
            var key = route + '\n' + String(eid);
            if (seen[key]) continue;
            seen[key] = 1;
            episodes.push({ name: _clean(ep.name || ep.episode_name || ('第' + (j + 1) + '集')), url: flag, route: route });
        }
    }
    return JSON.stringify({
        id: String(vodId),
        name: _clean(d.vod_name || d.title || ''),
        pic: _pic(d),
        type: _typeName(d.type_id, d.type_name),
        year: d.vod_year == null ? '' : String(d.vod_year),
        remarks: _clean(d.vod_remarks || ''),
        desc: _clean(d.vod_content || d.vod_blurb || d.vod_desc || d.description || ''),
        related: __niviiRelatedFrom(d, d), episodes: episodes
    });
}
function _relatedFromObject(d, id) {
    var candidates = d && (d.related || d.recommendations || d.related_videos || d.similar || d.relate_list);
    if (candidates && !Array.isArray(candidates)) candidates = _extractRows(candidates);
    return _mapList(Array.isArray(candidates) ? candidates : [], d && d.type_name).filter(function (x) { return x.id !== String(id); });
}
function related(id) {
    var d = _getDetail(id) || {}, embedded = _relatedFromObject(d, id);
    if (embedded.length) return JSON.stringify(embedded.slice(0, 12));
    var typeId = d.type_id == null ? '1' : String(d.type_id);
    var list = _listAction('category_videos', { type_id: typeId, page: 1, page_size: 12, class: '', year: '', sort: 'hot' });
    return JSON.stringify(list.filter(function (x) { return x.id !== String(id); }).slice(0, 12));
}
function ranking(sort, page) {
    if (Number(page || 1) > 1) return '[]';
    var d = _safeCall('weekly_rankings', { limit: 50 });
    var rows = _extractRows(d), out = [];
    for (var i = 0; i < rows.length; i++) {
        var v = rows[i] || {}, card = _card(v, v.type_name);
        if (!card) continue;
        var tags = _clean(v.vod_class || v.tags || '').split(/[,，]/).filter(function (x) { return !!_trim(x); });
        var year = card.year || (v.date ? String(v.date).substring(0, 4) : '');
        var score = v.score == null ? (v.vod_score == null ? '' : v.vod_score) : v.score;
        var popularity = v.popularity == null ? (v.vod_hits_week == null ? (v.vod_hits == null ? '' : v.vod_hits) : v.vod_hits_week) : v.popularity;
        out.push({ id: card.id, name: card.name, nameJp: _clean(v.nameJp || v.vod_name_en || v.vod_en || v.original || ''), cover: card.pic, year: year, rank: v.rank == null ? i + 1 : Number(v.rank), score: score, popularity: popularity, tags: tags, summary: card.desc });
    }
    return JSON.stringify(out);
}
function _weekdayNumber(x) {
    if (typeof x === 'number' && x >= 1 && x <= 7) return x;
    var s = String(x == null ? '' : x);
    var m = /([1-7])/.exec(s);
    if (m) return Number(m[1]);
    var names = [
        ['周一', '星期一'], ['周二', '星期二'], ['周三', '星期三'], ['周四', '星期四'],
        ['周五', '星期五'], ['周六', '星期六'], ['周日', '星期日', '星期天']
    ];
    for (var i = 0; i < names.length; i++) {
        for (var j = 0; j < names[i].length; j++) if (s.indexOf(names[i][j]) >= 0) return i + 1;
    }
    return 1;
}
function _scheduleItem(v) {
    v = v || {};
    var remarks = _clean(v.vod_remarks || v.remarks || ''), air = v.airTime || v.air_time || v.time || '';
    if (!air && remarks) {
        var tm = /([0-2]?\d)点([0-5]?\d)分?/.exec(remarks);
        if (tm) air = ('0' + tm[1]).slice(-2) + ':' + ('0' + tm[2]).slice(-2);
    }
    var ep = v.episode == null ? v.episode_number : v.episode;
    if (ep == null && remarks) {
        var em = /第\s*(\d+)\s*集/.exec(remarks);
        if (em) ep = Number(em[1]);
    }
    var id = v.vod_id == null ? (v.id == null ? '' : v.id) : v.vod_id;
    var item = { id: String(id), name: _clean(v.vod_name || v.name || v.title || ''), cover: _pic(v), airTime: String(air || ''), episode: ep == null ? '' : Number(ep) || String(ep) };
    if (v.score != null || v.vod_score != null) item.score = v.score == null ? v.vod_score : v.score;
    if (remarks) item.remarks = remarks;
    return item;
}
function calendar() {
    var d = _safeCall('update_schedule', {}), sections = d && Array.isArray(d.sections) ? d.sections : [], days = [];
    for (var i = 0; i < sections.length; i++) {
        var s = sections[i] || {}, list = Array.isArray(s.data) ? s.data : (Array.isArray(s.list) ? s.list : []);
        days.push({ weekday: _weekdayNumber(s.weekday), list: list.map(_scheduleItem).filter(function (x) { return x.id && x.name; }) });
    }
    days.sort(function (a, b) { return a.weekday - b.weekday; });
    return JSON.stringify({ days: days });
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        config: config,
        categories: categories,
        homeSections: homeSections,
        search: search,
        searchFiltered: searchFiltered,
        detail: detail,
        related: related,
        play: play,
        ranking: ranking,
        calendar: calendar,
        _internal: {
            signature: _signature,
            hostList: _hostList,
            hostOrder: _hostOrder,
            decodeEnvelope: _decodeEnvelope,
            callHost: _callHost,
            api: _api
        }
    };
}
function __auv_json(v, fb) {
    if (v == null || v === '') return fb;
    if (typeof v === 'string') { try { return JSON.parse(v); } catch (e) { return fb; } }
    return v;
}
function __auv_str(v) { return v == null ? '' : String(v); }
function __auv_vod(it) {
    it = it || {};
    return {
        vod_id: __auv_str(it.vod_id || it.id || it.url),
        vod_name: __auv_str(it.vod_name || it.name || it.title),
        vod_pic: __auv_str(it.vod_pic || it.pic || it.img || it.cover),
        vod_remarks: __auv_str(it.vod_remarks || it.remarks || it.remark || it.note || it.year),
        type_name: __auv_str(it.type_name || it.type || it.category),
        vod_year: __auv_str(it.vod_year || it.year || '')
    };
}
function __auv_list(data) {
    data = __auv_json(data, []);
    if (data && data.list) data = data.list;
    if (data && data.items) data = data.items;
    if (!Array.isArray(data)) data = [];
    var out = [];
    for (var i = 0; i < data.length; i++) out.push(__auv_vod(data[i]));
    return out;
}
function __auv_filter_value(v) {
    v = v || {};
    return { n: __auv_str(v.n || v.name || v.title || v), v: __auv_str(v.v == null ? (v.value == null ? (v.id == null ? v : v.id) : v.value) : v.v) };
}
function __auv_filter(f) {
    f = f || {};
    var vals = f.value || f.values || [];
    var out = [];
    for (var i = 0; i < vals.length; i++) out.push(__auv_filter_value(vals[i]));
    var row = { key: __auv_str(f.key), name: __auv_str(f.name || f.title), value: out };
    if (f.init != null) row.init = __auv_str(f.init);
    return row;
}
function __auv_classes() {
    var cats = typeof categories === 'function' ? __auv_json(categories(), []) : [];
    if (!Array.isArray(cats) || !cats.length) cats = [{ key: 'home', title: '推荐', filters: [] }];
    var classes = [], filters = {};
    for (var i = 0; i < cats.length; i++) {
        var c = cats[i] || {};
        var id = __auv_str(c.key == null ? c.id : c.key);
        if (id === '') id = 'home';
        classes.push({ type_id: id, type_name: __auv_str(c.title || c.name || id) });
        var fs = c.filters || [];
        var fArr = [];
        for (var j = 0; j < fs.length; j++) fArr.push(__auv_filter(fs[j]));
        if (fArr.length) filters[id] = fArr;
    }
    return { classes: classes, filters: filters };
}
function __auv_home_list() {
    var list = [];
    // 优先保留源自身的首页分区，并把分区标题写入卡片供 Android 端动态分组。
    if (typeof homeSections === 'function') {
        try {
            var sections = __auv_json(homeSections(), []);
            if (Array.isArray(sections)) {
                for (var i = 0; i < sections.length; i++) {
                    var s = sections[i] || {};
                    var title = __auv_str(s.title || s.name || '');
                    var items = s.items || s.list || [];
                    for (var j = 0; j < items.length; j++) {
                        var vod = __auv_vod(items[j]);
                        if (title) vod.type_name = title;
                        list.push(vod);
                    }
                }
            }
        } catch (e) {}
    }
    try {
        if (!list.length && typeof searchFiltered === 'function') list = __auv_list(searchFiltered('', '{}', 1));
    } catch (e2) {}
    try {
        if (!list.length && typeof search === 'function') list = __auv_list(search('', 1));
    } catch (e3) {}
    return list;
}
function __auv_home(filter) {
    var c = __auv_classes();
    return JSON.stringify({ class: c.classes, filters: c.filters });
}
function __auv_home_vod() {
    return JSON.stringify({ list: __auv_home_list() });
}
function __auv_category(tid, pg, filter, extend) {
    tid = tid === 'home' ? '' : tid;
    var data = typeof searchFiltered === 'function' ? searchFiltered(tid, JSON.stringify(extend || {}), pg || 1) : (typeof search === 'function' ? search(tid, pg || 1) : '[]');
    return JSON.stringify({ list: __auv_list(data), page: parseInt(pg || 1), pagecount: 99 });
}
function __auv_search(wd, quick, pg) {
    return JSON.stringify({ list: typeof search === 'function' ? __auv_list(search(wd, pg || 1)) : [] });
}
function __auv_detail(id) {
    var d = typeof detail === 'function' ? __auv_json(detail(id), {}) : {};
    var routes = {}, order = [], eps = d.episodes || [];
    for (var i = 0; i < eps.length; i++) {
        var e = eps[i] || {};
        var r = __auv_str(e.route || e.from || e.flag || '播放');
        if (!routes[r]) { routes[r] = []; order.push(r); }
        routes[r].push(__auv_str(e.name || ('第' + (routes[r].length + 1) + '集')) + '$' + __auv_str(e.url || e.id || e.flag));
    }
    var playUrls = [];
    for (var j = 0; j < order.length; j++) playUrls.push(routes[order[j]].join('#'));
    return JSON.stringify({ list: [{
        related: __auv_list(d.related || d.recommendations || d.related_videos || d.guesslike || d.similar || d.relate_list || []), vod_id: __auv_str(d.vod_id || d.id || id),
        vod_name: __auv_str(d.vod_name || d.name || d.title),
        vod_pic: __auv_str(d.vod_pic || d.pic || d.img || d.cover),
        type_name: __auv_str(d.type_name || d.type || ''),
        vod_year: __auv_str(d.vod_year || d.year || ''),
        vod_remarks: __auv_str(d.vod_remarks || d.remarks || ''),
        vod_content: __auv_str(d.vod_content || d.desc || d.content || ''),
        vod_play_from: order.join('$$$'),
        vod_play_url: playUrls.join('$$$')
    }] });
}
function __auv_related(id) { return JSON.stringify({list: __auv_list(_relatedFromObject(_getDetail(id) || {}, id).slice(0, 12))}); }
function __niviiRelatedFrom(root, detail) {
        function pick(x) { return x && (x.related || x.recommendations || x.related_videos || x.guesslike || x.similar || x.relate_list); }
        return pick(detail) || pick(root && root.data) || pick(root) || [];
    }
globalThis.__niviiSource = {related: __auv_related,
init: function(ext) { globalThis.ext = ext || {}; },
home: __auv_home,
homeVod: __auv_home_vod,
category: __auv_category,
detail: __auv_detail,
search: __auv_search};
})();
