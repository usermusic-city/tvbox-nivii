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
var __auv_console = (typeof console !== 'undefined') ? console : { log: function(){}, error: function(){}, warn: function(){} };
var __auv_crypto = globalThis.CryptoJS || {};
var __auv_http_req = (typeof auvHttp === 'function' ? auvHttp : (globalThis.req || globalThis._http));
var timestamp = Math.floor(Date.now() / 1000);
function log(message) { try { __auv_console.log(String(message)); } catch (e) {} }
function encodeUri(value) { return encodeURIComponent(value == null ? '' : String(value)); }
function base64Encode(value) { try { return __auv_crypto.enc.Base64.stringify(__auv_crypto.enc.Utf8.parse(value == null ? '' : String(value))); } catch (e) { return ''; } }
function base64Decode(value) { try { return __auv_crypto.enc.Base64.parse(value == null ? '' : String(value)).toString(__auv_crypto.enc.Utf8); } catch (e) { return ''; } }
function md5(value) { value = value == null ? '' : String(value); try { if (typeof md5X === 'function') return md5X(value); } catch (e) {} try { return __auv_crypto.MD5(value).toString(); } catch (e2) { return ''; } }
function parseJson(value, fallback) { if (value == null || value === '') return fallback == null ? null : fallback; if (typeof value !== 'string') return value; try { return JSON.parse(value); } catch (e) { return fallback == null ? null : fallback; } }
function match(text, regex, group) { var m = String(text || '').match(new RegExp(regex)); return m ? (m[group || 0] || '') : ''; }
function matchAll(text, regex) { var out = [], re = new RegExp(regex, 'g'), m; text = String(text || ''); while ((m = re.exec(text)) !== null) out.push(Array.prototype.slice.call(m)); return JSON.stringify(out); }
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
var SITE = (function () {
    var s = (typeof ext !== 'undefined' && ext && ext.site) ? String(ext.site) : 'https://www.lmm85.com';
    return s.replace(/\/+$/, '');
})();
var REQ_OPTS = JSON.stringify({
    ua: 'chrome',
    timeout: 15000,
    headers: { 'Referer': SITE + '/' }
});
var SMART_SALT  = (typeof ext !== 'undefined' && ext && ext.smartSalt) ? String(ext.smartSalt) : 'Lmm2026@VipS3cr3t!Kx9PqZ';
var VERIFY_PATH = '/index.php/ajax/smart_verify';
var TYPE_MAP = {
    '番剧':       'type/dongman',
    '日本动漫':   'type/ribendongman',
    '国产动漫':   'type/guochandongman',
    '欧美动漫':   'type/oumeidongman',
    '动态漫画':   'type/dongtaiman',
    '动画电影':   'type/dianying',
    '日本特摄剧': 'type/teshepian',
    '最近更新':   'label/new',
    '热门':       'label/hot'
};
function trim(s) { return s == null ? '' : String(s).replace(/^\s+|\s+$/g, ''); }
function decodeEntities(s) {
    if (!s) return '';
    return s.replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#0?39;/g, "'")
            .replace(/&apos;/g, "'")
            .replace(/&nbsp;/g, ' ');
}
function stripTags(s) {
    if (!s) return '';
    return s.replace(/<[^>]+>/g, '');
}
function isBlocked(html) {
    if (!html) return false;
    if (html.indexOf('_cf_chl_opt') >= 0) return true;
    if (html.indexOf('Just a moment') >= 0) return true;
    if (html.indexOf('challenge-platform') >= 0) return true;
    if (html.indexOf('身份验证') >= 0 && html.indexOf('请稍候') >= 0) return true;
    // smart_token 验证页特征：标题"身份验证" + 体积极小
    if (html.indexOf('<title>身份验证') >= 0) return true;
    return false;
}
function fetchHtml(url) {
    var html = request(url, REQ_OPTS);
    if (!html) { log('[lmm85] empty body: ' + url); return ''; }
    if (isBlocked(html)) { log('[lmm85] blocked: ' + url); return ''; }
    return html;
}
function pagedUrl(path, page) {
    page = page || 1;
    if (path.indexOf('label/') === 0) {
        return SITE + '/' + path + (page > 1 ? '/page/' + page : '') + '.html';
    }
    return SITE + '/' + path + (page > 1 ? '_' + page : '') + '.html';
}
function parseCards(html, typeName) {
    var out = [];
    if (!html) return out;
    var chunks = html.split('img-box cover-md');
    for (var i = 1; i < chunks.length; i++) {
        var c = chunks[i];
        var id = match(c, '/detail/(\\d+)\\.html', 1);
        if (!id) continue;
        var pic = match(c, 'data-src="([^"]+)"', 1) || match(c, '<img[^>]+src="([^"]+)"', 1) || '';
        var remark = match(c, '<span class="label">([^<]*)</span>', 1) || '';
        var name = match(c, '<h6 class="title">\\s*<a[^>]*>([^<]+)</a>', 1) || '';
        name = decodeEntities(trim(name));
        if (!name) continue;
        out.push({
            id: id,
            name: name,
            pic: pic,
            type: typeName || '',
            year: '',
            remarks: trim(decodeEntities(remark)),
            desc: ''
        });
    }
    return out;
}
function listFromPath(path, page, typeName) {
    var html = fetchHtml(pagedUrl(path, page));
    return parseCards(html, typeName);
}
function typeNameFor(key) {
    var path = TYPE_MAP[key] || '';
    return path.indexOf('type/') === 0 ? key : '';
}
function homeSections() {
    var defs = [
        { title: '最近更新', key: '最近更新', path: 'label/new',            type: '' },
        { title: '热门影片', key: '热门',     path: 'label/hot',            type: '' },
        { title: '日本动漫', key: '日本动漫', path: 'type/ribendongman',    type: '日本动漫' },
        { title: '国产动漫', key: '国产动漫', path: 'type/guochandongman',  type: '国产动漫' },
        { title: '欧美动漫', key: '欧美动漫', path: 'type/oumeidongman',    type: '欧美动漫' },
        { title: '动画电影', key: '动画电影', path: 'type/dianying',        type: '动画电影' }
    ];
    var out = [];
    for (var i = 0; i < defs.length; i++) {
        var d = defs[i];
        var items = listFromPath(d.path, 1, d.type);
        if (items.length) out.push({ title: d.title, key: d.key, items: items.slice(0, 12) });
    }
    return JSON.stringify(out);
}
function categories() {
    return JSON.stringify([
        { key: '',         title: '推荐' },
        { key: '最近更新', title: '最近更新' },
        { key: '日本动漫', title: '日本动漫' },
        { key: '国产动漫', title: '国产动漫' },
        { key: '欧美动漫', title: '欧美动漫' },
        { key: '动态漫画', title: '动态漫画' },
        { key: '动画电影', title: '动画电影' },
        { key: '热门',     title: '热门' }
    ]);
}
function search(keyword, page) {
    page = page || 1;
    var key = trim(keyword || '');

    // 空关键词 = 推荐，用"最近更新"作为默认片库
    if (!key) return JSON.stringify(listFromPath('label/new', page, ''));

    // 命中内置分类 → 直接抓对应分类页
    if (TYPE_MAP[key]) {
        return JSON.stringify(listFromPath(TYPE_MAP[key], page, typeNameFor(key)));
    }

    // 真实关键词：先走服务端搜索（自动过 smart_token），不可用再退化客户端搜索
    var arr = searchServer(key, page);
    if (arr !== null) return JSON.stringify(arr);
    return JSON.stringify(clientSearch(key, page));
}
function solveSmartVerify(key) {
    try {
        var ts = Math.floor(timestamp() / 1000);
        var token = md5(ts + SMART_SALT);
        var resp = post(SITE + VERIFY_PATH, 'smart_token=' + token + '&ts=' + ts, JSON.stringify({
            ua: 'chrome',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': SITE + '/vod/search.html?wd=' + encodeUri(key || '')
            }
        }));
        log('[lmm85] smart_verify: ' + resp);
        if (resp && resp.indexOf('"code":1') >= 0) return true;
    } catch (e) { log('[lmm85] smart_verify err: ' + e); }
    return false;
}
function searchServer(key, page) {
    page = page || 1;
    var url = SITE + '/vod/search/page/' + page + '/wd/' + encodeUri(key) + '.html';
    var html = request(url, REQ_OPTS);
    if (html && isBlocked(html)) {
        if (solveSmartVerify(key)) html = request(url, REQ_OPTS);
    }
    if (!html || isBlocked(html)) return null;
    return parseCards(html, '');
}
function clientSearch(key, page) {
    if (page && page > 1) return [];          // 结果一次性返回，避免无限翻页
    var plan = [
        { path: 'label/new', pages: 3 },
        { path: 'type/dongman', pages: 2 },
        { path: 'type/dianying', pages: 1 }
    ];
    var seen = {}, out = [];
    for (var p = 0; p < plan.length; p++) {
        for (var pg = 1; pg <= plan[p].pages; pg++) {
            var items = listFromPath(plan[p].path, pg, '');
            if (!items.length) break;
            for (var i = 0; i < items.length; i++) {
                var it = items[i];
                if (seen[it.id]) continue;
                if (it.name && it.name.indexOf(key) >= 0) { seen[it.id] = 1; out.push(it); }
            }
        }
    }
    return out;
}
function sourceLink(href, base) {
    try {
        var url = new URL(decodeEntities(href), base || SITE + '/');
        if (url.origin !== new URL(SITE).origin || !/^https?:$/.test(url.protocol)) return '';
        return url.href;
    } catch (_) { return ''; }
}
function sourceFilterRows(html, pageUrl) {
    var chunks = html.split(/<(?:div|dl|ul)\b[^>]*class=["'][^"']*(?:module-class-item|stui-screen__list|filter-row|screen-list)[^"']*["'][^>]*>/i);
    var rows = [];
    for (var i = 1; i < chunks.length; i++) {
        var row = chunks[i];
        var title = match(row, '<(?:div|span|dt)[^>]*class=["\'][^"\']*(?:module-class-title|module-class-name|filter-title)[^"\']*["\'][^>]*>([\\s\\S]*?)</', 1)
            || match(row, '<dt[^>]*>([\\s\\S]*?)</dt>', 1);
        title = trim(stripTags(decodeEntities(title || ''))).replace(/[：:]$/, '');
        if (!title) continue;
        var options = [], seen = {}, anchors = /<a\b([^>]*)>([\s\S]*?)<\/a>/ig, anchor;
        while ((anchor = anchors.exec(row))) {
            var selected = /\b(?:selected|active|current)\b/i.test(anchor[1]);
            var href = match(anchor[1], 'href=["\']([^"\']*)["\']', 1) || '';
            var url = selected ? pageUrl : sourceLink(href, pageUrl);
            var name = trim(stripTags(decodeEntities(anchor[2])));
            if (!url || !name || /\/(?:detail|play|search)\//i.test(url) || seen[url]) continue;
            seen[url] = true;
            options.push({ n: name, v: url });
        }
        if (options.length > 1) rows.push({ key: '__route', name: title, init: pageUrl, value: options });
    }
    return rows;
}
function browseCategory(category, filters, page) {
    var key = trim(category), path = TYPE_MAP[key] || (!key ? 'label/new' : '');
    if (!path) throw new Error('来源分类不存在，请刷新来源后重试');
    var route = filters && filters.__route ? sourceLink(filters.__route) : '';
    var url = route || pagedUrl(path, page), html;
    if (route && Number(page) > 1) {
        html = fetchHtml(route);
        var links = /<a\b([^>]*)>\s*(\d+)\s*<\/a>/ig, link, target = '';
        while ((link = links.exec(html))) {
            if (Number(link[2]) === Number(page)) {
                target = sourceLink(match(link[1], 'href=["\']([^"\']*)["\']', 1) || '', route);
                if (target) break;
            }
        }
        if (!target) return { items: [], filters: [], pagecount: Number(page) - 1 };
        url = target;
    }
    html = fetchHtml(url);
    if (!html) throw new Error('来源页面暂时无法访问，请稍后重试');
    return { items: parseCards(html, typeNameFor(key)), filters: sourceFilterRows(html, url),
        pagecount: /下一页|class=["'][^"']*next\b/i.test(html) ? 0 : Number(page || 1) };
}
function searchFiltered(category, filtersJson, page) {
    return JSON.stringify(browseCategory(category, parseJson(filtersJson) || {}, page || 1).items);
}
function detail(id) {
    var url = SITE + '/detail/' + id + '.html';
    var html = fetchHtml(url);
    if (!html) {
        return JSON.stringify({ id: id, name: '', pic: '', desc: '', episodes: [] });
    }

    var name = decodeEntities(trim(match(html, '<h1 class="page-title">([^<]+)</h1>', 1)));
    var pic  = match(html, '<img class="url_img"[^>]*src="([^"]+)"', 1) || '';
    var typeName = decodeEntities(trim(match(html, '/type/[a-z0-9]+\\.html"\\s*title="([^"]+)"', 1)));
    var year = match(html, '/year/(\\d{4})\\.html', 1) || '';
    var remarks = decodeEntities(trim(match(html,
        '集数：</span>\\s*<div class="video-info-item">([^<]+)</div>', 1)));
    var desc = trim(stripTags(decodeEntities(match(html,
        '<div class="video-info-item video-info-content">([\\s\\S]*?)</div>', 1) || '')));

    // 线路名（聚合线路 / box聚合 …）
    var tabNames = [];
    var rawTabs = parseJson(matchAll(html, 'data-dropdown-value="([^"]+)"')) || [];
    for (var t = 0; t < rawTabs.length; t++) tabNames.push(decodeEntities(trim(rawTabs[t][1])));

    // 所有选集链接：/play/{id}_{sid}_{nid}.html  →  [whole, id, sid, nid, epName]
    var episodes = [];
    var rawEps = parseJson(matchAll(html,
        '/play/(\\d+)_(\\d+)_(\\d+)\\.html"[^>]*>\\s*<span>([^<]+)</span>')) || [];
    for (var e = 0; e < rawEps.length; e++) {
        var m = rawEps[e];
        var sid = m[2];
        var routeName = tabNames[parseInt(sid, 10) - 1] || ('线路' + sid);
        episodes.push({
            name: decodeEntities(trim(m[4])),
            url: m[1] + '_' + m[2] + '_' + m[3],   // 传给 play() 的 flag
            route: routeName
        });
    }

    return JSON.stringify({
        id: id,
        name: name,
        pic: pic,
        type: typeName,
        year: year,
        remarks: remarks,
        desc: desc,
        related: parseCards(html, '').filter(function(x){return x.id !== String(id);}), episodes: episodes
    });
}
function related(id) {
    var html = fetchHtml(SITE + '/detail/' + id + '.html');
    var arr = parseCards(html, '');
    var out = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].id !== String(id)) out.push(arr[i]);
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
    var data = browseCategory(tid, extend || {}, pg || 1), filters = {};
    if (data.filters.length) filters[tid] = data.filters;
    return JSON.stringify({ list: __auv_list(data.items), filters: filters, page: parseInt(pg || 1), pagecount: data.pagecount });
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
function __auv_related(id) { return JSON.stringify({list: __auv_list(related(id))}); }
globalThis.__niviiSource = {related: __auv_related,
init: function(ext) { globalThis.ext = ext || {}; },
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
