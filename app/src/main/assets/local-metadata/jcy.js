// Metadata-only adapter. Playback remains in the authenticated server core.
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
function decrypt(value) { return base64Decode(value); }
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
'use strict';
var JIONG_DEFAULT_HOST = 'http://43.145.33.254:27990';
var JIONG_API_PREFIX = '';
var JIONG_APPID = '4150439554430529';
var JIONG_APP_VERSION = '2020-09-17';
var JIONG_CLIENT_VERSION = '1.5.8.0';
var JIONG_CRYPTO_BRIDGE = '';
var JIONG_CRYPTO_BRIDGE_FALLBACKS = [];
var JIONG_ACTIVE_BRIDGE = '';
var JIONG_CATEGORY_CACHE = null;
var JIONG_STANDARD_B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
var JIONG_CUSTOM_B64 = '5iW7S0GX6uf1cv3ny4q8es2Q+bdkYgKOIT/tzhAxUrFlVPmow9BHCZNMDpEaJRLj';
var JIONG_AUTH_KEY = 'ziISjqkXPsGUMRNGyWigxDGtJbfTdcGv';
var JIONG_AUTH_IV = 'WonrnVkxeIxDcFbv';
var JIONG_DEVICE_ID = '9775736994f64a3aa18befd509bf546c';
var JIONG_REQUEST_PUBLIC_KEY = '-----BEGIN PUBLIC KEY-----\n' +
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1eiQTbqff456g/MlFTOi\n' +
    'cxAsw5kMac3ZGmjm+xCCggkuITKHx0Ae3B9EdoKDrYfZXSrC2Llty89RRGasZ36S\n' +
    'zlZem+s8c4A/OIcXzbbGteCIk/ItlPMZZzZlVnIWC1OtLFuisadzbZjOLpxmAl+C\n' +
    'cgUP2gcsaY8gQvXnkzJch8LoIcR+9orCW8zamPJOwoFq/sTDq0xP+TvUtGt2pijp\n' +
    'ed0uv6fAE6rOqZoRjheFAEJMLQyNeZxeQfN7OqFnJGNq1MhwIwZ2BP78TEf+zqsh\n' +
    'YdZPkXIlzISzoEi8P+HCtTc1veC9pJrDh0s7HoWmAFE8tFTj65gLWNS+0PvcLCOW\n' +
    'DQIDAQAB\n-----END PUBLIC KEY-----';
var JIONG_RESPONSE_PRIVATE_KEY = '-----BEGIN RSA PRIVATE KEY-----\n' +
    'MIIEowIBAAKCAQEAxm2Kzu9L/FNX42em9Xo73JXtJCtrhleKN9jqclpK6/Iyah/T\n' +
    'UjH5RCNItWiTKHg6LcsGxZs9+4fP6uU8oO5Qp1akaOrJTg3QTQQFyRxDrv+LN/nL\n' +
    '6/MpSf3SnihyVPQWwlkj3yHZWrVC9HI3q2JmzGV/kzwnpVIj2as8zl4cO7OZr0F9\n' +
    'bR+G4jblqLPmB/x/BBOGrWWCxn+YI2RVHw23dev9jql284eN/KV4tlDlbtoJGy4+\n' +
    'Cb7nEV/THvRVZYbHAp+fMY0+NyqyslLX/btJqT8eSH6Hb8c+BSC77Dry4G8/m/wU\n' +
    'YPdvXiL3cVhZmEaqjs8rUafGyQmW3mrflAbIJwIDAQABAoIBAQCbRhUdIbzAUyev\n' +
    'V+kapvA5CUlsyF133wDV+vRbT7TZNcmlqgnfhCOe4k1/R7oALTS5qOo/r9+s+PYG\n' +
    'xiPPey26BN7bCv9ECSM7YS511ZxRUL9MqjidBscEk49BHD17pRY6Ny8O6JoBlV4z\n' +
    'kz1k67etsq9GNAiCIejT6F/IzXQicmO5MaJWCjBNSP+IPTvd5NW3DUNlt2NcCBvO\n' +
    '2sCgSq2Z4B0IdNWeSvd4ZmA2qSkqk60A8glNR4HdRTG9VWR0fUOd/qzpN1vjBUKM\n' +
    'aIHeUX50NCRdK8EGqrVOCq4uUgBRj7bjt0DOb9ck4vYxgBdkyK4HMYsAGdirYKxd\n' +
    'DkseicqhAoGBAOZ750Vky38kq3MucAE/uaFpaDUSeOKDy03fumM6TLlkeAxnTQZW\n' +
    'NBDzlrqNgQPMLu+tmm+ZsEN5buF8C2oKc97+Rz21rvrOufr4sX2PqHfj/kerYGq/\n' +
    'NzX1jpRbqsmcs+3JxveeozHuXBbOFpd8teCGZPFPHREFDe4sZFtFmwX1AoGBANxl\n' +
    'JNlKIz0TVmPgGCUZ4j8BRBiLPHMeFkUoam6Djou2iJLYey3ZNHhyMiRER7Smia0f\n' +
    'Y/QjqJIeSRWQlZExu6s9ijl4VSmoh4hLanOxxAE+gFnuhgK4XwMV0hvHbqSaupQd\n' +
    'fkULZ+t3rGKzt+t+0ob7xx+LjYWEwpLsKCQKRKgrAoGADLPvfyea/5rpyCNbEPaO\n' +
    'KJNCpwopl3JkFhqqjyV7bQxYgXaADEVcAUMrn4SFA8yRGaybwmLaEB31OoA3sNR6\n' +
    'pmOlUYVd63zRSz/BqIXuZw0tyo1rdvaq+FJcVVjoBMyaLhTc3nDj1bCpaqhZHmhF\n' +
    'Lea6UYJmu7VnmyTfMxiW/rECgYAh4MJLTGQiTUioTZgoi9QFT1KCW1TNdUCDHPVP\n' +
    'S5Wr0EEqIXC92XeBVDx06rIDCN586ChbLOgKnfEqCXGUQgrRBcKrlt2wa6F5x+3z\n' +
    'Hs48Srk8Gbgrzt97/+yuLHfLgaVQg0AXqOsufNTYzztkTbha23T+WltEvOWT5A0/\n' +
    'jPyExQKBgCGbq62piyIEeMNoP/SoLvh4hTq/eeNw5yCcLEsLrgt45Xb/2YgeyXWv\n' +
    'xTXl4c8bPdZTFYQ9A7IUYvhizpH032tDouqCsvgu3KtDO/pW6IteL17YBco7fRMQ\n' +
    'JhBuQjGDCMEGEJW76GwlXj/xUW32TN/5KeQXtHHZ4z2lZlJLU81B\n' +
    '-----END RSA PRIVATE KEY-----';
