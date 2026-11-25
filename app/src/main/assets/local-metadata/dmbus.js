// Metadata-only adapter. Playback remains in the authenticated server core.
globalThis.__niviiDetailRelatedVersion=1;
(function(){
var __auv_console = (typeof console !== 'undefined') ? console : { log: function(){}, error: function(){}, warn: function(){} };
var __auv_crypto = globalThis.CryptoJS || {};
var __auv_http_req = (typeof auvHttp === 'function' ? auvHttp : (globalThis.req || globalThis._http));
var UA = globalThis.UA || {
    chrome: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    iphone: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
    okhttp: 'okhttp/4.12.0',
    android: 'Mozilla/5.0 (Linux; Android 11) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
};
function log(message) { try { __auv_console.log(String(message)); } catch (e) {} }
function encodeUri(value) { return encodeURIComponent(value == null ? '' : String(value)); }
function base64Encode(value) { try { return __auv_crypto.enc.Base64.stringify(__auv_crypto.enc.Utf8.parse(value == null ? '' : String(value))); } catch (e) { return ''; } }
function base64Decode(value) { try { return __auv_crypto.enc.Base64.parse(value == null ? '' : String(value)).toString(__auv_crypto.enc.Utf8); } catch (e) { return ''; } }
function parseJson(value, fallback) { if (value == null || value === '') return fallback == null ? null : fallback; if (typeof value !== 'string') return value; try { return JSON.parse(value); } catch (e) { return fallback == null ? null : fallback; } }
function match(text, regex, group) { var m = String(text || '').match(new RegExp(regex)); return m ? (m[group || 0] || '') : ''; }
function matchAll(text, regex) { var out = [], re = new RegExp(regex, 'g'), m; text = String(text || ''); while ((m = re.exec(text)) !== null) out.push(Array.prototype.slice.call(m)); return JSON.stringify(out); }
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
var EXT     = (typeof ext !== 'undefined' && ext) ? ext : {};
var SITE    = (EXT.site || 'https://dmbus.cc').replace(/\/+$/, '');
var UA_M    = (typeof UA !== 'undefined' && UA.iphone) ? UA.iphone
            : 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1';
var TIMEOUT = 15000;
var TYPES = [
    { id: '1', name: '国漫' },
    { id: '2', name: '日漫' },
    { id: '3', name: '欧美' },
    { id: '4', name: '电影' }
];
var CLASS_OPTS = {
    '1': ['玄幻', '穿越', '动态漫画', '热血', '搞笑', '恋爱', '奇幻', '武侠', '战斗', '悬疑', '日常', '格斗'],
    '2': ['冒险', '奇幻', '战斗', '后宫', '热血', '励志', '搞笑', '校园', '机战', '悬疑', '治愈', '百合', '恐怖', '泡面番', '恋爱', '推理']
};
function trim(s) { return s == null ? '' : String(s).replace(/^\s+|\s+$/g, ''); }
function decodeEntities(s) {
    if (!s) return '';
    return String(s)
        .replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&')
        .replace(/&lt;/gi, '<').replace(/&gt;/gi, '>')
        .replace(/&quot;/gi, '"').replace(/&#0?39;/g, "'").replace(/&apos;/gi, "'")
        .replace(/&#x([0-9a-fA-F]+);/g, function (m, h) { try { return String.fromCharCode(parseInt(h, 16)); } catch (e) { return m; } })
        .replace(/&#(\d+);/g, function (m, d) { try { return String.fromCharCode(parseInt(d, 10)); } catch (e) { return m; } });
}
function stripTags(s) { return s ? String(s).replace(/<[^>]+>/g, '') : ''; }
function yearOpts() {
    var out = [{ n: '全部', v: '' }];
    var y = (new Date()).getFullYear();
    for (var i = 0; i < 12; i++) out.push({ n: String(y - i), v: String(y - i) });
    return out;
}
function req(url, referer) {
    try {
        return request(url, JSON.stringify({
            headers: {
                'User-Agent': UA_M,
                'Referer': referer || (SITE + '/'),
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            },
            timeout: TIMEOUT
        })) || '';
    } catch (e) { log('[dmbus] req err ' + url + ' :: ' + e); return ''; }
}
function reqPath(path, referer) { return req(SITE + path, referer); }
function parseList(html) {
    var out = [];
    if (!html) return out;
    var arr = parseJson(matchAll(html,
        '<a href="/v/(\\d+)\\.html" class="cover lazy" data-bg="([^"]*)"[^>]*>[\\s\\S]*?<a class="title" href="/v/\\d+\\.html" title="([^"]*)">[\\s\\S]*?<span class="desc">([^<]*)</span>'
    )) || [];
    for (var i = 0; i < arr.length; i++) {
        var m = arr[i];          // [整体, id, pic, name, remark]
        var name = trim(decodeEntities(m[3]));
        if (!name) continue;
        out.push({
            id:      m[1],
            name:    name,
            pic:     trim(m[2]),
            type:    '',
            year:    '',
            remarks: trim(decodeEntities(m[4])),
            desc:    ''
        });
    }
    return out;
}
function dedup(list) {
    var seen = {}, out = [];
    for (var i = 0; i < list.length; i++) {
        var id = list[i].id;
        if (!id || seen[id]) continue;
        seen[id] = 1; out.push(list[i]);
    }
    return out;
}
function categories() {
    var ys = yearOpts();
    var sorts = [{ n: '最新', v: 'time' }, { n: '最热', v: 'hits' }, { n: '评分', v: 'score' }];
    var out = [{ key: '', title: '推荐' }];
    for (var i = 0; i < TYPES.length; i++) {
        var t = TYPES[i];
        var filters = [{ key: 'sort', name: '排序', value: sorts }];
        if (CLASS_OPTS[t.id]) {
            var cv = [{ n: '全部', v: '' }];
            var cs = CLASS_OPTS[t.id];
            for (var j = 0; j < cs.length; j++) cv.push({ n: cs[j], v: cs[j] });
            filters.push({ key: 'class', name: '类型', value: cv });
        }
        filters.push({ key: 'year', name: '年份', value: ys });
        out.push({ key: t.id, title: t.name, filters: filters });
    }
    return JSON.stringify(out);
}
function homeSections() {
    var html = reqPath('/');
    var out = [];
    if (html) {
        // 每个分区 card 里有一个 a.c_title 标题 + 紧随的 ul.v_list
        var chunks = html.split('class="c_title"');
        for (var i = 1; i < chunks.length; i++) {
            var c = chunks[i];
            var title = trim(match(c, '^[^>]*>([^<]+)</a>', 1));
            if (!title) continue;                               // 「热门动漫类型」用 </h3> 收尾，跳过
            var listHtml = match(c, '<ul class="v_list[^"]*">([\\s\\S]*?)</ul>', 1);
            if (!listHtml) continue;
            var items = parseList(listHtml);
            if (items.length) out.push({ title: title, key: '', items: items.slice(0, 12) });
        }
    }
    return JSON.stringify(out);
}
function search(keyword, page) {
    page = page || 1;
    var key = trim(keyword || '');
    // 首页推荐：聚合首页所有分区条目
    if (!key) return JSON.stringify(dedup(parseList(reqPath('/'))));
    // 分类 tab：list-{id}
    if (/^[1-4]$/.test(key)) {
        var lu = SITE + (page > 1 ? '/list-' + key + '-' + page + '.html' : '/list-' + key + '.html');
        return JSON.stringify(parseList(req(lu)));
    }
    // 关键词搜索
    var su = SITE + '/s----------.html?wd=' + encodeUri(key) + (page > 1 ? ('&page=' + page) : '');
    return JSON.stringify(parseList(req(su)));
}
function searchFiltered(category, filtersJson, page) {
    var f = parseJson(filtersJson) || {};
    var type = (category && /^[1-4]$/.test(category)) ? category : '1';
    var sort = f.sort || '';
    var cls  = f['class'] ? encodeUri(f['class']) : '';
    var year = (f.year && f.year !== '全部') ? f.year : '';
    page = page || 1;
    // 无任何筛选时退化成普通分类列表（翻页更稳）
    if (!sort && !cls && !year) return search(type, page);
    // /show-{type}-{}-{sort}-{class}-{}-{year}-{page}.html
    var fields = [type, '', sort, cls, '', year, (page > 1 ? String(page) : '')];
    var url = SITE + '/show-' + fields.join('-') + '.html';
    return JSON.stringify(parseList(req(url)));
}
function detail(id) {
    var out = { id: id, name: '', pic: '', type: '', year: '', remarks: '', desc: '', episodes: [] };
    var html = reqPath('/v/' + id + '.html');
    if (!html) return JSON.stringify(out);

    out.name = trim(decodeEntities(
        match(html, '<h1 class="v_title"><a[^>]*>([^<]+)</a>', 1) ||
        match(html, 'og:title" content="《([^》]+)》', 1) || ''
    ));
    out.pic     = trim(match(html, 'og:image"\\s*content="([^"]+)"', 1) || match(html, '<div class="cover"><img src="([^"]+)"', 1) || '');
    out.year    = trim(match(html, 'og:video:release_date" content="([^"]+)"', 1) || '');
    out.remarks = trim(decodeEntities(match(html, 'class="v_desc"><span class="desc">([^<]*)<', 1) || ''));
    out.type    = trim((match(html, 'og:video:class" content="([^"]*)"', 1) || '').split(',').slice(0, 2).join(' '));
    out.desc    = trim(decodeEntities(stripTags(
        match(html, '<div id="intro"><p>([\\s\\S]*?)</p>', 1) ||
        match(html, 'og:description" content="([^"]*)"', 1) || ''
    )));

    // 线路名（tab_control play_from 里的若干 li）
    var ctrl = match(html, '<ul class="tab_control play_from">([\\s\\S]*?)</ul>', 1) || '';
    var lineNames = [];
    var ln = parseJson(matchAll(ctrl, '<li[^>]*>([^<]+)</li>')) || [];
    for (var a = 0; a < ln.length; a++) lineNames.push(trim(ln[a][1]));

    // 选集：/p/{vod}-{line}-{ep}.html（按线路号分组，组内按集号升序）
    var eps = parseJson(matchAll(html, '<a href="/p/(\\d+)-(\\d+)-(\\d+)\\.html"[^>]*>([^<]+)</a>')) || [];
    var byLine = {}, order = [];
    for (var i = 0; i < eps.length; i++) {
        var vod = eps[i][1], lineNo = eps[i][2], ep = eps[i][3], label = trim(eps[i][4]);
        if (!byLine[lineNo]) { byLine[lineNo] = []; order.push(lineNo); }
        byLine[lineNo].push({ name: label || ep, url: '/p/' + vod + '-' + lineNo + '-' + ep + '.html', ep: parseInt(ep, 10) || 0 });
    }
    for (var k = 0; k < order.length; k++) {
        var lineNo2 = order[k];
        var list = byLine[lineNo2];
        list.sort(function (x, y) { return x.ep - y.ep; });
        var route = lineNames[k] || ('线路' + lineNo2);
        for (var j = 0; j < list.length; j++) {
            out.episodes.push({ name: list[j].name, url: list[j].url, route: route });
        }
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
globalThis.__niviiSource = {init: function(ext) { globalThis.ext = ext || {}; },
home: __auv_home,
homeVod: __auv_home_vod,
category: __auv_category,
detail: __auv_detail,
search: __auv_search};
})();
