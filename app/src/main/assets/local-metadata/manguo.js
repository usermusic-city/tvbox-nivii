// Metadata-only adapter. Playback remains in the authenticated server core.
globalThis.__niviiDetailRelatedVersion=1;
(function(){
var __auv_console = (typeof console !== 'undefined') ? console : { log: function(){}, error: function(){}, warn: function(){} };
var __auv_crypto = globalThis.CryptoJS || {};
var __auv_http_req = (typeof auvHttp === 'function' ? auvHttp : (globalThis.req || globalThis._http));
function log(message) { try { __auv_console.log(String(message)); } catch (e) {} }
function encodeUri(value) { return encodeURIComponent(value == null ? '' : String(value)); }
function base64Encode(value) { try { return __auv_crypto.enc.Base64.stringify(__auv_crypto.enc.Utf8.parse(value == null ? '' : String(value))); } catch (e) { return ''; } }
function base64Decode(value) { try { return __auv_crypto.enc.Base64.parse(value == null ? '' : String(value)).toString(__auv_crypto.enc.Utf8); } catch (e) { return ''; } }
function md5(value) { value = value == null ? '' : String(value); try { if (typeof md5X === 'function') return md5X(value); } catch (e) {} try { return __auv_crypto.MD5(value).toString(); } catch (e2) { return ''; } }
function parseJson(value, fallback) { if (value == null || value === '') return fallback == null ? null : fallback; if (typeof value !== 'string') return value; try { return JSON.parse(value); } catch (e) { return fallback == null ? null : fallback; } }
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
var EXT       = (typeof ext !== 'undefined' && ext) ? ext : {};
var BASE_URL  = (EXT.url  || 'http://114.66.55.27:806').replace(/\/+$/, '');
var SITE_URL  = EXT.site      || '';
var SITE_KEY  = EXT.siteKey   || 'rectangleadsadxa';
var LIST_KEY  = EXT.listKey   || 'aassddwwxxllsx1x';
var DALVIK_UA = 'Dalvik/1.0.0 (Linux; U; Android 10; google Build/Pixel 3)';
var TIMEOUT   = 20000;
var AES_ECB = { mode: 'ECB', padding: 'PKCS5', keyFormat: 'utf8', input: 'base64', output: 'utf8' };
var NON_ANIME_RE = /电影|电视剧|连续剧|短剧|综艺|纪录片|记录片|体育|新闻|资讯|音乐\s*MV|写真|小说|漫画书/;
var CACHE_KEY = 'manguo_init:' + BASE_URL;
var CACHE_TTL = 2 * 3600 * 1000;
var BASE    = '';
var CFG     = null;
var TYPES   = null;
var BANNER_TYPE_ID = '';
var INIT_DONE = false;
function trim(s) { return s == null ? '' : String(s).replace(/^\s+|\s+$/g, ''); }
function nowSec() { return Math.floor(Date.now() / 1000); }
function dec(b64, key) {
    var s = trim(b64);
    if (!s) return '';
    try { return crypto.aes.decrypt(s, key, AES_ECB); } catch (e) { return ''; }
}
function stripTags(s) { return s ? String(s).replace(/<[^>]+>/g, '') : ''; }
function decodeEntities(s) {
    if (!s) return '';
    s = String(s)
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&quot;/gi, '"')
        .replace(/&apos;/gi, "'")
        .replace(/&#0?39;/g, "'")
        .replace(/&ldquo;/gi, '\u201c').replace(/&rdquo;/gi, '\u201d')
        .replace(/&lsquo;/gi, '\u2018').replace(/&rsquo;/gi, '\u2019')
        .replace(/&middot;/gi, '\u00b7').replace(/&mdash;/gi, '\u2014').replace(/&hellip;/gi, '\u2026');
    s = s.replace(/&#x([0-9a-fA-F]+);/g, function (m, h) { try { return String.fromCharCode(parseInt(h, 16)); } catch (e) { return m; } });
    s = s.replace(/&#(\d+);/g, function (m, d) { try { return String.fromCharCode(parseInt(d, 10)); } catch (e) { return m; } });
    return s;
}
function limitCats(s, n) {
    if (!s) return '';
    var parts = String(s).split(/[\s,，、\/\uff0f|\uff5c\u00b7]+/);
    var out = [];
    var max = n || 2;
    for (var i = 0; i < parts.length && out.length < max; i++) {
        var p = trim(parts[i]);
        if (p) out.push(p);
    }
    return out.join(' ');
}
function isAnimeType(name) {
    var n = trim(name);
    return !!n && !NON_ANIME_RE.test(n);
}
function apiHeaders() {
    return {
        'User-Agent': DALVIK_UA,
        'ua': md5(CFG ? (CFG.ua || '') : ''),
        'version': CFG ? (CFG.versionName || '') : ''
    };
}
function apiGet(path) {
    var url = /^https?:/i.test(path) ? path : (BASE + path);
    var body = request(url, JSON.stringify({ headers: apiHeaders(), timeout: TIMEOUT }));
    return dec(body, LIST_KEY);
}
function apiPostJson(path, jsonBody) {
    var h = apiHeaders();
    h['Content-Type'] = 'application/json; charset=utf-8';
    var body = post(BASE + path, jsonBody, JSON.stringify({ headers: h, timeout: TIMEOUT }));
    return dec(body, LIST_KEY);
}
function loadCache() {
    try {
        var s = getItem(CACHE_KEY, '');
        if (!s) return false;
        var o = parseJson(s);
        if (!o || !o.base || !o.cfg) return false;
        if ((nowSec() - (o.at || 0)) > CACHE_TTL) return false;
        BASE = o.base;
        CFG = o.cfg;
        TYPES = o.types || null;
        BANNER_TYPE_ID = o.bannerId || '';
        return true;
    } catch (e) { return false; }
}
function saveCache() {
    try {
        setItem(CACHE_KEY, JSON.stringify({
            at: nowSec(), base: BASE, cfg: CFG,
            types: TYPES, bannerId: BANNER_TYPE_ID
        }));
    } catch (e) {}
}
function ensureInit() {
    if (INIT_DONE) return BASE !== '';
    INIT_DONE = true;

    // 命中持久缓存：直接用，跳过所有网络
    if (loadCache()) { log('[manguo] init from cache, base=' + BASE); return BASE !== ''; }

    // 1) BASE：优先 ext.url 直连；否则解 api.txt
    BASE = BASE_URL;
    if (!BASE && SITE_URL) {
        try {
            var raw = request(SITE_URL, JSON.stringify({
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                },
                timeout: TIMEOUT
            }));
            var arr = parseJson(dec(raw, SITE_KEY)) || [];
            BASE = (arr[0] || '').replace(/\/+$/, '');
        } catch (e) { log('[manguo] resolve base err: ' + e); }
    }
    if (!BASE) { log('[manguo] base url empty, init aborted'); return false; }
    log('[manguo] base=' + BASE);


    // Metadata needs the public API version/UA, never player parser tables.
    try {
        var cj = parseJson(apiGet('/shark/api.php?action=configs')) || {};
        var conf = cj.config || {};
        CFG = { versionName: conf.versionName || '', ua: conf.ua || '' };
    } catch (e) { log('[manguo] metadata config unavailable'); }
    ensureTypesInternal(); saveCache(); return true;
}
function ensureTypesInternal() {
    if (TYPES) return TYPES;
    TYPES = [];
    try {
        var tj = parseJson(apiGet('/api.php/v1.home/types')) || {};
        var arr = (tj.data && tj.data.types) || [];
        for (var i = 0; i < arr.length; i++) {
            var t = arr[i];
            var id = (t.type_id == null) ? '' : String(t.type_id);
            if (!id) continue;
            if (!BANNER_TYPE_ID) BANNER_TYPE_ID = id;   // 第一个非空 → banner 用（首页聚合项）
            if (i === 0) continue;                       // 分类列表跳过首页聚合项
            var name = t.type_name || ('分类' + id);
            if (!isAnimeType(name)) continue;            // 硬规则：只留动漫
            TYPES.push({ id: id, name: name });
        }
    } catch (e) { log('[manguo] types err: ' + e); }
    return TYPES;
}
function ensureTypes() {
    if (TYPES) return TYPES;
    if (!ensureInit()) return (TYPES || []);
    return TYPES || [];
}
function isTypeId(key) {
    if (!/^\d+$/.test(key)) return false;
    var ts = ensureTypes();
    for (var i = 0; i < ts.length; i++) if (ts[i].id === key) return true;
    return false;
}
function toItem(v) {
    return {
        id: (v.vod_id == null) ? '' : String(v.vod_id),
        name: decodeEntities(v.vod_name || ''),
        pic: v.vod_pic || '',
        type: limitCats(v.vod_class || v.type_name || '', 2),
        year: v.vod_year || '',
        remarks: decodeEntities(v.vod_remarks || ''),
        desc: ''
    };
}
function classify(typeId, page, filters) {
    var out = [];
    if (!ensureInit()) return out;
    try {
        filters = filters || {};
        var body = JSON.stringify({ area: filters.area || '', rank: filters.rank || '最新', type: filters.type || '',
            year: filters.year || '', type_id: String(typeId) });
        var rj = parseJson(apiPostJson('/api.php/v1.classify/content?page=' + (page || 1), body)) || {};
        var list = (rj.data && rj.data.video_list) || [];
        for (var i = 0; i < list.length; i++) out.push(toItem(list[i]));
    } catch (e) { log('[manguo] classify err: ' + e); }
    return out;
}
function searchData(key, page) {
    var out = [];
    if (!ensureInit()) return out;
    try {
        var rj = parseJson(apiGet('/api.php/v1.search/data?wd=' + encodeUri(key) + '&type_id=0&page=' + (page || 1))) || {};
        var list = (rj.data && rj.data.search_data) || [];
        for (var i = 0; i < list.length; i++) out.push(toItem(list[i]));
    } catch (e) { log('[manguo] search err: ' + e); }
    return out;
}
var CLASSIFY_FILTERS = {};
function classifyFilters(typeId) {
    if (CLASSIFY_FILTERS[typeId]) return CLASSIFY_FILTERS[typeId];
    var cacheKey = 'manguo_filters_' + typeId;
    try {
        var cached = parseJson(getItem(cacheKey, ''));
        if (cached && nowSec() - cached.at < 900 && Array.isArray(cached.rows)) return CLASSIFY_FILTERS[typeId] = cached.rows;
    } catch (_) {}
    var response = parseJson(apiGet('/api.php/v1.classify/types?type_id=' + encodeUri(String(typeId)))) || {};
    var data = response.data || {}, rows = [];
    var fields = [['type_list', 'type', '类型'], ['year_list', 'year', '年份'],
        ['area_list', 'area', '地区'], ['rank_list', 'rank', '排序']];
    for (var i = 0; i < fields.length; i++) {
        var field = fields[i], values = data[field[0]];
        if (!Array.isArray(values) || !values.length) continue;
        var options = [], seen = {};
        for (var j = 0; j < values.length; j++) {
            var name = trim(values[j].type_name || values[j].name || values[j]);
            var value = /^(全部|所有|不限)/.test(name) ? '' : name;
            if (!name || seen[value]) continue;
            seen[value] = true;
            options.push({ n: name, v: value });
        }
        if (options.length) rows.push({ key: field[1], name: field[2], init: options[0].v, value: options });
    }
    if (!rows.length) throw new Error('来源未返回分类筛选信息，请稍后重试');
    CLASSIFY_FILTERS[typeId] = rows;
    try { setItem(cacheKey, JSON.stringify({ at: nowSec(), rows: rows })); } catch (_) {}
    return rows;
}
function categories() {
    var ts = ensureTypes();
    var out = [{ key: '', title: '推荐' }];
    for (var i = 0; i < ts.length; i++) {
        out.push({ key: ts[i].id, title: ts[i].name, filters: classifyFilters(ts[i].id) });
    }
    return JSON.stringify(out);
}
function homeSections() {
    if (!ensureInit()) return JSON.stringify([]);
    var out = [];
    var ts = ensureTypes();
    // 轮播 banner 当「热门推荐」一行（用首页聚合项 type_id）
    try {
        var firstId = BANNER_TYPE_ID || (ts.length ? ts[0].id : '');
        if (firstId) {
            var hj = parseJson(apiGet('/api.php/v1.home/data?type_id=' + firstId)) || {};
            var banners = (hj.data && hj.data.banners) || [];
            var bitems = [];
            for (var b = 0; b < banners.length; b++) bitems.push(toItem(banners[b]));
            if (bitems.length) out.push({ title: '热门推荐', key: '', items: bitems.slice(0, 12) });
        }
    } catch (e) { log('[manguo] home banner err: ' + e); }
    // 前几个动漫分类各取一页
    var rows = Math.min(ts.length, 4);
    for (var i = 0; i < rows; i++) {
        var items = classify(ts[i].id, 1);
        if (items.length) out.push({ title: ts[i].name, key: ts[i].id, items: items.slice(0, 12) });
    }
    return JSON.stringify(out);
}
function search(keyword, page) {
    page = page || 1;
    var key = trim(keyword || '');
    if (!key) {
        var ts = ensureTypes();
        return JSON.stringify(ts.length ? classify(ts[0].id, page) : []);
    }
    if (isTypeId(key)) return JSON.stringify(classify(key, page));
    return JSON.stringify(searchData(key, page));
}
function searchFiltered(category, filtersJson, page) {
    var f = parseJson(filtersJson) || {};
    var year = (f.year && f.year !== '全部') ? String(f.year) : '';
    var cat = trim(category);
    var arr;
    if (isTypeId(cat)) {
        var selected = { year: year, type: f.type || '', area: f.area || '', rank: f.rank || '最新' };
        arr = classify(cat, page || 1, selected);
    } else {
        arr = parseJson(search(category, page)) || [];
    }
    return JSON.stringify(arr);
}
function detail(id) {
    var out = { id: id, name: '', pic: '', type: '', year: '', remarks: '', desc: '', episodes: [] };
    if (!ensureInit()) return JSON.stringify(out);
    try {
        var dj = parseJson(apiGet('/api.php/v1.player/details?vod_id=' + encodeUri(String(id)))) || {};
        var d = (dj.data && dj.data.detail) || {};
        out.name    = decodeEntities(d.vod_name || '');
        out.pic     = d.vod_pic || '';
        out.type    = limitCats(d.vod_class || '', 2);
        out.year    = d.vod_year || '';
        out.remarks = decodeEntities(d.vod_remarks || '');
        out.desc    = trim(decodeEntities(stripTags(d.vod_content || '')));

        var lines = d.play_url_list || [];
        for (var i = 0; i < lines.length; i++) {
            var ln = lines[i];
            var from = ln.from || '';
            var show = (ln.show || from || ('线路' + (i + 1))).replace(/\(.*?\)|（.*?）/g, '');
            var urls = ln.urls || [];
            for (var j = 0; j < urls.length; j++) {
                var ep = urls[j];
                // flag 里塞够 play() 所需：from|集url|集名|片名（与原 App playerContent 拆分一致）
                var flag = from + '|' + (ep.url || '') + '|' + (ep.name || '') + '|' + (d.vod_name || '');
                out.episodes.push({ name: ep.name || ('' + (j + 1)), url: flag, route: show });
            }
        }
    } catch (e) { log('[manguo] detail err: ' + e); }
    return JSON.stringify(out);
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

/* ===== 破茧定制：TVBox JS 模块导出 =====
 * 上面的适配层只把接口挂在 globalThis.__niviiSource 上，
 * 而 TVBox 的 JsSpider 只认 export default 或 __jsEvalReturn()。
 * 这里补上标准导出，内部逻辑不做任何改动。 */
export function __jsEvalReturn() {
    if (globalThis.__niviiSource) return globalThis.__niviiSource;
    return null;
}
export default function () {
    return __jsEvalReturn();
}
