// Metadata-only adapter. Playback remains in the authenticated server core.
globalThis.__niviiDetailRelatedVersion=1;
(function(){
var __auv_console = (typeof console !== 'undefined') ? console : { log: function(){}, error: function(){}, warn: function(){} };
var __auv_crypto = globalThis.CryptoJS || {};
var __auv_http_req = (typeof auvHttp === 'function' ? auvHttp : (globalThis.req || globalThis._http));
function log(message) { try { __auv_console.log(String(message)); } catch (e) {} }
function encodeUri(value) { return encodeURIComponent(value == null ? '' : String(value)); }
function decodeUri(value) { try { return decodeURIComponent(value == null ? '' : String(value)); } catch (e) { return value == null ? '' : String(value); } }
function base64Encode(value) { try { return __auv_crypto.enc.Base64.stringify(__auv_crypto.enc.Utf8.parse(value == null ? '' : String(value))); } catch (e) { return ''; } }
function base64Decode(value) { try { return __auv_crypto.enc.Base64.parse(value == null ? '' : String(value)).toString(__auv_crypto.enc.Utf8); } catch (e) { return ''; } }
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
function get(url, options) { return request(url, options); }
var http = { request2: function(url, options) { var response = __auv_http_req(url, __auv_options(options, "get")); return { ok: response.status >= 200 && response.status < 300, status: response.status, body: response.content, headers: response.headers }; } };
var EXT = (typeof ext !== 'undefined' && ext) ? ext : {};
var HOSTS = (EXT.hosts && EXT.hosts.length) ? EXT.hosts : [
    'https://anich.sends.eu.org',
    'https://eo.api.anich.sends.eu.org.cdn.cloudflare.net'
];
var UA = EXT.ua || 'app.anich Android 1.5.23';
var PAGE = 30;
var TIMEOUT = 15000;
var LINE_MAX = 20;
function _log(s) { try { log('[anich] ' + s); } catch (e) {} }
function _reqText(path) {
    for (var i = 0; i < HOSTS.length; i++) {
        try {
            var s = get(HOSTS[i] + path, JSON.stringify({ headers: { 'User-Agent': UA }, timeout: TIMEOUT }));
            if (s) return s;
        } catch (e) { _log('req err ' + HOSTS[i] + path + ' :: ' + e); }
    }
    return '';
}
function _reqBytes(path) {
    for (var i = 0; i < HOSTS.length; i++) {
        try {
            var wire = http.request2(HOSTS[i] + path, {
                responseEncoding: 'base64', headers: { 'User-Agent': UA }, timeout: TIMEOUT
            });
            if (wire && wire.ok && wire.body) return _b64ToBytes(wire.body);
        } catch (e) { _log('bytes err ' + HOSTS[i] + path + ' :: ' + e); }
    }
    return [];
}
function _b64ToBytes(b64) {
    var hex = crypto.base64.decode(b64, { output: 'hex' });
    var n = hex.length >> 1, a = new Array(n);
    for (var i = 0; i < n; i++) a[i] = parseInt(hex.substr(i * 2, 2), 16);
    return a;
}
function _rv(b, c) {
    var s = 0, r = 0, x;
    while (c.i < b.length) { x = b[c.i++]; r += (x & 0x7f) * Math.pow(2, s); if (!(x & 0x80)) break; s += 7; }
    return r;
}
function _fields(b, start, end) {
    var c = { i: start }, out = {};
    while (c.i < end) {
        var tag = _rv(b, c), fn = Math.floor(tag / 8), wt = tag & 7, e;
        if (wt === 0) e = { t: 0, v: _rv(b, c) };
        else if (wt === 2) { var len = _rv(b, c), s = c.i; c.i += len; e = { t: 2, s: s, e: s + len }; }
        else if (wt === 5) { e = { t: 5, s: c.i }; c.i += 4; }
        else if (wt === 1) { e = { t: 1, s: c.i }; c.i += 8; }
        else break;
        (out[fn] = out[fn] || []).push(e);
    }
    return out;
}
function _str(b, e) {
    if (!e || e.t !== 2) return '';
    var str = '';
    for (var i = e.s; i < e.e; i++) { var h = b[i].toString(16); if (h.length < 2) h = '0' + h; str += '%' + h; }
    try { return decodeUri(str); } catch (err) { return ''; }
}
function _uint(e) { return (e && e.t === 0) ? e.v : 0; }
function _first(f, fn) { return (f[fn] && f[fn].length) ? f[fn][0] : null; }
function _dataItems(bytes) {
    if (!bytes || !bytes.length) return [];
    var top = _fields(bytes, 0, bytes.length), arr = top[1] || [], out = [];
    for (var i = 0; i < arr.length; i++) { var e = arr[i]; if (e.t === 2) out.push(_fields(bytes, e.s, e.e)); }
    return out;
}
function _urlDecode(enc) {
    if (!enc) return '';
    try {
        var s = enc.substring(0, 3) + enc.substring(4);
        s = s.replace(/-/g, '+').replace(/_/g, '/');
        while (s.length % 4) s += '=';
        return base64Decode(s);
    } catch (e) { return ''; }
}
function _encFlag(id, sort, slug) { return String(id) + '$' + String(sort) + '$' + (slug || ''); }
function _cardsFromList(bytes) {
    var items = _dataItems(bytes), out = [];
    for (var i = 0; i < items.length; i++) {
        var f = items[i], id = _uint(_first(f, 1));
        if (!id) continue;
        var title = _str(bytes, _first(f, 2));
        if (!title) continue;
        var epTotal = _uint(_first(f, 4)), status = _str(bytes, _first(f, 5));
        out.push({
            id: String(id), name: title, pic: _str(bytes, _first(f, 7)), type: '', year: '',
            remarks: _str(bytes, _first(f, 8)) || status || (epTotal ? ('全' + epTotal + '话') : ''), desc: ''
        });
    }
    return out;
}
function _cardsFromLatest(bytes) {
    var items = _dataItems(bytes), out = [], seen = {};
    for (var i = 0; i < items.length; i++) {
        var f = items[i], id = _uint(_first(f, 2));
        if (!id || seen[id]) continue; seen[id] = 1;
        var title = _str(bytes, _first(f, 7)) || _str(bytes, _first(f, 8));
        if (!title) continue;
        var ep = _uint(_first(f, 3));
        out.push({ id: String(id), name: title, pic: _str(bytes, _first(f, 6)), type: '', year: '', remarks: ep ? ('更新至' + ep + '话') : '' });
    }
    return out;
}
var RECOMMEND_CACHE_KEY = 'anich_recommend_v1';
function recommendations() {
    var cached = parseJson(getItem(RECOMMEND_CACHE_KEY, ''));
    if (cached && Date.now() - cached.at < 120000 && cached.data && Array.isArray(cached.data.data)) return cached.data;
    var data = parseJson(_reqText('/bangumi/recommend?nsfw=false&res=true'));
    if (!data || !Array.isArray(data.data) || !data.data.length) throw new Error('AniCh 暂时无法获取分类');
    setItem(RECOMMEND_CACHE_KEY, JSON.stringify({ at: Date.now(), data: data }));
    return data;
}
function recommendCards(section) {
    return (section.list || []).filter(function(item) { return item && item.id && item.title; }).map(function(item) {
        return { id: String(item.id), name: item.title, pic: item.image || '', type: section.title || '动漫',
            year: _yearOf(item.tagline), remarks: item.tagline || '', desc: '' };
    });
}
function categories() {
    var result = [{ key: '', title: '推荐' }, { key: 'latest', title: '最近更新' }];
    recommendations().data.forEach(function(section) {
        if (section.title && Array.isArray(section.list) && section.list.length) result.push({ key: 'rec:' + section.title, title: section.title });
    });
    return JSON.stringify(result);
}
function _yearOf(tagline) {
    var m = String(tagline || '').match(/(19|20)\d{2}/);
    return m ? m[0] : '';
}
function homeSections() {
    var out = [];
    var r = parseJson(_reqText('/bangumi/recommend?nsfw=false&res=true')) || {};
    var secs = r.data || [];
    for (var i = 0; i < secs.length; i++) {
        var lst = secs[i].list || [], items = [];
        for (var j = 0; j < lst.length; j++) {
            var it = lst[j] || {};
            if (!it.id || !it.title) continue;
            items.push({ id: String(it.id), name: it.title, pic: it.image || '', type: '', year: _yearOf(it.tagline), remarks: it.tagline || '', desc: '' });
        }
        if (items.length) out.push({ title: secs[i].title || '推荐', key: '', items: items });
    }
    var car = r.carousel || [], hero = [];
    for (var k = 0; k < car.length; k++) {
        var c = car[k] || {};
        if (!c.id) continue;
        hero.push({ id: String(c.id), name: c.title || '', pic: c.image || '', type: '', year: '', remarks: c.type || '' });
    }
    if (hero.length) out.push({ title: '精选推荐', key: '__hero__', items: hero });
    if (!out.length) {
        var latest = _cardsFromLatest(_reqBytes('/bangumi/latest?nsfw=false&res=true'));
        if (latest.length) out.push({ title: '最近更新', key: '', items: latest.slice(0, 20) });
        var idx = _cardsFromList(_reqBytes('/bangumi/list?skip=0&nsfw=false&res=true'));
        if (idx.length) out.push({ title: '索引', key: 'index', items: idx.slice(0, 20) });
    }
    return JSON.stringify(out);
}
function search(keyword, page) {
    page = parseInt(page, 10) || 1;
    var kw = String(keyword || '').trim();
    if (!kw || kw === 'latest' || kw.indexOf('rec:') === 0) return searchFiltered(kw || 'latest', '{}', page);
    return JSON.stringify(_cardsFromList(_reqBytes('/bangumi/search?keyword=' + encodeUri(kw) + '&skip=' + ((page - 1) * PAGE) + '&nsfw=false&res=true')));
}
function searchFiltered(category, filtersJson, page) {
    // Source recommendation/latest feeds expose one snapshot, without invented filter options.
    if (Number(page || 1) > 1) return '[]';
    if (!category || category === 'latest') return JSON.stringify(_cardsFromLatest(_reqBytes('/bangumi/latest?nsfw=false&res=true')));
    if (String(category).indexOf('rec:') === 0) {
        var title = String(category).substring(4);
        var section = recommendations().data.find(function(row) { return row.title === title; });
        return JSON.stringify(section ? recommendCards(section) : []);
    }
    return '[]';
}
function detail(id) {
    var out = { id: String(id), name: '', pic: '', type: '', year: '', remarks: '', desc: '', episodes: [] };
    var d = parseJson(_reqText('/bangumi/detail/' + id)) || {};
    out.name = d.title || '';
    out.pic = d.image || '';
    out.desc = d.overview || '';
    if (d.airdate) { try { out.year = String(new Date(d.airdate).getFullYear()); } catch (e) {} }
    var meta = [];
    if (d.genres && d.genres.length) meta = meta.concat(d.genres.slice(0, 3));
    if (d.lang) meta.push(d.lang);
    var region = (d.region && d.region.length) ? (d.region[0] || d.region) : (d.region || '');
    if (region) meta.push(String(region));
    out.type = meta.join(' ');
    if (d.episodes_total) out.remarks = '全' + d.episodes_total + '话';

    var bytes = _reqBytes('/bangumi/episodes/' + id);
    var items = _dataItems(bytes);
    var eps = [];
    for (var i = 0; i < items.length; i++) {
        var f = items[i];
        if (!_uint(_first(f, 1))) continue;   // status=true 才有资源
        var sort = _uint(_first(f, 2));
        if (!sort) continue;
        eps.push({ sort: sort, etitle: _str(bytes, _first(f, 8)) });
    }
    eps.sort(function (a, b) { return a.sort - b.sort; });
    if (!eps.length && d.episodes_total) {
        for (var k = 1; k <= d.episodes_total; k++) eps.push({ sort: k, etitle: '' });
    }
    if (!eps.length) return JSON.stringify(out);

    // 每个 slug（源站线路）做成一条 route → 播放器出「线路切换」Tab
    var routes = [], seenSlug = {};
    var lines0 = _vodById(id, eps[0].sort);
    for (var li = 0; li < lines0.length && routes.length < LINE_MAX; li++) {
        var sg = lines0[li].slug;
        if (!sg || seenSlug[sg]) continue;
        seenSlug[sg] = 1;
        routes.push(sg);
    }
    if (!routes.length) routes = ['在线播放'];

    for (var r = 0; r < routes.length; r++) {
        var slug = routes[r] === '在线播放' ? '' : routes[r];
        for (var e2 = 0; e2 < eps.length; e2++) {
            var s = eps[e2].sort, et = eps[e2].etitle;
            out.episodes.push({ name: '第' + s + '集' + (et ? (' ' + et) : ''), url: _encFlag(id, s, slug), route: routes[r] });
        }
    }
    return JSON.stringify(out);
}
function _vodById(id, sort) {
    var arr = parseJson(_reqText('/vod/' + id + '/' + sort));
    if (!arr || !arr.length || typeof arr[0] !== 'number') return [];
    var items = _dataItems(arr), out = [];
    for (var i = 0; i < items.length; i++) {
        var f = items[i], url = _urlDecode(_str(arr, _first(f, 1)));
        if (!url) continue;
        out.push({ url: url, type: _str(arr, _first(f, 3)), caption: _str(arr, _first(f, 4)), slug: _str(arr, _first(f, 5)) });
    }
    return out;
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
    return JSON.stringify({ list: __auv_list(data), page: parseInt(pg || 1), pagecount: 1 });
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
