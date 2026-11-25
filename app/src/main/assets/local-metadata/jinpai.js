// Metadata-only adapter. Playback remains in the authenticated server core.
globalThis.__niviiDetailRelatedVersion=1;
(function(){
var __auv_crypto = globalThis.CryptoJS || {};
var __auv_http_req = (typeof auvHttp === 'function' ? auvHttp : (globalThis.req || globalThis._http));
function encodeUri(value) { return encodeURIComponent(value == null ? '' : String(value)); }
function base64Encode(value) { try { return __auv_crypto.enc.Base64.stringify(__auv_crypto.enc.Utf8.parse(value == null ? '' : String(value))); } catch (e) { return ''; } }
function base64Decode(value) { try { return __auv_crypto.enc.Base64.parse(value == null ? '' : String(value)).toString(__auv_crypto.enc.Utf8); } catch (e) { return ''; } }
function md5(value) { value = value == null ? '' : String(value); try { if (typeof md5X === 'function') return md5X(value); } catch (e) {} try { return __auv_crypto.MD5(value).toString(); } catch (e2) { return ''; } }
function sha1(value) { value = value == null ? '' : String(value); try { return __auv_crypto.SHA1(value).toString(); } catch (e) { return ''; } }
function parseJson(value, fallback) { if (value == null || value === '') return fallback == null ? null : fallback; if (typeof value !== 'string') return value; try { return JSON.parse(value); } catch (e) { return fallback == null ? null : fallback; } }
function request(url, options) { var res = __auv_http_req(url, __auv_options(options, 'get')); return res && res.content != null ? String(res.content) : ''; }
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
var KEY = 'cb808529bae6b6be45ecfab29a4889bc';
function trim(s) { return s == null ? '' : String(s).replace(/^\s+|\s+$/g, ''); }
function rstrip(s) { return trim(s).replace(/\/+$/, ''); }
var HOSTS = (function () {
    try {
        if (typeof ext !== 'undefined' && ext) {
            if (typeof ext === 'string' && ext.indexOf('http') >= 0) {
                return ext.split(',').map(rstrip).filter(function (x) { return !!x; });
            }
            if (ext.hosts && ext.hosts.length) return ext.hosts.map(rstrip);
            if (ext.host) return [rstrip(ext.host)];
        }
    } catch (e) {}
    return ['https://y2s52n7.com', 'https://m.hkybqufgh.com', 'https://m.sizhengxt.com',
            'https://m.9zhoukj.com', 'https://m.jiabaide.cn', 'https://www.hkybqufgh.com'];
})();
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
    if (/日本|日韩/.test(area)) return '日漫';
    if (/欧美|美国/.test(area)) return '欧美';
    return '国漫';
}
function sign(raw) { return sha1(md5(raw)); }
function hdr(raw, t) {
    return { 'sign': sign(raw), 'T': t, 'Deviceid': 'Deviceid', 'User-Agent': 'okhttp/3.15' };
}
var RESOLVED = '';
function host() {
    if (RESOLVED) return RESOLVED;
    for (var i = 0; i < HOSTS.length; i++) {
        var h = rstrip(HOSTS[i]);
        if (!h) continue;
        var t = String(Date.now());
        var body = request(h + '/api/mw-movie/anonymous/home/hotSearch',
            JSON.stringify({ headers: hdr('key=' + KEY + '&t=' + t, t), timeout: 8000 })) || '';
        if (body && body.charAt(0) === '{') { RESOLVED = h; return h; }
    }
    RESOLVED = rstrip(HOSTS[0] || '');
    return RESOLVED;
}
function api(path, raw, t) {
    return request(host() + path, JSON.stringify({ headers: hdr(raw, t), timeout: 15000 })) || '';
}
function mapItem(it) {
    var year = yearStr(it.vodYear);
    if (!year) year = yearStr(String(it.vodPubdate || '').substring(0, 4));
    return {
        id:      String(it.vodId),
        name:    clean(it.vodName),
        pic:     trim(it.vodPic),
        type:    typeOf(it.vodArea),
        year:    year,
        remarks: clean(it.vodRemarks),
        desc:    ''
    };
}
function listVod(area, year, page) {
    page = page || 1;
    var t = String(Date.now());
    var raw = 'area=' + (area || '') + '&pageNum=' + page + '&type1=4&year=' + (year || '') + '&key=' + KEY + '&t=' + t;
    var path = '/api/mw-movie/anonymous/video/list?type1=4&pageNum=' + page +
               '&area=' + encodeUri(area || '') + '&year=' + encodeUri(year || '');
    var j = parseJson(api(path, raw, t)) || {};
    var list = (j.data && j.data.list) || [];
    var out = [];
    for (var i = 0; i < list.length; i++) out.push(mapItem(list[i]));
    return out;
}
function searchWord(wd, page) {
    var t = String(Date.now());
    var raw = 'keyword=' + wd + '&pageNum=1&pageSize=8&key=' + KEY + '&t=' + t;
    var path = '/api/mw-movie/anonymous/video/searchByWord?keyword=' + encodeUri(wd) + '&pageNum=1&pageSize=8';
    var j = parseJson(api(path, raw, t)) || {};
    var list = (j.data && j.data.result && j.data.result.list) || [];
    var out = [];
    for (var i = 0; i < list.length; i++) {
        if (Number(list[i].typeId1) !== 4) continue;   // 非动漫丢弃
        out.push(mapItem(list[i]));
    }
    return out;
}
var TAB_AREA = { '动漫': '', '日本': '日本', '大陆': '中国大陆' };
var YEAR_OPTS = (function () {
    var o = [{ n: '全部', v: '' }];
    for (var y = (new Date()).getFullYear(); y >= 2010; y--) o.push({ n: String(y), v: String(y) });
    o.push({ n: '2009~2000', v: '2009~2000' }, { n: '更早', v: '更早' });
    return o;
})();
var AREA_OPTS = [{ n: '全部', v: '' }, { n: '中国大陆', v: '中国大陆' },
                 { n: '日本', v: '日本' }, { n: '美国', v: '美国' }, { n: '其他', v: '其他' }];
function categories() {
    return JSON.stringify([
        { key: '',     title: '推荐' },
        { key: '动漫', title: '全部', filters: [
            { key: 'area', name: '地区', value: AREA_OPTS },
            { key: 'year', name: '年份', value: YEAR_OPTS }
        ] },
        { key: '日本', title: '日番', filters: [
            { key: 'year', name: '年份', value: YEAR_OPTS }
        ] },
        { key: '大陆', title: '国漫', filters: [
            { key: 'year', name: '年份', value: YEAR_OPTS }
        ] }
    ]);
}
function search(keyword, page) {
    page = page || 1;
    var key = trim(keyword);
    if (!key) return JSON.stringify(listVod('', '', page));               // 推荐/首页 = 最新动漫
    if (TAB_AREA.hasOwnProperty(key)) return JSON.stringify(listVod(TAB_AREA[key], '', page));
    return JSON.stringify(searchWord(key, page));
}
function searchFiltered(category, filtersJson, page) {
    var f = parseJson(filtersJson) || {};
    var cat = trim(category);
    var area = TAB_AREA.hasOwnProperty(cat) ? TAB_AREA[cat] : '';
    if (!area && f.area) area = f.area;
    return JSON.stringify(listVod(area, f.year || '', page || 1));
}
function homeSections() {
    var buckets = [
        { title: '最新动漫', key: '',   area: '' },
        { title: '日本番',   key: '日本', area: '日本' },
        { title: '国产动漫', key: '大陆', area: '中国大陆' },
        { title: '欧美动漫', key: '',   area: '美国' }
    ];
    var out = [];
    for (var i = 0; i < buckets.length; i++) {
        var b = buckets[i];
        var items = listVod(b.area, '', 1);
        if (items.length) out.push({ title: b.title, key: b.key, items: items.slice(0, 12) });
    }
    return JSON.stringify(out);
}
function detail(id) {
    var out = { id: String(id), name: '', pic: '', desc: '', type: '', remarks: '', year: '', episodes: [] };
    var t = String(Date.now());
    var raw = 'id=' + id + '&key=' + KEY + '&t=' + t;
    var j = parseJson(api('/api/mw-movie/anonymous/video/detail?id=' + encodeUri(String(id)), raw, t)) || {};
    var d = j.data || {};
    out.name    = clean(d.vodName);
    out.pic     = trim(d.vodPic);
    out.desc    = clean(d.vodContent || d.vodBlurb);
    out.remarks = clean(d.vodRemarks);
    out.year    = yearStr(d.vodYear);
    out.type    = typeOf(d.vodArea);

    var eps = d.episodeList || [];
    for (var i = 0; i < eps.length; i++) {
        var nid = trim(eps[i].nid);
        if (!nid) continue;
        var name = clean(eps[i].name) || ('第' + (i + 1) + '集');
        // 选集 flag = id@nid，play() 拆开调播放接口
        out.episodes.push({ name: name, url: String(id) + '@' + nid, route: '在线播放' });
    }
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