function jiongExt() {
    return (typeof ext !== 'undefined' && ext) || {};
}
function jiongString(value, fallback) {
    if (value == null) return fallback == null ? '' : String(fallback);
    return String(value);
}
function jiongMetaString(value) {
    if (value == null) return '';
    if (Array.isArray(value)) {
        var out = [];
        for (var i = 0; i < value.length; i++) {
            var part = jiongMetaString(value[i]);
            if (part && out.indexOf(part) < 0) out.push(part);
        }
        return out.join(' / ');
    }
    if (typeof value === 'object') {
        return jiongMetaString(value.name != null ? value.name :
            (value.title != null ? value.title :
            (value.label != null ? value.label : value.value)));
    }
    return String(value).replace(/^\s+|\s+$/g, '');
}
function jiongFirstMeta(item, keys) {
    item = item || {};
    for (var i = 0; i < keys.length; i++) {
        var value = jiongMetaString(item[keys[i]]);
        if (value) return value;
    }
    return '';
}
function jiongRemarks(item) {
    var value = jiongFirstMeta(item, [
        'continu', 'remarks', 'remark', 'vod_remarks', 'serial_desc',
        'update', 'update_text', 'update_at', 'state'
    ]);
    if (!value && item && item.total != null && Number(item.total) > 0) {
        value = '共' + item.total + '集';
    }
    return value;
}
function jiongNumber(value, fallback) {
    var n = Number(value);
    return isFinite(n) ? n : (fallback == null ? 0 : Number(fallback));
}
function jiongJson(value, fallback) {
    if (value == null) return fallback == null ? null : fallback;
    if (typeof value === 'object') return value;
    try { return JSON.parse(String(value)); } catch (_) {}
    try {
        if (typeof parseJson === 'function') return parseJson(String(value));
    } catch (_) {}
    return fallback == null ? null : fallback;
}
function jiongEncode(value) {
    value = jiongString(value, '');
    try {
        if (typeof encodeUri === 'function') return encodeUri(value);
    } catch (_) {}
    return encodeURIComponent(value);
}
function jiongNonce() {
    var e = jiongExt();
    if (e.nonce != null && e.nonce !== '') return String(e.nonce);
    var seed = String(Math.floor(Math.random() * 100000000));
    while (seed.length < 8) seed = '0' + seed;
    return seed;
}
function jiongBase() {
    var e = jiongExt();
    var base = e.base || e.host || JIONG_DEFAULT_HOST;
    base = String(base).replace(/\/+$/, '');
    if (/\/api(?:\/v\d+)?$/i.test(base)) return base;
    var prefix = e.apiPrefix == null ? JIONG_API_PREFIX : String(e.apiPrefix);
    prefix = '/' + prefix.replace(/^\/+|\/+$/g, '');
    return base + (prefix === '/' ? '' : prefix);
}
function jiongPath(path) {
    path = '/' + jiongString(path, '').replace(/^\/+/, '');
    return jiongBase() + path;
}
function jiongMerge(dst, src) {
    if (!src) return dst;
    if (typeof src === 'string') src = jiongJson(src, {});
    if (!src || typeof src !== 'object') return dst;
    for (var k in src) if (Object.prototype.hasOwnProperty.call(src, k) && src[k] != null) dst[k] = src[k];
    return dst;
}
function jiongConfiguredHeaders() {
    var e = jiongExt();
    var h = {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json; charset=utf-8',
        'User-Agent': 'Dart/3.6 (dart:io)',
        'x-version': jiongString(e.version || JIONG_APP_VERSION),
        APPID: jiongString(e.appId || JIONG_APPID)
    };
    jiongMerge(h, e.headers);
    jiongMerge(h, e.apiHeaders);
    if (e.token != null && e.token !== '' && h['X-Token'] == null && h['x-token'] == null) {
        h['X-Token'] = String(e.token);
    }
    if (e.appId != null && e.appId !== '' && h.APPID == null) h.APPID = String(e.appId);
    return h;
}
function jiongOkCode(code) {
    var n = Number(code);
    return !isFinite(n) || n === 0 || n === 200 || n === 20000;
}
function jiongNowMillis() {
    var now;
    try { now = typeof timestamp === 'function' ? Number(timestamp()) : Date.now(); } catch (_) { now = Date.now(); }
    if (!isFinite(now) || now <= 0) now = Date.now();
    if (now < 100000000000) now *= 1000;
    return Math.floor(now);
}
function jiongUtf8Bytes(value) {
    value = jiongString(value, '');
    var out = [];
    for (var i = 0; i < value.length; i++) {
        var code = value.charCodeAt(i);
        if (code >= 0xD800 && code <= 0xDBFF && i + 1 < value.length) {
            var low = value.charCodeAt(i + 1);
            if (low >= 0xDC00 && low <= 0xDFFF) {
                code = 0x10000 + ((code - 0xD800) << 10) + (low - 0xDC00);
                i++;
            }
        }
        if (code < 0x80) out.push(code);
        else if (code < 0x800) out.push(0xC0 | (code >> 6), 0x80 | (code & 63));
        else if (code < 0x10000) out.push(0xE0 | (code >> 12), 0x80 | ((code >> 6) & 63), 0x80 | (code & 63));
        else out.push(0xF0 | (code >> 18), 0x80 | ((code >> 12) & 63), 0x80 | ((code >> 6) & 63), 0x80 | (code & 63));
    }
    return out;
}
function jiongUtf8String(bytes) {
    var out = '';
    for (var i = 0; i < bytes.length;) {
        var a = bytes[i++] & 255;
        var code;
        if (a < 0x80) code = a;
        else if ((a & 0xE0) === 0xC0 && i < bytes.length) code = ((a & 31) << 6) | (bytes[i++] & 63);
        else if ((a & 0xF0) === 0xE0 && i + 1 < bytes.length) code = ((a & 15) << 12) | ((bytes[i++] & 63) << 6) | (bytes[i++] & 63);
        else if ((a & 0xF8) === 0xF0 && i + 2 < bytes.length) {
            code = ((a & 7) << 18) | ((bytes[i++] & 63) << 12) | ((bytes[i++] & 63) << 6) | (bytes[i++] & 63);
        } else code = 0xFFFD;
        if (code <= 0xFFFF) out += String.fromCharCode(code);
        else {
            code -= 0x10000;
            out += String.fromCharCode(0xD800 | (code >> 10), 0xDC00 | (code & 1023));
        }
    }
    return out;
}
function jiongBytesToHex(bytes) {
    var out = '';
    for (var i = 0; i < bytes.length; i++) out += ('0' + ((bytes[i] & 255).toString(16))).slice(-2);
    return out;
}
function jiongHexToBytes(value) {
    value = jiongString(value, '').replace(/\s+/g, '');
    if (value.length % 2) throw new Error('invalid hex length');
    var out = [];
    for (var i = 0; i < value.length; i += 2) {
        var n = parseInt(value.slice(i, i + 2), 16);
        if (!isFinite(n)) throw new Error('invalid hex data');
        out.push(n);
    }
    return out;
}
function jiongBase64EncodeBytes(bytes, alphabet) {
    alphabet = alphabet || JIONG_STANDARD_B64;
    var out = '';
    for (var i = 0; i < bytes.length; i += 3) {
        var a = bytes[i] & 255;
        var haveB = i + 1 < bytes.length, haveC = i + 2 < bytes.length;
        var b = haveB ? bytes[i + 1] & 255 : 0;
        var c = haveC ? bytes[i + 2] & 255 : 0;
        out += alphabet[a >> 2];
        out += alphabet[((a & 3) << 4) | (b >> 4)];
        out += haveB ? alphabet[((b & 15) << 2) | (c >> 6)] : '=';
        out += haveC ? alphabet[c & 63] : '=';
    }
    return out;
}
function jiongBase64DecodeBytes(value, alphabet) {
    alphabet = alphabet || JIONG_STANDARD_B64;
    value = jiongString(value, '').replace(/\s+/g, '');
    if (!value || value.length % 4) throw new Error('invalid base64 length');
    var out = [];
    for (var i = 0; i < value.length; i += 4) {
        var c0 = alphabet.indexOf(value[i]), c1 = alphabet.indexOf(value[i + 1]);
        var c2 = value[i + 2] === '=' ? -1 : alphabet.indexOf(value[i + 2]);
        var c3 = value[i + 3] === '=' ? -1 : alphabet.indexOf(value[i + 3]);
        if (c0 < 0 || c1 < 0 || (c2 < 0 && value[i + 2] !== '=') || (c3 < 0 && value[i + 3] !== '=')) {
            throw new Error('invalid base64 character');
        }
        out.push((c0 << 2) | (c1 >> 4));
        if (c2 >= 0) out.push(((c1 & 15) << 4) | (c2 >> 2));
        if (c3 >= 0) out.push(((c2 & 3) << 6) | c3);
    }
    return out;
}
function jiongBase64Alphabet(value, from, to) {
    value = jiongString(value, '');
    var out = '';
    for (var i = 0; i < value.length; i++) {
        var index = from.indexOf(value[i]);
        out += index < 0 ? value[i] : to[index];
    }
    return out;
}
function jiongTransposeBlock(bytes, offset) {
    offset = offset || 0;
    var out = [];
    for (var row = 0; row < 4; row++) {
        for (var column = 0; column < 4; column++) out.push(bytes[offset + row + 4 * column] & 255);
    }
    return out;
}
function jiongAesRowMajor(data, key, iv, decrypt) {
    if (!data.length || data.length % 16) throw new Error('AES data length must be a multiple of 16');
    if (key.length < 16 || iv.length !== 16) throw new Error('invalid transform key or IV');
    if (typeof crypto === 'undefined' || !crypto || !crypto.aes) throw new Error('crypto.aes is unavailable');
    var transposed = [];
    for (var offset = 0; offset < data.length; offset += 16) {
        var block = jiongTransposeBlock(data, offset);
        for (var j = 0; j < block.length; j++) transposed.push(block[j]);
    }
    var method = decrypt ? crypto.aes.decrypt : crypto.aes.encrypt;
    if (typeof method !== 'function') throw new Error('crypto.aes ' + (decrypt ? 'decrypt' : 'encrypt') + ' is unavailable');
    var outputHex = method(jiongBytesToHex(transposed), jiongBytesToHex(key.slice(0, 16)), {
        mode: 'CBC', padding: 'NoPadding', iv: jiongBytesToHex(jiongTransposeBlock(iv, 0)),
        keyFormat: 'hex', ivFormat: 'hex', input: 'hex', output: 'hex'
    });
    var raw = jiongHexToBytes(outputHex), out = [];
    if (raw.length !== data.length) throw new Error('unexpected AES output length');
    for (var at = 0; at < raw.length; at += 16) {
        var restored = jiongTransposeBlock(raw, at);
        for (var k = 0; k < restored.length; k++) out.push(restored[k]);
    }
    return out;
}
function jiongSbox() {
    return jiongHexToBytes(
        '637c777bf26b6fc53001672bfed7ab76ca82c97dfa5947f0add4a2af9ca472c0' +
        'b7fd9326363ff7cc34a5e5f171d8311504c723c31896059a071280e2eb27b275' +
        '09832c1a1b6e5aa0523bd6b329e32f8453d100ed20fcb15b6acbbe394a4c58cf' +
        'd0efaafb434d338545f9027f503c9fa851a3408f929d38f5bcb6da2110fff3d2' +
        'cd0c13ec5f974417c4a77e3d645d197360814fdc222a908846eeb814de5e0bdb' +
        'e0323a0a4906245cc2d3ac629195e479e7c8376d8dd54ea96c56f4ea657aae08' +
        'ba78252e1ca6b4c6e8dd741f4bbd8b8a703eb5664803f60e613557b986c11d9e' +
        'e1f8981169d98e949b1e87e9ce5528df8ca1890dbfe6426841992d0fb054bb16'
    );
}
function jiongStreamXor(data, key) {
    if (!key.length) throw new Error('empty stream key');
    var state = jiongSbox(), i, j = 0, tmp;
    for (i = 0; i < 256; i++) {
        j = (j + state[i] + key[i % key.length]) & 255;
        tmp = state[i]; state[i] = state[j]; state[j] = tmp;
        state[j] ^= 0x66;
    }
    var out = [], x = 0;
    i = 0; j = 0;
    for (var index = 0; index < data.length; index++) {
        i = (i + 1) & 255;
        j = (j + state[i]) & 255;
        tmp = state[i]; state[i] = state[j]; state[j] = tmp;
        x = state[(state[i] + state[j]) & 255] ^ ((index + 0x34) & 255);
        out.push((data[index] ^ x) & 255);
    }
    return out;
}
function jiongTransformEncrypt(data, key, iv) {
    var pad = 16 - (data.length % 16), padded = data.slice();
    for (var i = 0; i < pad; i++) padded.push(pad);
    return jiongStreamXor(jiongAesRowMajor(padded, key, iv, false), key);
}
function jiongTransformDecrypt(data, key, iv) {
    var padded = jiongAesRowMajor(jiongStreamXor(data, key), key, iv, true);
    if (!padded.length) throw new Error('empty decrypted payload');
    var pad = padded[padded.length - 1];
    if (pad < 1 || pad > 16 || pad > padded.length) throw new Error('invalid PKCS7 padding');
    for (var i = padded.length - pad; i < padded.length; i++) if (padded[i] !== pad) throw new Error('invalid PKCS7 padding');
    return padded.slice(0, padded.length - pad);
}
function jiongRandomKey() {
    var out = [];
    for (var i = 0; i < 16; i++) out.push(Math.floor(Math.random() * 256) & 255);
    return out;
}
function jiongPortableSignature(payloadText) {
    var e = jiongExt();
    var ts = jiongNowMillis(), nonce = jiongNonce();
    var deviceId = jiongString(e.deviceId || JIONG_DEVICE_ID);
    var authPlain = '3.0.0.8-' + ts + '-Android-' + JIONG_CLIENT_VERSION + '-' + deviceId + '-' + nonce;
    var authStage = jiongBase64EncodeBytes(jiongUtf8Bytes(authPlain), JIONG_CUSTOM_B64);
    var authentication = jiongBase64EncodeBytes(jiongTransformEncrypt(
        jiongUtf8Bytes(authStage), jiongUtf8Bytes(JIONG_AUTH_KEY), jiongUtf8Bytes(JIONG_AUTH_IV)
    ), JIONG_CUSTOM_B64);
    var result = { ts: ts, authentication: authentication, tcs: 2, nonce: nonce, 'x-version': JIONG_APP_VERSION, data: '' };
    if (payloadText !== '') {
        if (typeof crypto === 'undefined' || !crypto || !crypto.rsa || typeof crypto.rsa.encrypt !== 'function') {
            throw new Error('crypto.rsa.encrypt is unavailable');
        }
        var key = jiongRandomKey();
        var wrapped = crypto.rsa.encrypt(jiongBytesToHex(key), JIONG_REQUEST_PUBLIC_KEY, {
            padding: 'PKCS1', input: 'hex', output: 'base64'
        });
        var first = jiongBase64Alphabet(wrapped, JIONG_STANDARD_B64, JIONG_CUSTOM_B64);
        var second = jiongBase64EncodeBytes(jiongTransformEncrypt(jiongUtf8Bytes(payloadText), key, key.slice().reverse()), JIONG_CUSTOM_B64);
        result.data = first + '.' + second;
    }
    return result;
}
function jiongPortableDecrypt(value) {
    value = jiongString(value, '').replace(/^\s+|\s+$/g, '');
    var parts = value.split('.');
    if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
    if (typeof crypto === 'undefined' || !crypto || !crypto.rsa || typeof crypto.rsa.decrypt !== 'function') {
        throw new Error('crypto.rsa.decrypt is unavailable');
    }
    var standardWrapped = jiongBase64Alphabet(parts[0], JIONG_CUSTOM_B64, JIONG_STANDARD_B64);
    var keyHex = jiongString(crypto.rsa.decrypt(standardWrapped, JIONG_RESPONSE_PRIVATE_KEY, {
        padding: 'PKCS1', input: 'base64', output: 'hex'
    }), '').replace(/\s+/g, '');
    var key;
    if (/^[0-9a-f]+$/i.test(keyHex) && keyHex.length % 2 === 0) key = jiongHexToBytes(keyHex);
    else key = jiongBase64DecodeBytes(keyHex, JIONG_STANDARD_B64);
    if (key.length !== 16) throw new Error('unexpected response session key length ' + key.length);
    var plain = jiongUtf8String(jiongTransformDecrypt(
        jiongBase64DecodeBytes(parts[1], JIONG_CUSTOM_B64), key, key.slice().reverse()
    ));
    return jiongJson(plain, plain);
}
function jiongUseBridge() {
    var e = jiongExt();
    return e.useCryptoBridge === true ||
        String(e.useCryptoBridge || '').toLowerCase() === 'true' ||
        e.forceCryptoBridge === true ||
        String(e.forceCryptoBridge || '').toLowerCase() === 'true';
}
function jiongBridgeAdd(out, seen, value) {
    if (value == null || value === '') return;
    if (Array.isArray(value)) {
        for (var i = 0; i < value.length; i++) jiongBridgeAdd(out, seen, value[i]);
        return;
    }
    if (typeof value === 'string' && /^[\s]*\[/.test(value)) {
        var decoded = jiongJson(value, null);
        if (Array.isArray(decoded)) {
            jiongBridgeAdd(out, seen, decoded);
            return;
        }
    }
    if (typeof value === 'string' && /[,;]/.test(value)) {
        var parts = value.split(/[,;]/);
        for (var p = 0; p < parts.length; p++) jiongBridgeAdd(out, seen, parts[p]);
        return;
    }
    var base = jiongString(value, '').replace(/^\s+|\s+$/g, '').replace(/\/+$/, '');
    if (!base || seen[base]) return;
    seen[base] = true;
    out.push(base);
}
function jiongBridgeCandidates() {
    if (!jiongUseBridge()) return [];
    var e = jiongExt();
    var out = [];
    var seen = {};
    jiongBridgeAdd(out, seen, e.cryptoBridge);
    jiongBridgeAdd(out, seen, e.bridge);
    jiongBridgeAdd(out, seen, e.nativeBridge);
    jiongBridgeAdd(out, seen, e.cryptoBridges);
    jiongBridgeAdd(out, seen, e.bridges);
    jiongBridgeAdd(out, seen, JIONG_CRYPTO_BRIDGE_FALLBACKS);
    jiongBridgeAdd(out, seen, JIONG_CRYPTO_BRIDGE);

    if (JIONG_ACTIVE_BRIDGE) {
        for (var i = 0; i < out.length; i++) {
            if (out[i] === JIONG_ACTIVE_BRIDGE) {
                out.splice(i, 1);
                break;
            }
        }
        out.unshift(JIONG_ACTIVE_BRIDGE);
    }
    return out;
}
function jiongBridgeBase() {
    var candidates = jiongBridgeCandidates();
    return candidates.length ? candidates[0] : '';
}
function jiongProxyEnabled() {
    if (!jiongUseBridge()) return false;
    var e = jiongExt();
    if (e.proxyApi != null) return e.proxyApi !== false && String(e.proxyApi) !== 'false';
    if (e.apiProxy != null && typeof e.apiProxy !== 'string') {
        return e.apiProxy !== false && String(e.apiProxy) !== 'false';
    }
    if (typeof e.apiEncrypt === 'function') return false;
    return !!(e.cryptoBridge || e.bridge || e.nativeBridge || e.cryptoBridges || e.bridges);
}
function jiongTransportPath(path) {
    if (!jiongProxyEnabled()) return jiongPath(path);
    var e = jiongExt();
    var explicit = e.apiProxyBase || e.proxyBase ||
        (typeof e.apiProxy === 'string' ? e.apiProxy : '');
    var bridge = jiongString(explicit || JIONG_ACTIVE_BRIDGE || jiongBridgeBase(), '').replace(/\/+$/, '');
    if (!bridge) return jiongPath(path);
    return bridge + '/proxy/' + jiongString(path, '').replace(/^\/+/, '');
}
function jiongBridgeCall(action, payload) {
    var candidates = jiongBridgeCandidates();
    if (!candidates.length) throw new Error('native crypto bridge is not configured');
    if (typeof post !== 'function' &&
        (typeof http === 'undefined' || !http || typeof http.post2 !== 'function')) {
        throw new Error('crypto bridge requires post or http.post2');
    }
    var bridgeBody = JSON.stringify({
        action: String(action || ''), payload: payload || {}
    });
    var e = jiongExt();
    var normalTimeout = jiongNumber(e.bridgeTimeout, jiongNumber(e.timeout, 20000));
    var probeTimeout = jiongNumber(e.bridgeProbeTimeout, Math.min(normalTimeout, 3500));
    var errors = [];

    for (var i = 0; i < candidates.length; i++) {
        var base = candidates[i];
        var bridgeOptions = {
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json; charset=utf-8' },
            timeout: base === JIONG_ACTIVE_BRIDGE ? normalTimeout : probeTimeout,
            noCookie: true
        };
        try {
            var response;
            if (typeof post === 'function') response = post(base + '/call', bridgeBody, JSON.stringify(bridgeOptions));
            else response = http.post2(base + '/call', bridgeBody, JSON.stringify(bridgeOptions));
            var status = response && typeof response === 'object' ? Number(response.status || response.statusCode || 0) : 200;
            var text = response && typeof response === 'object' && response.body != null ? response.body : response;
            var parsed = typeof text === 'object' ? text : jiongJson(text, null);
            if (status >= 400) throw new Error('HTTP ' + status + ': ' + jiongString(text, ''));
            if (!parsed || typeof parsed !== 'object') throw new Error('returned invalid JSON');
            if (parsed.error) throw new Error(jiongString(parsed.error));
            JIONG_ACTIVE_BRIDGE = base;
            return parsed;
        } catch (err) {
            errors.push(base + ' (' + jiongString(err && err.message ? err.message : err, 'failed') + ')');
            try { if (typeof log === 'function') log('jiong crypto bridge unavailable: ' + errors[errors.length - 1]); } catch (_) {}
        }
    }
    throw new Error('all crypto bridges failed: ' + errors.join('; '));
}
function jiongDecodeNativeResult(value) {
    if (value && typeof value === 'object' && value.payload && typeof value.payload === 'object') {
        if (value.payload.data !== undefined) value = value.payload.data;
        else value = value.payload;
    }
    if (typeof value === 'string') return jiongJson(value, value);
    return value;
}
function jiongNativeSignature(value) {
    if (typeof value === 'string') value = jiongJson(value, null);
    if (value && typeof value === 'object' && value.payload && typeof value.payload === 'object') {
        value = value.payload;
    }
    return value;
}
function jiongPrepareRequest(path, method, query, body, extra) {
    var e = jiongExt();
    var h = jiongConfiguredHeaders();
    method = String(method || 'GET').toUpperCase();
    var packet = {
        method: method,
        path: String(path || ''),
        query: query || {},
        data: body == null ? '' : body
    };
    var payloadText = body == null ? '' :
        (typeof body === 'string' ? body : JSON.stringify(body));
    var encrypted = null;
    try {
        if (typeof e.apiEncrypt === 'function') encrypted = e.apiEncrypt(payloadText, path, method, packet);
        else if (jiongUseBridge() && jiongBridgeBase()) encrypted = jiongBridgeCall('api_encrypt', { data: payloadText });
        else encrypted = jiongPortableSignature(payloadText);
    } catch (err) {
        throw new Error(path + ': apiEncrypt failed: ' + err);
    }
    if (!encrypted) encrypted = e.encryptedHeaders || e.signatureHeaders;
    encrypted = jiongNativeSignature(encrypted);
    if (encrypted && encrypted.headers) {
        jiongMerge(h, encrypted.headers);
    }
    if (encrypted && typeof encrypted === 'object') {
        if (encrypted.ts != null && h.ts == null) h.ts = String(encrypted.ts);
        if (encrypted.timestamp != null && h.Timestamp == null) h.Timestamp = String(encrypted.timestamp);
        if (encrypted.authentication != null && h.Authentication == null) h.Authentication = String(encrypted.authentication);
        if (encrypted.Authorization != null && h.Authorization == null) h.Authorization = String(encrypted.Authorization);
        if (encrypted.authorization != null && h.Authorization == null) h.Authorization = String(encrypted.authorization);
        if (encrypted.secretid != null && h.SecretId == null) h.SecretId = String(encrypted.secretid);
        if (encrypted.SecretId != null && h.SecretId == null) h.SecretId = String(encrypted.SecretId);
        if (encrypted.tcs != null && h.tcs == null) h.tcs = String(encrypted.tcs);
        if (encrypted.nonce != null && h.nonce == null) h.nonce = String(encrypted.nonce);
        if (encrypted['x-version'] != null && h['x-version'] == null) h['x-version'] = String(encrypted['x-version']);
        if (encrypted.APPID != null && h.APPID == null) h.APPID = String(encrypted.APPID);
    }
    jiongMerge(h, extra);
    var wireBody = payloadText;
    if (method === 'POST' && encrypted && typeof encrypted.data === 'string' && encrypted.data !== '') {
        wireBody = encrypted.data;
    }
    return { headers: h, body: wireBody, plaintext: payloadText, signature: encrypted };
}
function jiongQuery(params) {
    var out = [];
    params = params || {};
    for (var k in params) {
        if (!Object.prototype.hasOwnProperty.call(params, k) || params[k] == null) continue;
        out.push(jiongEncode(k) + '=' + jiongEncode(params[k]));
    }
    return out.join('&');
}
function jiongRequest(method, path, query, body, extraHeaders) {
    method = String(method || 'GET').toUpperCase();
    var prepared = jiongPrepareRequest(path, method, query, body, extraHeaders);
    var url = jiongTransportPath(path);
    var qs = jiongQuery(query);
    if (qs) url += (url.indexOf('?') >= 0 ? '&' : '?') + qs;
    var headers = prepared.headers;
    var options = { headers: headers, timeout: jiongNumber(jiongExt().timeout, 20000), noCookie: true };
    var response;
    var optionsJson = JSON.stringify(options);
    if (method === 'POST') {
        var payload = prepared.body;
        if (typeof post === 'function') {
            response = post(url, payload, optionsJson);
        } else if (typeof http !== 'undefined' && http && typeof http.post2 === 'function') {
            response = http.post2(url, payload, optionsJson);
        } else {
            throw new Error('HTTP POST helper unavailable');
        }
    } else if (typeof request === 'function') {
        response = request(url, optionsJson);
    } else if (typeof http !== 'undefined' && http && typeof http.request2 === 'function') {
        response = http.request2(url, optionsJson);
    } else {
        throw new Error('HTTP GET helper unavailable');
    }
    var status = response && typeof response === 'object' ? Number(response.status || response.statusCode || 0) : 200;
    var text = response && typeof response === 'object' && response.body != null ? response.body : response;
    if (text == null) text = '';
    var parsed = null;
    var e = jiongExt();
    if (typeof e.apiDecrypt === 'function') {
        try {
            var decryptPath = jiongPath(path);
            parsed = jiongDecodeNativeResult(e.apiDecrypt(text, decryptPath, method, query || {}, body, {
                path: path, url: url, headers: headers, encryptedBody: prepared.body, status: status
            }));
        } catch (err) {
            throw new Error(path + ': apiDecrypt failed: ' + err);
        }
    } else if (jiongUseBridge() && jiongBridgeBase()) {
        try {
            parsed = jiongDecodeNativeResult(jiongBridgeCall('api_decrypt', {
                data: jiongString(text, ''), path: jiongPath(path)
            }));
        } catch (err) {
            throw new Error(path + ': apiDecrypt failed: ' + err);
        }
    } else if (typeof text === 'string' && text.indexOf('.') > 0) {
        try {
            parsed = jiongPortableDecrypt(text);
        } catch (err) {
            throw new Error(path + ': portable apiDecrypt failed: ' + err);
        }
    }
    if (parsed == null) parsed = jiongJson(text, null);
    if (parsed == null && typeof text === 'object') parsed = text;
    if (status >= 400) throw new Error(method + ' ' + path + ' HTTP ' + status);
    if (parsed == null) throw new Error(path + ': encrypted response requires ext.apiDecrypt');
    if (parsed && typeof parsed === 'object' && parsed.code != null) {
        var code = Number(parsed.code);
        if (!jiongOkCode(code) && parsed.success !== true) {
            throw new Error(path + ': ' + jiongString(parsed.msg || parsed.message || ('code ' + parsed.code)));
        }
    }
    return parsed;
}
function jiongUnwrap(response) {
    var value = response;
    if (typeof value === 'string') value = jiongJson(value, value);
    if (value && typeof value === 'object' && value.data !== undefined) {
        var data = value.data;
        if (typeof data === 'string') data = jiongJson(data, data);
        return data;
    }
    return value;
}
function jiongList(value) {
    value = jiongUnwrap(value);
    if (Array.isArray(value)) return value;
    if (!value || typeof value !== 'object') return [];
    var keys = ['list', 'items', 'records', 'videos', 'results', 'rows', 'data'];
    for (var i = 0; i < keys.length; i++) {
        var v = value[keys[i]];
        if (Array.isArray(v)) return v;
    }
    return [];
}
function jiongCard(item) {
    item = item || {};
    var name = item.name || item.vname || item.title || item.vod_name || item.video_name || '';
    var pic = item.pic || item.img || item.cover || item.image || item.poster || item.vod_pic || '';
    var type = jiongFirstMeta(item, ['type', 'type_name', 'category', 'class', 'class_name', 'area']);
    var remarks = jiongRemarks(item);
    return {
        id: jiongString(item.vid != null ? item.vid : (item.id != null ? item.id : item.cid)),
        name: jiongString(name),
        pic: jiongPosterPic(pic),
        type: jiongString(type),
        year: jiongFirstMeta(item, ['year', 'vod_year', 'release_year']),
        remarks: jiongString(remarks),
        desc: jiongString(item.content || item.desc || item.description || item.actor || '')
    };
}
function jiongCards(value) {
    var list = jiongList(value), out = [], seen = {};
    for (var i = 0; i < list.length; i++) {
        var card = jiongCard(list[i]);
        if (!card.id || !card.name || seen[card.id]) continue;
        seen[card.id] = true;
        out.push(card);
    }
    return out;
}
function jiongDetailObject(response) {
    var v = response;
    if (v && typeof v === 'object' && v.data !== undefined) v = v.data;
    if (typeof v === 'string') v = jiongJson(v, {});
    if (v && typeof v === 'object') {
        if (v.video && typeof v.video === 'object') v = v.video;
        else if (v.detail && typeof v.detail === 'object') v = v.detail;
        else if (v.item && typeof v.item === 'object') v = v.item;
    }
    return v && typeof v === 'object' ? v : {};
}
function jiongPartName(part, index) {
    if (part == null) return String(index + 1);
    if (typeof part !== 'object') return String(part);
    return jiongString(part.part != null ? part.part : (part.name != null ? part.name :
        (part.title != null ? part.title : (part.episode != null ? part.episode : (index + 1)))));
}
function jiongParts(detailValue) {
    var source = detailValue.parts;
    if (!Array.isArray(source)) source = detailValue.episodes || detailValue.playlist || detailValue.list;
    var out = [];
    if (Array.isArray(source)) {
        for (var i = 0; i < source.length; i++) {
            var raw = source[i];
            var nested = raw && typeof raw === 'object' && Array.isArray(raw.part) ? raw.part : null;
            if (nested) {
                for (var j = 0; j < nested.length; j++) {
                    var episode = nested[j];
                    var episodeName = episode && typeof episode === 'object' ? jiongPartName(episode, j) : jiongString(episode, j + 1);
                    out.push({
                        name: episodeName,
                        oid: raw.oid,
                        play: raw.play,
                        play_zh: raw.play_zh,
                        vcode: raw.vcode != null ? raw.vcode : detailValue.vcode,
                        resolution: raw.resolution != null ? raw.resolution : detailValue.resolution
                    });
                }
                continue;
            }
            out.push({
                name: jiongPartName(raw, i),
                oid: raw && typeof raw === 'object' ? raw.oid : '',
                play: raw && typeof raw === 'object' ? raw.play : detailValue.play,
                play_zh: raw && typeof raw === 'object' ? raw.play_zh : detailValue.play_zh,
                vcode: raw && typeof raw === 'object' && raw.vcode != null ? raw.vcode : detailValue.vcode,
                resolution: raw && typeof raw === 'object' && raw.resolution != null ? raw.resolution : detailValue.resolution
            });
        }
    }
    if (!out.length && Number(detailValue.total) > 0 && Number(detailValue.total) < 1000) {
        for (var n = 1; n <= Number(detailValue.total); n++) out.push({
            name: String(n), oid: '', play: detailValue.play, play_zh: detailValue.play_zh,
            vcode: detailValue.vcode, resolution: detailValue.resolution
        });
    }
    return out;
}
function jiongCustomReferer(url) {
    url = jiongString(url, '');
    if (url.indexOf('aliyuncs.com') >= 0) return 'https://www.piccopilot.com';
    if (url.indexOf('toutiaovod.com') >= 0) return '';
    if (url.indexOf('kwimgs.com') >= 0) return 'https://www.kuaishou.com';
    if (url.indexOf('dcarvod.com') >= 0) return 'https://www.dongchedi.com';
    if (url.indexOf('douyinvod.com') >= 0) return 'https://www.douyin.com';
    return url;
}
function jiongPosterPic(pic) {
    var url = jiongString(pic, '');
    if (!url) return '';
    if (url.indexOf('@Referer=') !== -1 || url.indexOf('@User-Agent=') !== -1 || url.indexOf('@Headers=') !== -1) {
        return url;
    }
    var referer = jiongCustomReferer(url);
    if (referer && referer !== url && /^https?:\/\//i.test(referer)) {
        return url + '@Referer=' + referer;
    }
    return url;
}
function jiongFilterValues(values) {
    if (values == null) return [];
    if (!Array.isArray(values)) {
        var decoded = jiongJson(values, null);
        if (Array.isArray(decoded)) values = decoded;
        else values = jiongString(values, '').split(/[|,，、]+/);
    }
    var out = [{ n: '全部', v: '' }], seen = { '': true };
    for (var i = 0; i < values.length; i++) {
        var raw = values[i], name, value;
        if (raw && typeof raw === 'object') {
            name = jiongString(raw.n != null ? raw.n : (raw.name != null ? raw.name : raw.title), '');
            value = jiongString(raw.v != null ? raw.v : (raw.value != null ? raw.value : name), '');
        } else {
            name = jiongString(raw, '').replace(/^\s+|\s+$/g, '');
            value = name;
        }
        if (!name || name === '全部' || seen[value]) continue;
        seen[value] = true;
        out.push({ n: name, v: value });
    }
    return out;
}
function jiongChannelCategory(channel) {
    channel = channel || {};
    var key = jiongString(channel.id != null ? channel.id : channel.key, '');
    var title = jiongString(channel.name || channel.title, key)
        .replace(/國/g, '国').replace(/動漫/g, '动漫');
    var filters = [];
    var types = jiongFilterValues(channel.types || channel.type);
    var years = jiongFilterValues(channel.years || channel.year);
    var areas = jiongFilterValues(channel.areas || channel.area);
    if (types.length > 1) filters.push({ key: 'type', name: '类型', value: types });
    if (years.length > 1) filters.push({ key: 'year', name: '年份', value: years });
    if (areas.length > 1) filters.push({ key: 'area', name: '地区', value: areas });
    filters.push({ key: 'sort', name: '排序', value: [
        { n: '最新', v: 'addtime' },
        { n: '最热', v: 'hits' },
        { n: '推荐', v: 'weight' }
    ] });
    return { key: key, title: title, filters: filters };
}
function jiongFallbackChannels() {
    var years = '2026|2025|2024|2023|2022|2021|2020|2019|2018|2017|2016|2015|2014|2013|2012|2011|2010|2009|2008|2007'.split('|');
    return [
        {
            id: 1, name: '日漫', years: years, areas: ['日本', '美国', '欧美', '其他'],
            types: '搞笑|经典|热血|催泪|治愈|猎奇|励志|战斗|后宫|机战|恋爱|百合|科幻|奇幻|推理|校园|运动|魔法|历史|伪娘|美少女|萝莉|亲子|青春|冒险|竞技|都市|日常|血腥|恐怖|游戏改|漫画改|轻小说改|偶像|音乐|悬疑|异世界|转生|穿越|职场|群像|AI动画|美食|超能力'.split('|')
        },
        {
            id: 2, name: '国漫', years: years, areas: ['大陆'],
            types: '搞笑|经典|热血|催泪|治愈|猎奇|励志|战斗|后宫|机战|恋爱|百合|科幻|奇幻|推理|校园|运动|魔法|历史|剧情|伪娘|美少女|萝莉|亲子|青春|冒险|竞技|复仇|动作|都市|日常|血腥|恐怖|重生|穿越|武侠|原创|末日|灾难|职场|漫画改|小说改|游戏改|古风|悬疑|偶像|江湖|仙侠|异能|AI漫剧'.split('|')
        },
        {
            id: 26, name: '动漫电影', years: years,
            areas: ['日本', '大陆', '韩国', '美国', '英国', '加拿大', '欧美', '其他'],
            types: '喜剧|悲剧|爱情|动作|枪战|犯罪|惊悚|动画|家庭|魔幻|战争|剧情|搞笑|经典|热血|催泪|治愈|猎奇|励志|战斗|后宫|机战|恋爱|百合|科幻|奇幻|推理|校园|运动|魔法|历史|伪娘|美少女|萝莉|亲子|青春|冒险|竞技|都市|日常|血腥|恐怖|游戏改|漫画改|轻小说改|偶像|音乐|悬疑|异世界|转生|穿越|职场|群像'.split('|')
        },
        {
            id: 3, name: '其他动漫', years: years,
            areas: ['日本', '大陆', '韩国', '美国', '英国', '加拿大', '墨西哥', '欧美', '其他'],
            types: '喜剧|悲剧|爱情|动作|枪战|犯罪|惊悚|恐怖|悬疑|动画|家庭|奇幻|魔幻|科幻|战争|青春|剧情|冒险'.split('|')
        }
    ];
}
function jiongOfficialCategories() {
    if (JIONG_CATEGORY_CACHE) return JIONG_CATEGORY_CACHE;
    var channels = [];
    try {
        channels = jiongList(jiongRequest('GET', '/app/channel', { 'top-level': 'true' }));
    } catch (e) {
        try { if (typeof log === 'function') log('jiong channels: ' + e); } catch (_) {}
    }
    if (!channels.length) channels = jiongFallbackChannels();
    var out = [{ key: '', title: '推荐' }];
    for (var i = 0; i < channels.length; i++) {
        var category = jiongChannelCategory(channels[i]);
        if (category.key) out.push(category);
    }
    JIONG_CATEGORY_CACHE = out;
    return out;
}
function categories() {
    var e = jiongExt();
    var source = e.categoriesJson ? jiongJson(e.categoriesJson, []) :
        (Array.isArray(e.categories) ? e.categories : null);
    if (!Array.isArray(source)) source = jiongOfficialCategories();
    var out = [];
    for (var i = 0; i < source.length; i++) {
        var raw = source[i] || {};
        var item = {};
        jiongMerge(item, raw);
        var title = jiongString(item.title || item.name, '');
        var key = jiongString(item.key != null ? item.key : item.id, '');
        if (key === '0' && /^(推荐|首页|精选)$/.test(title)) key = '';
        item.key = key;
        item.title = title || key;
        out.push(item);
    }
    return JSON.stringify(out);
}
function search(keyword, page) {
    try {
        page = Math.max(1, Number(page) || 1);
        var keywordText = jiongString(keyword, '');
        var categoryKey = keywordText.replace(/^\s+|\s+$/g, '');
        var result;
        
        
        
        if (/^(?:1|2|3|26)$/.test(categoryKey)) {
            result = jiongRequest('GET', '/app/video/list', {
                channel: categoryKey, sort: 'addtime', limit: 25, page: page
            });
        } else {
            result = jiongRequest('GET', '/app/video/search', {
                key: keywordText, limit: 25, page: page
            });
        }
        return JSON.stringify(jiongCards(result));
    } catch (e) {
        try { if (typeof log === 'function') log('jiong search: ' + e); } catch (_) {}
        return '[]';
    }
}
function searchFiltered(category, filtersJson, page) {
    try {
        var filters = jiongJson(filtersJson, {}) || {};
        page = Math.max(1, Number(page) || 1);
        var query = {
            channel: category == null || category === '' ? 0 : category,
            sort: filters.sort || 'addtime', limit: 25, page: page
        };
        var type = filters.type || filters.genre || filters['class'] || '';
        if (type && type !== '全部') query.type = type;
        if (filters.year && filters.year !== '全部') query.year = filters.year;
        if (filters.area && filters.area !== '全部') query.area = filters.area;
        var result = jiongRequest('GET', '/app/video/list', query);
        return JSON.stringify(jiongCards(result));
    } catch (e) {
        try { if (typeof log === 'function') log('jiong category: ' + e); } catch (_) {}
        return '[]';
    }
}
function homeSections() {
    var e = jiongExt();
    var out = [];
    var definitions = jiongJson(e.homeChannels, null);
    if (!Array.isArray(definitions)) definitions = [
        { title: '热门推荐', key: '', channel: 0, sort: 'weight', limit: 12, page: 2 },
        { title: '日漫新番', key: '1', channel: 1, sort: 'addtime', limit: 12, page: 1 },
        { title: '国漫热播', key: '2', channel: 2, sort: 'hits', limit: 12, page: 1 },
        { title: '动漫电影', key: '26', channel: 26, sort: 'addtime', limit: 12, page: 1 },
        { title: '其他动漫', key: '3', channel: 3, sort: 'addtime', limit: 12, page: 1 }
    ];

    for (var i = 0; i < definitions.length; i++) {
        var d = definitions[i] || {};
        try {
            var query = {
                channel: d.channel == null ? 0 : d.channel,
                sort: d.sort == null ? 'addtime' : d.sort,
                limit: Math.max(1, jiongNumber(d.limit, 12)),
                page: Math.max(1, jiongNumber(d.page, 1))
            };
            if (d.type != null && d.type !== '') query.type = d.type;
            if (d.area != null && d.area !== '') query.area = d.area;
            if (d.year != null && d.year !== '') query.year = d.year;
            var items = jiongCards(jiongRequest('GET', '/app/video/list', query));
            if (items.length) out.push({
                title: jiongString(d.title, '推荐'),
                key: jiongString(d.key, d.channel == null ? '' : d.channel),
                items: items
            });
        } catch (sectionError) {
            try { if (typeof log === 'function') log('jiong home section: ' + sectionError); } catch (_) {}
        }
    }

    try {
        var bannerChannel = e.bannerChannel == null ? 0 : e.bannerChannel;
        var bannerPath = e.bannerPath || ('/app/banners/' + jiongEncode(bannerChannel));
        var banners = jiongCards(jiongRequest('GET', bannerPath, {}));
        if (banners.length) out.push({ title: '精选轮播', key: '__hero__', items: banners });
    } catch (bannerError) {
        try { if (typeof log === 'function') log('jiong home banner: ' + bannerError); } catch (_) {}
    }
    return JSON.stringify(out);
}
function detail(id) {
    try {
        var result = jiongRequest('GET', '/app/video/detail', { id: jiongString(id, '') });
        var d = jiongDetailObject(result);
        var parts = jiongParts(d), episodes = [];
        for (var i = 0; i < parts.length; i++) {
            var p = parts[i] || {};
            episodes.push({
                name: jiongString(p.name || (i + 1)),
                url: JSON.stringify({
                    id: jiongString(d.id != null ? d.id : id),
                    vid: jiongString(d.id != null ? d.id : id),
                    vcode: jiongString(p.vcode != null ? p.vcode : d.vcode),
                    resolution: jiongString(p.resolution != null ? p.resolution : d.resolution),
                    play: jiongString(p.play != null ? p.play : d.play),
                    part: jiongString(p.name || (i + 1)),
                    oid: p.oid == null ? '' : p.oid
                }),
                route: jiongString(p.play_zh || p.play || d.play_zh || d.play || '在线播放')
            });
        }
        var card = jiongCard(d);
        return JSON.stringify({
            id: card.id || jiongString(id),
            name: card.name,
            alias: jiongFirstMeta(d, ['ename', 'alias', 'vod_sub', 'original_title']),
            pic: card.pic,
            type: card.type,
            year: card.year,
            remarks: card.remarks,
            area: jiongFirstMeta(d, ['area', 'region', 'vod_area', 'country', 'country_name']),
            actor: jiongFirstMeta(d, ['actor', 'actors', 'cast', 'starring', 'vod_actor']),
            director: jiongFirstMeta(d, ['director', 'directors', 'vod_director']),
            score: jiongFirstMeta(d, ['score', 'stars', 'rating', 'vod_score']),
            state: jiongFirstMeta(d, ['state', 'status_text', 'version']),
            desc: card.desc,
            related: __niviiRelatedFrom(result, d), episodes: episodes
        });
    } catch (e) {
        try { if (typeof log === 'function') log('jiong detail: ' + e); } catch (_) {}
        return JSON.stringify({
            id: jiongString(id), name: '', pic: '', type: '', year: '', remarks: '',
            area: '', actor: '', director: '', score: '', state: '', desc: String(e), episodes: []
        });
    }
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
        vod_alias: __auv_str(d.alias || ''),
        vod_pic: __auv_str(d.vod_pic || d.pic || d.img || d.cover),
        type_name: __auv_str(d.type_name || d.type || ''),
        vod_year: __auv_str(d.vod_year || d.year || ''),
        vod_remarks: __auv_str(d.vod_remarks || d.remarks || ''),
        vod_content: __auv_str(d.vod_content || d.desc || d.content || ''),
        vod_play_from: order.join('$$$'),
        vod_play_url: playUrls.join('$$$')
    }] });
}
function __auv_related(id) {
            var response = jiongRequest('GET', '/app/video/detail', {id: jiongString(id, '')});
            var payload = response && response.data || {}, detail = jiongDetailObject(response) || {};
            function relatedFrom(value) {
                return value.related || value.recommendations || value.related_videos || value.guesslike || value.similar || value.relate_list;
            }
            var items = relatedFrom(detail) || relatedFrom(payload) || relatedFrom(response || {}) || [];
            return JSON.stringify({list: __auv_list(jiongCards(items))});
        }
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
