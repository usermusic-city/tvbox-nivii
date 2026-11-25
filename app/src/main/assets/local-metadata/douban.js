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
var EXT = (typeof ext !== 'undefined' && ext) ? ext : {};
var REX_API = 'https://m.douban.com/rexxar/api/v2/';
var OLD_API = 'https://movie.douban.com/j/search_subjects';
var UA = String(EXT.ua || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
var PAGE = 20;
var TAB_JP = '日本动画';
var TAB_CN = '国产动画';
var TAB_MV = '动画电影';
var GENRES = ['热血', '校园', '恋爱', '搞笑', '治愈', '科幻', '奇幻', '冒险', '悬疑', '推理', '日常', '运动', '机战', '催泪'];
function trim(s) { return s == null ? '' : String(s).replace(/^\s+|\s+$/g, ''); }
function coverUrl(url) {
    url = trim(url);
    if (!url || url.indexOf('doubanio.com') < 0 || url.indexOf('@Referer=') >= 0) return url;
    return url + '@Referer=https://movie.douban.com/@User-Agent=Mozilla/5.0';
}
function reqOpt() {
    return JSON.stringify({
        timeout: 12000,
        // rexxar 校验 douban 域 Referer（explore 页面地址实测通过）
        headers: { 'User-Agent': UA, 'Referer': 'https://movie.douban.com/explore', 'Accept': 'application/json' },
    });
}
function rexParams(key) {
    if (key === TAB_JP) return { kind: 'tv', base: ['动画', '日本'] };
    if (key === TAB_CN) return { kind: 'tv', base: ['动画', '大陆'] };
    if (key === TAB_MV) return { kind: 'movie', base: ['动画'] };
    return { kind: 'tv', base: ['动画'] };   // 推荐 = TV 动画全体，近期热度排序即当季热门
}
function oldParams(key) {
    if (key === TAB_JP) return { type: 'tv', tag: '日本动画' };
    if (key === TAB_CN) return { type: 'movie', tag: '国产动画' };
    if (key === TAB_MV) return { type: 'movie', tag: '动画' };
    return { type: 'movie', tag: '动漫' };
}
function sortRex(v) { return v === 'new' ? 'R' : (v === 'score' ? 'S' : 'U'); }
function sortOld(v) { return v === 'new' ? 'time' : (v === 'score' ? 'rank' : 'recommend'); }
function mapRexCard(s, tabType) {
    if (!s || s.id == null) return null;
    // recommend 流里会插「豆瓣榜单/片单」推荐卡（id 形如 film_genre_31、subtitle=豆瓣榜单），
    // 不是影片、点了也搜不到——按「影片 id 必为纯数字 + type 白名单」双重过滤掉
    var id = String(s.id);
    if (!/^\d+$/.test(id)) return null;
    if (s.type && s.type !== 'movie' && s.type !== 'tv') return null;
    var name = trim(s.title);
    if (!name) return null;
    var pic = s.pic || {};
    var rate = (s.rating && s.rating.value) ? String(s.rating.value) : '';
    return {
        id: String(s.id),
        name: name,
        pic: coverUrl(pic.large || pic.normal || ''),
        type: tabType || '动漫',
        year: trim(s.year),
        remarks: rate ? (rate + '分') : '',
        desc: trim(s.card_subtitle),
    };
}
function mapOldCard(s, tabType) {
    if (!s || s.id == null) return null;
    var name = trim(s.title);
    if (!name) return null;
    var rate = trim(s.rate);
    var eps = trim(s.episodes_info);
    return {
        id: String(s.id),
        name: name,
        pic: coverUrl(s.cover),
        type: tabType || '动漫',
        year: '',
        remarks: rate ? (rate + '分') : eps,
        desc: '',
    };
}
function fetchRex(kind, tags, sortV, page, tabType) {
    page = parseInt(page, 10) || 1;
    var start = (page - 1) * PAGE;
    var url = REX_API + kind + '/recommend?refresh=0&start=' + start + '&count=' + PAGE +
        '&tags=' + encodeUri(tags.join(',')) + '&sort=' + sortRex(sortV);
    var j = parseJson(request(url, reqOpt())) || {};
    var arr = j.items || [];
    log('[douban] rexxar ' + (arr.length || 0) + '条(total=' + (j.total == null ? '?' : j.total) + '): ' + url);
    var out = [];
    for (var i = 0; i < arr.length; i++) { var it = mapRexCard(arr[i], tabType); if (it) out.push(it); }
    return out;
}
function fetchOld(type, tag, sortV, page, tabType) {
    page = parseInt(page, 10) || 1;
    var start = (page - 1) * PAGE;
    var url = OLD_API + '?type=' + type + '&tag=' + encodeUri(tag) +
        '&sort=' + sortOld(sortV) + '&page_limit=' + PAGE + '&page_start=' + start;
    var j = parseJson(request(url, reqOpt())) || {};
    var arr = j.subjects || [];
    var out = [];
    for (var i = 0; i < arr.length; i++) { var it = mapOldCard(arr[i], tabType); if (it) out.push(it); }
    return out;
}
function fetchTab(key, year, genre, sortV, page) {
    var p = rexParams(key);
    var tags = p.base.slice();
    if (genre) tags.push(genre);
    if (year) tags.push(year);
    var r = fetchRex(p.kind, tags, sortV, page, key || '动漫');
    if (r.length) return r;
    if (year || genre) return r;
    // 带筛选时第 N 页翻尽也会返空——只有第 1 页空才算接口挂了，翻页空就如实返回「没有更多」
    if (page > 1) return r;
    log('[douban] rexxar 空，回退老接口(筛选降级)');
    var o = oldParams(key);
    return fetchOld(o.type, o.tag, sortV, page, key || '动漫');
}
function genreOpts() {
    var out = [{ n: '全部', v: '' }];
    for (var i = 0; i < GENRES.length; i++) out.push({ n: GENRES[i], v: GENRES[i] });
    return out;
}
function yearOpts() {
    // 逐年近 8 年 + 年代段（explore 年代标签体系）
    var out = [{ n: '全部', v: '' }];
    var y = (new Date()).getFullYear();
    for (var i = 0; i < 8; i++) out.push({ n: String(y - i), v: String(y - i) });
    out.push({ n: '2010年代', v: '2010年代' });
    out.push({ n: '2000年代', v: '2000年代' });
    out.push({ n: '90年代', v: '90年代' });
    out.push({ n: '80年代', v: '80年代' });
    return out;
}
function sortOpts() {
    return [{ n: '热度', v: 'hot' }, { n: '最新', v: 'new' }, { n: '评分', v: 'score' }];
}
function commonFilters() {
    // name 全部留空 = 不渲染「题材/年代/排序」前缀文字（用户 2026-08-13 要求），胶囊直接从行首排
    return [
        { key: 'genre', name: '', value: genreOpts() },
        { key: 'year', name: '', value: yearOpts() },
        { key: 'sort', name: '', value: sortOpts() },
    ];
}
function categories() {
    return JSON.stringify([
        { key: '', title: '推荐' },
        { key: '动漫', title: '全部动漫', filters: commonFilters() },
        { key: TAB_JP, title: '日本动画', filters: commonFilters() },
        { key: TAB_CN, title: '国产动画', filters: commonFilters() },
        { key: TAB_MV, title: '动画电影', filters: commonFilters() },
    ]);
}
function homeSections() {
    var out = [];
    var hot = fetchTab('', '', '', 'hot', 1).slice(0, 12);
    if (hot.length) out.push({ title: '热门动漫', key: '', items: hot });
    var jp = fetchTab(TAB_JP, '', '', 'hot', 1).slice(0, 12);
    if (jp.length) out.push({ title: '日本动画', key: TAB_JP, items: jp });
    var mv = fetchTab(TAB_MV, '', '', 'hot', 1).slice(0, 12);
    if (mv.length) out.push({ title: '动画电影', key: TAB_MV, items: mv });
    var cn = fetchTab(TAB_CN, '', '', 'hot', 1).slice(0, 12);
    if (cn.length) out.push({ title: '国产动画', key: TAB_CN, items: cn });
    return JSON.stringify(out);
}
function search(keyword, page) {
    page = page || 1;
    var key = trim(keyword);
    if (key === '' || key === TAB_JP || key === TAB_CN || key === TAB_MV) {
        return JSON.stringify(fetchTab(key, '', '', 'hot', page));
    }
    // 真实关键词：老接口按片名尽力搜（browseOnly 点卡跳 App 搜索，这条很少走）
    var url = OLD_API + '?type=movie&tag=' + encodeUri(key) +
        '&sort=recommend&page_limit=' + PAGE + '&page_start=' + ((page - 1) * PAGE);
    var j = parseJson(request(url, reqOpt())) || {};
    var arr = j.subjects || [];
    var out = [];
    for (var i = 0; i < arr.length; i++) { var it = mapOldCard(arr[i], '动漫'); if (it) out.push(it); }
    return JSON.stringify(out);
}
function searchFiltered(category, filtersJson, page) {
    var f = parseJson(filtersJson) || {};
    return JSON.stringify(fetchTab(trim(category), trim(f.year), trim(f.genre), trim(f.sort) || 'hot', page || 1));
}
function detail(id) {
    return JSON.stringify({ id: id, name: '', pic: '', desc: '', type: '', remarks: '', year: '', episodes: [] });
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
