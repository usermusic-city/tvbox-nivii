import 'assets://js/lib/crypto-js.js';
/* ===== Nivii -> TVBox 适配层（build 时自动注入，勿手改）===== */
if (!globalThis.CryptoJS) {
    console.log('[nivii] FATAL: CryptoJS 未加载，签名类源会全部失败');
}
if (typeof globalThis.getItem !== 'function') {
    globalThis.getItem = function (k, d) {
        try {
            var v = local.get('nivii_' + k);
            return (v === undefined || v === null || v === '') ? d : v;
        } catch (e) { return d; }
    };
}
if (typeof globalThis.setItem !== 'function') {
    globalThis.setItem = function (k, v) {
        try { local.set('nivii_' + k, String(v)); return true; } catch (e) { return false; }
    };
}
/* ===== 适配层结束 ===== */

globalThis.__niviiDetailRelatedVersion=1;
(function(){
var __auv_crypto = globalThis.CryptoJS || {};
var __auv_http_req = (typeof auvHttp === 'function' ? auvHttp : (globalThis.req || globalThis._http));
function encodeUri(value) { return encodeURIComponent(value == null ? '' : String(value)); }
function base64Encode(value) { try { return __auv_crypto.enc.Base64.stringify(__auv_crypto.enc.Utf8.parse(value == null ? '' : String(value))); } catch (e) { return ''; } }
function base64Decode(value) { try { return __auv_crypto.enc.Base64.parse(value == null ? '' : String(value)).toString(__auv_crypto.enc.Utf8); } catch (e) { return ''; } }
function md5(value) { value = value == null ? '' : String(value); try { if (typeof md5X === 'function') return md5X(value); } catch (e) {} try { return __auv_crypto.MD5(value).toString(); } catch (e2) { return ''; } }
function parseJson(value, fallback) { if (value == null || value === '') return fallback == null ? null : fallback; if (typeof value !== 'string') return value; try { return JSON.parse(value); } catch (e) { return fallback == null ? null : fallback; } }
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
function cfg(k, d) {
    try { if (typeof ext !== 'undefined' && ext && ext[k] != null && String(ext[k]) !== '') return String(ext[k]); } catch (e) {}
    return d;
}
var HOSTS = (function () {
    function norm(h) { return trim(h).replace(/\/+$/, ''); }
    var def = [
        'https://apinew.uozvr.com',
        'https://api.w32z7vtd.com',
        'https://api.6a7nnf7.com',
        'https://api.umygrx3.com',
        'https://api.rmedphk.com'
    ];
    var raw = cfg('hosts', '');
    if (raw) {
        var arr = raw.split(',').map(norm).filter(function (x) { return !!x; });
        if (arr.length) return arr;
    }
    var single = cfg('host', '');
    if (single) {
        var first = norm(single), out = [first];
        for (var i = 0; i < def.length; i++) if (def[i] !== first) out.push(def[i]);
        return out;
    }
    return def;
})();
var ENC_KEY  = cfg('encKey', 'OITxa5OqAYjhswxx');
var ENC_IV   = cfg('encIv', 'rCMNwZASNBKZ8mXV');
var SALT     = cfg('salt', '*&zvdvdvddbfikkkumtmdwqppp?|4Y!s!2br');
var RSA_PUB  = cfg('rsaPub', 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDUM5+/y8sPsWkd1/RQS64X259EUwxFXFE5HlA65MqrxnPs0JqoSRojSDy5QhwvROlaD6TwRQHKMY2OAZ6SnQeUJsChTEFIR9qUkwrs3/MVUMxjsv6JS6Oe/juclyJGTgVmDhB55EafXsD0SQYVj/QXXsxR6ewR5E2kL52yAAD4yQIDAQAB');
var RSA_PRIV = cfg('rsaPriv', 'MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGAe6hKrWLi1zQmjTT1ozbE4QdFeJGNxubxld6GrFGximxfMsMB6BpJhpcTouAqywAFppiKetUBBbXwYsYU1wNr648XVmPmCMCy4rY8vdliFnbMUj086DU6Z+/oXBdWU3/b1G0DN3E9wULRSwcKZT3wj/cCI1vsCm3gj2R5SqkA9Y0CAwEAAQKBgAJH+4CxV0/zBVcLiBCHvSANm0l7HetybTh/j2p0Y1sTXro4ALwAaCTUeqdBjWiLSo9lNwDHFyq8zX90+gNxa7c5EqcWV9FmlVXr8VhfBzcZo1nXeNdXFT7tQ2yah/odtdcx+vRMSGJd1t/5k5bDd9wAvYdIDblMAg+wiKKZ5KcdAkEA1cCakEN4NexkF5tHPRrR6XOY/XHfkqXxEhMqmNbB9U34saTJnLWIHC8IXys6Qmzz30TtzCjuOqKRRy+FMM4TdwJBAJQZFPjsGC+RqcG5UvVMiMPhnwe/bXEehShK86yJK/g/UiKrO87h3aEu5gcJqBygTq3BBBoH2md3pr/W+hUMWBsCQQChfhTIrdDinKi6lRxrdBnn0Ohjg2cwuqK5zzU9p/N+S9x7Ck8wUI53DKm8jUJE8WAG7WLj/oCOWEh+ic6NIwTdAkEAj0X8nhx6AXsgCYRql1klbqtVmL8+95KZK7PnLWG/IfjQUy3pPGoSaZ7fdquG8bq8oyf5+dzjE/oTXcByS+6XRQJAP/5ciy1bL3NhUhsaOVy55MHXnPjdcTX0FaLi+ybXZIfIQ2P4rb19mVq1feMbCXhz+L1rG8oat5lYKfpe8k83ZA==');
var DEVICE_OLD_KEY = cfg('deviceOldKey', 'aLFBMWpxBrIDAD1Si/KVvm41');
var UA       = cfg('ua', 'Lavf/57.83.100');
var CODE     = cfg('code', 'GZ0369');
var PKG      = cfg('package', 'com.ae06aebdbb.y286327f5a.ofe849883320260517');
var VERSION  = cfg('version', '2604028');
var VER      = cfg('ver', '3.0.3.2');
var PHONE_MODEL = cfg('phoneModel', 'xiaomi-25031');
var TOKEN_OVERRIDE    = cfg('token', '');
var TOKEN_ID_OVERRIDE = cfg('tokenId', '');
var _hostIdx   = 0;
var _deviceId  = '';
var _deviceKey = '';
var _token     = '';
var _tokenId   = '';
var _lastRegFailAt = 0;
var REG_FAIL_COOLDOWN_MS = 60000;
function randHex(n) {
    var s = '', c = '0123456789ABCDEF';
    for (var i = 0; i < n; i++) s += c.charAt(Math.floor(Math.random() * 16));
    return s;
}
function regenDevice() {
    _deviceId  = String(864150060000000 + Math.floor(Math.random() * 10000));
    _deviceKey = randHex(40);
}
function ensureDevice() { if (!_deviceKey) regenDevice(); }
function nowSec() { return String(Math.floor(Date.now() / 1000)); }
function trim(s) { return s == null ? '' : String(s).replace(/^\s+|\s+$/g, ''); }
function clean(s) {
    if (s == null) return '';
    return trim(String(s)
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&#x27;/gi, "'")
        .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/&#(\d+);/g, function (m, d) { return String.fromCharCode(parseInt(d, 10)); }));
}
function yearStr(y) { y = parseInt(y, 10); return (y && y > 1900) ? String(y) : ''; }
function typeOf(area) {
    area = area || '';
    if (/日本|日韩|韩/.test(area)) return '日漫';
    if (/欧美|美国|英|法|德|加拿大|俄/.test(area)) return '欧美';
    return '国漫';
}
function subType(dType, area) {
    var t = String(dType || '');
    if (t === '31') return '日漫';
    if (t === '33') return '欧美';
    if (t === '30') return '国漫';
    return typeOf(area);
}
function encReq(plain) {
    var hex = crypto.aes.encrypt(plain, ENC_KEY, {
        mode: 'CBC', padding: 'PKCS5',
        keyFormat: 'utf8', ivFormat: 'utf8', iv: ENC_IV,
        input: 'utf8', output: 'hex'
    }) || '';
    return hex.toUpperCase();
}
function buildKeys() {
    return crypto.rsa.encrypt(JSON.stringify({ iv: ENC_IV, key: ENC_KEY }), RSA_PUB, {
        padding: 'PKCS1', input: 'utf8', output: 'base64'
    }) || '';
}
function decResp(resp) {
    var j = parseJson(resp);
    if (!j || !j.data) return '';
    var data = j.data;
    if (!data.keys || !data.response_key) return '';
    var kj = crypto.rsa.decrypt(data.keys, RSA_PRIV, { padding: 'PKCS1', input: 'base64', output: 'utf8' });
    var ko = parseJson(kj) || {};
    if (!ko.key || !ko.iv) return '';
    return crypto.aes.decrypt(data.response_key, ko.key, {
        mode: 'CBC', padding: 'PKCS5',
        keyFormat: 'utf8', ivFormat: 'utf8', iv: ko.iv,
        input: 'hex', output: 'utf8'
    }) || '';
}
function curHost() { return HOSTS[_hostIdx % HOSTS.length]; }
function rotateHost() { _hostIdx = (_hostIdx + 1) % HOSTS.length; }
function rawApi(path, obj) {
    var host = curHost();
    var time = nowSec();
    var rk = encReq(JSON.stringify(obj));
    var keys = buildKeys();
    var sign = md5('token_id=,token=' + _token + ',phone_type=1,request_key=' + rk +
        ',app_id=1,time=' + time + ',keys=' + keys + SALT).toUpperCase();
    var form = 'token=' + encodeUri(_token) +
        '&token_id=&phone_type=1&time=' + time +
        '&phone_model=' + encodeUri(PHONE_MODEL) +
        '&keys=' + encodeUri(keys) +
        '&request_key=' + encodeUri(rk) +
        '&signature=' + sign +
        '&app_id=1&ad_version=1';
    var headers = {
        'User-Agent': UA,
        'code': CODE,
        'deviceId': _deviceId,
        'lang': 'zh_cn',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Version': VERSION,
        'PackageName': PKG,
        'Ver': VER,
        'api-ver': VER,
        'Referer': host
    };
    var resp = post(host + path, form, JSON.stringify({ headers: headers, timeout: 20000 }));
    return decResp(resp);
}
function rawApiAll(path, obj) {
    for (var i = 0; i < HOSTS.length; i++) {
        var s = rawApi(path, obj);
        if (s) return s;
        rotateHost();
    }
    return '';
}
function doRegister() {
    regenDevice();
    var r = parseJson(rawApiAll('/App/Authentication/Device/signUp',
        { new_key: _deviceKey, old_key: DEVICE_OLD_KEY, phone_type: 1, code: '' })) || {};
    if (r.token) {
        _token = String(r.token);
        if (r.app_user_id != null && String(r.app_user_id) !== '') _tokenId = String(r.app_user_id);
    }
    var r2 = parseJson(rawApiAll('/App/Authentication/Authenticator/refresh', {})) || {};
    if (r2.token) {
        _token = String(r2.token);
        if (r2.app_user_id != null && String(r2.app_user_id) !== '') _tokenId = String(r2.app_user_id);
    }
    // 记录注册结果：拿到 token 清失败态；没拿到记失败时刻，进入冷却（见 _lastRegFailAt 注释）。
    _lastRegFailAt = _token ? 0 : Date.now();
}
function ensureToken() {
    if (TOKEN_OVERRIDE) {
        _token = TOKEN_OVERRIDE;
        if (TOKEN_ID_OVERRIDE) _tokenId = TOKEN_ID_OVERRIDE;
        return;
    }
    if (_token) return;
    // 注册失败冷却期内不再重试注册：保持空 token 快速失败（api() 会就地返回 ''），
    // 避免站点不可用时每次调用都重跑 signUp+refresh×全部域名。
    if (_lastRegFailAt && Date.now() - _lastRegFailAt < REG_FAIL_COOLDOWN_MS) return;
    doRegister();
}
function api(path, obj) {
    ensureDevice();
    ensureToken();
    // 注册失败（含冷却期内快速失败）没拿到 token：业务请求必被拒，直接返回空，别再×域名空转。
    if (!_token) return '';
    var s = rawApiAll(path, obj);
    if (!s && _token && !TOKEN_OVERRIDE) {
        _token = ''; _tokenId = '';
        doRegister();
        // 重领失败（已进入冷却）就不再空转一轮域名了
        s = _token ? rawApiAll(path, obj) : '';
    }
    return s;
}
function apiJson(path, obj) { return parseJson(api(path, obj)) || {}; }
function mapItem(it) {
    return {
        id:      String(it.vod_id),
        name:    clean(it.vod_name),
        pic:     trim(it.vod_pic),
        type:    subType(it.d_type, it.vod_area),
        year:    yearStr(it.vod_year),
        remarks: clean(it.new_continue || it.vod_continu),
        desc:    ''
    };
}
function listVod(sub, f, page) {
    f = f || {};
    var j = apiJson('/App/IndexList/indexList', {
        tid: '3',
        page: String(page || 1),
        sort: f.sort || 'd_id',
        area: f.area || '0',
        sub: String(sub),
        year: f.year || '0',
        pageSize: '30'
    });
    return (j.list || []).map(mapItem);
}
function searchWord(wd) {
    var j = apiJson('/App/Index/findMoreVod', { keywords: wd, order_val: '1' });
    return (j.list || [])
        .filter(function (it) { return String(it.t_id) === '4'; })
        .map(mapItem);
}
var AREA_OPTS = [
    { n: '全部', v: '0' }, { n: '大陆', v: '大陆' }, { n: '日本', v: '日本' },
    { n: '香港', v: '香港' }, { n: '台湾', v: '台湾' }, { n: '韩国', v: '韩国' },
    { n: '欧美', v: '俄罗斯,加拿大,德国,意大利,法国,欧美,美国,英国,西班牙' },
    { n: '其他', v: '其他,印度,新加坡,马来西亚' }
];
var SORT_OPTS = [{ n: '综合', v: 'd_id' }, { n: '最新', v: 'd_addtime' }, { n: '最热', v: 'd_score' }];
function yearOpts() {
    var o = [{ n: '全部', v: '0' }];
    for (var y = (new Date()).getFullYear(); y >= 2015; y--) o.push({ n: String(y), v: String(y) });
    return o;
}
function subOf(cat) {
    cat = trim(cat);
    if (cat === '30') return '30';
    if (cat === '33') return '33';
    return '31';
}
function categories() {
    var fil = [
        { key: 'area', name: '地区', value: AREA_OPTS },
        { key: 'year', name: '年份', value: yearOpts() },
        { key: 'sort', name: '排序', value: SORT_OPTS }
    ];
    return JSON.stringify([
        { key: '31', title: '日番', filters: fil },
        { key: '30', title: '国漫', filters: fil },
        { key: '33', title: '欧美', filters: fil }
    ]);
}
function search(keyword, page) {
    page = page || 1;
    var key = trim(keyword);
    if (!key) return JSON.stringify(listVod('31', {}, page));
    if (key === '30' || key === '31' || key === '33') return JSON.stringify(listVod(key, {}, page));
    // 关键词搜索不分页，翻页直接空
    return page > 1 ? '[]' : JSON.stringify(searchWord(key));
}
function searchFiltered(category, filtersJson, page) {
    var f = parseJson(filtersJson) || {};
    return JSON.stringify(listVod(subOf(category), f, page || 1));
}
var _detailCache = {};
var _detailOrder = [];
function detail(id) {
    var key = String(id);
    if (_detailCache.hasOwnProperty(key)) return _detailCache[key];
    var out = { id: key, name: '', pic: '', desc: '', type: '', remarks: '', year: '', episodes: [] };
    // playInfo 业务体要带 token/token_id，须在构造请求体【前】先领到 token（否则冷 context 首个调用是 detail 时
    // 参数先求值会捕获空串）；api() 内部虽也会 ensureToken，但那发生在请求体求值之后，故这里显式提前。
    ensureDevice();
    ensureToken();
    var d = apiJson('/App/IndexPlay/playInfo',
        { token_id: _tokenId, vod_id: String(id), mobile_time: nowSec(), token: _token }).vodInfo || {};
    out.name    = clean(d.vod_name);
    out.pic     = trim(d.vod_pic);
    out.desc    = clean(d.vod_use_content);
    out.remarks = clean(d.new_continue);
    out.year    = yearStr(d.vod_year);
    out.type    = typeOf(d.vod_area);

    // 选集：按分辨率分组成线路（一档分辨率 = 一条线路），show_type==2 不可用要跳过
    var list = apiJson('/App/Resource/Vurl/show', { vurl_cloud_id: '2', vod_d_id: String(id) }).list || [];
    var lineMap = {}, order = [];
    for (var i = 0; i < list.length; i++) {
        var ep = list[i] || {};
        var play = ep.play || {};
        var epTitle = clean(ep.title) || ('第' + (i + 1) + '集');
        for (var res in play) {
            if (!play.hasOwnProperty(res)) continue;
            var pv = play[res] || {};
            if (String(pv.show_type) === '2' || !pv.param) continue;
            if (!lineMap[res]) { lineMap[res] = []; order.push(res); }
            lineMap[res].push({ name: epTitle, url: trim(pv.param) });
        }
    }
    // 分辨率从高到低排，默认线路即最高清（对象 key 遍历是数值升序，不排会让 480P 当默认）
    order.sort(function (a, b) {
        var na = parseInt(a, 10), nb = parseInt(b, 10);
        return (isNaN(nb) ? -1 : nb) - (isNaN(na) ? -1 : na);
    });
    for (var oi = 0; oi < order.length; oi++) {
        var resKey = order[oi];
        var route = /^\d+$/.test(resKey) ? (resKey + 'P') : resKey;   // 480P / 720P / 1080P
        var eps = lineMap[resKey];
        for (var ei = 0; ei < eps.length; ei++) {
            out.episodes.push({ name: eps[ei].name, url: eps[ei].url, route: route });
        }
    }
    var json = JSON.stringify(out);
    // 拿到选集才缓存：episodes 为空多半是网络 / 风控失败，缓存会让后续永远空、连播放都进不去，故跳过。
    if (out.episodes.length > 0) {
        _detailCache[key] = json;
        _detailOrder.push(key);
        if (_detailOrder.length > 80) delete _detailCache[_detailOrder.shift()];
    }
    return json;
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
    var result = { key: __auv_str(f.key), name: __auv_str(f.name || f.title), value: out };
    if (f.init != null) result.init = __auv_str(f.init);
    return result;
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
globalThis.__niviiSource = {init: function(ext) { globalThis.ext = ext || {}; },
home: __auv_home,
homeVod: __auv_home_vod,
category: __auv_category,
detail: __auv_detail,
search: __auv_search};
})();

/* ===== TVBox 出口（build 时自动注入）===== */
(function () {
    var s = globalThis.__niviiSource;
    if (!s) { console.log('[nivii] FATAL: __niviiSource 未定义'); return; }
    if (typeof s.play !== 'function') {
        s.play = function (flag, id, flags) {
            var empty = JSON.stringify({ parse: 0, jx: 0, url: '', header: {} });
            try {
                if (typeof s.resolvePlay === 'function') {
                    var r = s.resolvePlay(flag, id, flags);
                    if (r) return r;
                }
            } catch (e) {}
            try {
                if (/^https?:\/\//i.test(String(id)) && !/\s/.test(String(id))) {
                    return JSON.stringify({ parse: 0, jx: 0, url: String(id), header: {} });
                }
            } catch (e) {}
            return empty;
        };
    }
})();
export default globalThis.__niviiSource;
