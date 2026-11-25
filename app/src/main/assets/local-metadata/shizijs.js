// Metadata-only adapter. Playback remains in the authenticated server core.
globalThis.__niviiDetailRelatedVersion=1;
(function(){
var __auv_crypto = globalThis.CryptoJS || {};
var __auv_http_req = (typeof auvHttp === 'function' ? auvHttp : (globalThis.req || globalThis._http));
var TIMEOUT = 20000;
function base64Encode(value) { try { return __auv_crypto.enc.Base64.stringify(__auv_crypto.enc.Utf8.parse(value == null ? '' : String(value))); } catch (e) { return ''; } }
function base64Decode(value) { try { return __auv_crypto.enc.Base64.parse(value == null ? '' : String(value)).toString(__auv_crypto.enc.Utf8); } catch (e) { return ''; } }
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
var JC = (globalThis.crypto && typeof globalThis.crypto.rsa === 'function') ? globalThis.crypto : {
        hash: __auv_hash,
        hmac: __auv_hmac,
        aes: { encrypt: function(v, k, o) { return __auv_aes(v, k, o, false); }, decrypt: function(v, k, o) { return __auv_aes(v, k, o, true); } },
        rsa: { encrypt: function(v, k, o) { return __auv_rsa(v, k, o, false); }, decrypt: function(v, k, o) { return __auv_rsa(v, k, o, true); } },
        base64: { encode: base64Encode, decode: base64Decode }
    };
function __auv_options(options, method) {
        var opt = {};
        if (typeof options === 'string') opt = parseJson(options, {}) || {};
        else if (options) opt = options;
        opt.method = method || opt.method || 'get';
        opt.async = false;
        if (!opt.headers) opt.headers = {};
        return opt;
    }
var HOST = 'http://bkbfdm.hzhcbkj.cn';
var APPID = '4150439554430627';
var APP_VERSION = '2024-09-24';
var CLIENT_VERSION = '1.0.0.8';
var DEVICE_ID = 'f9d811048870869e2a408deb16dd8c9d';
var JIONG_AUTH_KEY = 'ziISjqkXPsGUMRNGyWigxDGtJbfTdcGv';
var JIONG_AUTH_IV = 'WonrnVkxeIxDcFbv';
var STANDARD_B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
var CUSTOM_B64 = '5iW7S0GX6uf1cv3ny4q8es2Q+bdkYgKOIT/tzhAxUrFlVPmow9BHCZNMDpEaJRLj';
var SBOX_HEX = '637c777bf26b6fc53001672bfed7ab76ca82c97dfa5947f0add4a2af9ca472c0'
        + 'b7fd9326363ff7cc34a5e5f171d8311504c723c31896059a071280e2eb27b275'
        + '09832c1a1b6e5aa0523bd6b329e32f8453d100ed20fcb15b6acbbe394a4c58cf'
        + 'd0efaafb434d338545f9027f503c9fa851a3408f929d38f5bcb6da2110fff3d2'
        + 'cd0c13ec5f974417c4a77e3d645d197360814fdc222a908846eeb814de5e0bdb'
        + 'e0323a0a4906245cc2d3ac629195e479e7c8376d8dd54ea96c56f4ea657aae08'
        + 'ba78252e1ca6b4c6e8dd741f4bbd8b8a703eb5664803f60e613557b986c11d9e'
        + 'e1f8981169d98e949b1e87e9ce5528df8ca1890dbfe6426841992d0fb054bb16';
var RSA_PRIV_PEM = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAo0aDQMwcWpsCrvI0J222vaB6zRuAZ1U9VSjhCKwqicXodMlg
fwhKhjoZ7jVoRKZ6hZ8GNDoANJ7FyV23Cet++aDot4JhkbL4RHBfi8sqUnjWYf+j
GI/WWgIpGiJKTvzsG+by3Wr0f4c9Ajb334Kwu7bLFpU3nKqDDIfTYrF0hsDiWzJ4
CN9pOnYa4FZ+pfPy0YaFxLT5MDbsBQ2lqWNxb+OVrjVX+8hiaYnWjwmHlIDAao2i
rnu+YIGduwv+/PNK6DXl0NN3W0S7PRT9wyBX8j1Tus230dAlHRj0hfCbrqfAX1vV
TsHxgUnLgUQyQ4PITbJ7SRUqVsY8Y/Y9T4eVNQIDAQABAoIBAFj0HKQbz8LJOvAH
QsTMcEfle6HtPsqNVQnlaJyp987xxNCDug/be4afdushq7njHVNZLS8c/mmsqsMn
TIaaB6aGtOLtpKyVXc8jjdqCiH9AGERx2vCRxM1q6eu0DNn1z8jvzRc2oxgrnOBt
BCSAdjr+vqyCBTdUamtUQKU/WuXip1LwjQ7C2L7AoILBmIFGAjN1rXQqsWi73No1
/Xvov9y25DZnIgnVTGi++Ue9FXh3qfV7/CQkZ1X6dqQ01dW4PZtpjdI2Wr6A+IC8
iRaj5HZYcJkJUmNHrFKxL0Z7b2yH/mmr9YXAccIk7yFMFSyhGSoqT1RYheOi5vvS
VE0WY6ECgYEA0mQb6lBI87FYG79pc+Cb/G/3idZAT9DoTT2DaCFHLG1QKHEabLj9
vad3v6AjRnFRRoUv3WSuLLIfha5vcpVZ13TvSlqVVd6n7XwSIfnthDQ2ypB75VJT
//DWYJL4gexGZt0s/smQpK8iB1lKGfKqkOFU+J88wPopyN1QMuYBmVkCgYEAxqur
UF+abXcYvTwdAbAGH0gkaXAbeLbrwDKZ/qcW+QGUvxoin5j6ZKUUhR1UMD+bF78j
EQXM07+tpxcl1jM67aYWZTsPtqKi571Y2urIRmiBDDSb5B4AxrUSYAqq6RkA6lXD
UxAaDT3Tz/TC1V2dtxwJssS/bEOwr/Z127nqAz0CgYAsZDsPoYkDAjRZBnY1oPrI
tMdCKha/wJCDW6tSWVMvKJF1NwggUJgZYDCAGkXXIynG+2syB4BIpfzItBmHz8N5
Fo823Q4NZEGCdl9NE/Ltpia5bur1Y/2dTy+siNYuc7AXHCvWRqliViGT818TQoSC
tUi8fLzQ6vfODgRR+P31YQKBgCDg/EMa71W6Zg+7SRmkZf77U3tXoFREAZQXS8EH
KhgfmNxfmOdMy/OoFlNJXUt221X8vfLtQM6yZCzI+ewPImt+Fyq9sYYKOGedwHzK
akasuN6qPjpsdLht8xKN8WcOSkZ91wuCGK2kU8+QtEXXbmiFbV12ji9+rFkSssKg
bAgJAoGBAI1uglzCpiaLDUpMjqnk83xWu6rujFEWdyLHmzS9QNtQfbXNq4zCdPp8
tofBtmz+7g30RwFYSJCHUp+kp0rwiNjj4JOMf9x4UtGMel8+CghY4uZP05GWjqRM
51iy21+njFSSFxbs6PZTMcrNS5lQH0l0gxXmBa6m6bFFGRBMbR9s
-----END RSA PRIVATE KEY-----`;
var RSA_PUB_PEM = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAq+BSQiNSojdRQf5Ie9VC
+jmlCkHbE93ei0Tl2AtaBSOxovTR3o8KCQtJF4FBwpC3k6UYJAdIq6nXA+zfJv0p
tF9Ow6TQUjGytLUX5S0NNyOADGV07eIuBtA6j+l6vZ+T1iikeEkSjZkrhmpm1yh/
PTA8VaDSN1EOS3NWZWk56LKofvET12n88mJgBpWwyqD6iImzwLdwWHbWtk7xSI2+
zENffzP6LJk5PApYQtIXaR1nCJ/TCXgbqWRFjXpT9kiaID4cvqMT7WnBxX1zSlj0
e0PYMOEWxt6fioo/ksnWoyAK8hpbgHgDuPe6mqEvLPR8tAPMhDP46+yEOLNwexzr
9wIDAQAB
-----END PUBLIC KEY-----`;
function strToBytes(s) { return waToBytes(CryptoJS.enc.Utf8.parse(s == null ? '' : String(s))); }
function bytesToUtf8(b) { return CryptoJS.enc.Utf8.stringify(bytesToWA(b)); }
function bytesToLatin1(bytes) { var s = ''; for (var i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i] & 0xff); return s; }
function latin1ToBytes(s) { var out = new Uint8Array(s.length); for (var i = 0; i < s.length; i++) out[i] = s.charCodeAt(i) & 0xff; return out; }
function bytesToWA(bytes) { return CryptoJS.enc.Latin1.parse(bytesToLatin1(bytes)); }
function waToBytes(wa) { return latin1ToBytes(wa.toString(CryptoJS.enc.Latin1)); }
function bytesToB64(bytes) { return CryptoJS.enc.Base64.stringify(bytesToWA(bytes)); }
function hexToBytes(hex) { return waToBytes(CryptoJS.enc.Hex.parse(hex)); }
function randBytes(n) { var a = new Uint8Array(n); for (var i = 0; i < n; i++) a[i] = Math.floor(Math.random() * 256); return a; }
function randDigits(n) { var s = ''; for (var i = 0; i < n; i++) s += Math.floor(Math.random() * 10); return s; }
function reverseBytes(b) { var o = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) o[i] = b[b.length - 1 - i]; return o; }
function qs(obj) {
        var p = [];
        for (var k in obj) if (obj.hasOwnProperty(k)) p.push(encodeURIComponent(k) + '=' + encodeURIComponent(obj[k] == null ? '' : String(obj[k])));
        return p.join('&');
    }
function b64enc(data, alpha) {
        var s = bytesToLatin1(data);
        var out = '';
        for (var i = 0; i < s.length; i += 3) {
            var a = s.charCodeAt(i) & 0xff;
            var b = (i + 1 < s.length) ? (s.charCodeAt(i + 1) & 0xff) : 0;
            var c = (i + 2 < s.length) ? (s.charCodeAt(i + 2) & 0xff) : 0;
            out += alpha[a >> 2];
            out += alpha[((a & 3) << 4) | (b >> 4)];
            out += (i + 1 < s.length) ? alpha[((b & 15) << 2) | (c >> 6)] : '=';
            out += (i + 2 < s.length) ? alpha[c & 63] : '=';
        }
        return out;
    }
function b64dec(value, alpha) {
        value = String(value).replace(/\s/g, '');
        var rev = Object.create(null);
        for (var i = 0; i < alpha.length; i++) rev[alpha[i]] = i;
        var out = [];
        for (var j = 0; j < value.length; j += 4) {
            var c0 = rev[value[j]], c1 = rev[value[j + 1]];
            var c2 = value[j + 2] === '=' ? -1 : rev[value[j + 2]];
            var c3 = value[j + 3] === '=' ? -1 : rev[value[j + 3]];
            if (c0 == null || c1 == null) break;
            out.push((c0 << 2) | (c1 >> 4));
            if (c2 >= 0) out.push(((c1 & 15) << 4) | (c2 >> 2));
            if (c3 >= 0) out.push(((c2 & 3) << 6) | c3);
        }
        return new Uint8Array(out);
    }
function b64alpha(value, frm, to) {
        var rev = Object.create(null);
        for (var i = 0; i < frm.length; i++) rev[frm[i]] = i;
        var out = '';
        for (var k = 0; k < value.length; k++) out += (value[k] in rev) ? to[rev[value[k]]] : value[k];
        return out;
    }
function transpose16(bytes, off) {
        var out = new Uint8Array(16);
        var idx = 0;
        for (var r = 0; r < 4; r++)
            for (var c = 0; c < 4; c++)
                out[idx++] = bytes[off + r + 4 * c];
        return out;
    }
function transposeAll(data) {
        var out = new Uint8Array(data.length);
        for (var off = 0; off < data.length; off += 16) out.set(transpose16(data, off), off);
        return out;
    }
function aesRowMajor(data, keyBytes, ivBytes, decrypting) {
        var transposed = transposeAll(data);
        var ivT = transpose16((ivBytes instanceof Uint8Array) ? ivBytes : strToBytes(ivBytes), 0);
        var kb = (keyBytes instanceof Uint8Array) ? keyBytes : strToBytes(keyBytes);
        var key16 = kb.subarray(0, 16);
        var cfg = { iv: bytesToWA(ivT), mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.NoPadding };
        var resWA;
        if (decrypting) resWA = CryptoJS.AES.decrypt({ ciphertext: bytesToWA(transposed) }, bytesToWA(key16), cfg);
        else resWA = CryptoJS.AES.encrypt(bytesToWA(transposed), bytesToWA(key16), cfg).ciphertext;
        var raw = waToBytes(resWA);
        var out = new Uint8Array(raw.length);
        for (var off = 0; off < raw.length; off += 16) out.set(transpose16(raw, off), off);
        return out;
    }
function streamXor(data, key) {
        var state = new Uint8Array(waToBytes(CryptoJS.enc.Hex.parse(SBOX_HEX)));
        var j = 0;
        for (var i = 0; i < 256; i++) {
            j = (j + state[i] + (key[i % key.length] & 0xff)) & 255;
            var t = state[i]; state[i] = state[j]; state[j] = t;
            state[j] ^= 0x66;
        }
        var out = new Uint8Array(data.length);
        var a = 0, b = 0, x = 0;
        for (var idx = 0; idx < data.length; idx++) {
            a = (a + 1) & 255;
            b = (b + state[a]) & 255;
            var t2 = state[a]; state[a] = state[b]; state[b] = t2;
            x = state[(state[a] + state[b]) & 255] ^ ((idx + 0x34) & 255);
            out[idx] = data[idx] ^ x;
        }
        return out;
    }
function pkcs7Pad(d, blk) {
        blk = blk || 16;
        var p = blk - (d.length % blk);
        var out = new Uint8Array(d.length + p);
        out.set(d, 0);
        for (var i = d.length; i < out.length; i++) out[i] = p;
        return out;
    }
function pkcs7Unpad(d) {
        var p = d[d.length - 1];
        if (p < 1 || p > 16) return d;
        return d.subarray(0, d.length - p);
    }
function transformEnc(data, key, iv) {
        var kb = (key instanceof Uint8Array) ? key : strToBytes(key);
        var ib = (iv instanceof Uint8Array) ? iv : strToBytes(iv);
        return streamXor(aesRowMajor(pkcs7Pad(data), kb, ib, false), kb);
    }
function transformDec(data, key, iv) {
        var kb = (key instanceof Uint8Array) ? key : strToBytes(key);
        var ib = (iv instanceof Uint8Array) ? iv : strToBytes(iv);
        var padded = aesRowMajor(streamXor(data, kb), kb, ib, true);
        return pkcs7Unpad(padded);
    }
function authHeader(tsMs, nonce, deviceId) {
        var plain = '3.0.0.8-' + tsMs + '-Android-' + CLIENT_VERSION + '-' + deviceId + '-' + nonce;
        var stageStr = b64enc(strToBytes(plain), CUSTOM_B64);
        var encBytes = transformEnc(strToBytes(stageStr), JIONG_AUTH_KEY, JIONG_AUTH_IV);
        return b64enc(encBytes, CUSTOM_B64);
    }
function rsaEncrypt(symBytes, pubPem) {
        var wrapped = JC.rsa.encrypt(bytesToB64(symBytes), pubPem, { input: 'base64', output: 'base64' });
        return wrapped;
    }
function rsaDecryptToBytes(stdB64, privPem) {
        var hex = JC.rsa.decrypt(stdB64, privPem, { input: 'base64', output: 'hex' });
        return hexToBytes(hex);
    }
function shiziCall(method, path, query, bodyObj) {
        var ts = Date.now();
        var nonce = randDigits(8);
        var auth = authHeader(ts, nonce, DEVICE_ID);
        var headers = {
            'APPID': APPID, 'x-version': APP_VERSION, 'tcs': '2', 'ts': String(ts),
            'nonce': nonce, 'authentication': auth,
            'user-agent': 'Dart/3.6 (dart:io)', 'Accept': 'application/json, text/plain, */*'
        };
        var url = HOST + path;
        if (query) url += '?' + qs(query);
        var data = null;
        if (bodyObj != null) {
            var payload = JSON.stringify(bodyObj);
            var sym = randBytes(16);
            var wrapped = rsaEncrypt(sym, RSA_PUB_PEM);
            var first = b64alpha(wrapped, STANDARD_B64, CUSTOM_B64);
            var second = b64enc(transformEnc(strToBytes(payload), sym, reverseBytes(sym)), CUSTOM_B64);
            headers['content-type'] = 'application/json; charset=utf-8';
            data = first + '.' + second;
        }
        var enc;
        if (method === 'POST') enc = post(url, data, { headers: headers, timeout: TIMEOUT });
        else enc = request(url, { headers: headers, timeout: TIMEOUT });
        return shiziDecrypt(enc);
    }
function shiziDecrypt(enc) {
        enc = (enc || '').trim();
        var jr = parseJson(enc, null);
        if (jr && typeof jr === 'object' && typeof jr.raw === 'string') {
            try { return jiongDecrypt(jr.raw); } catch (e) { throw new Error('Shizi raw decrypt failed: ' + e.message); }
        }
        if (enc.indexOf('.') >= 0) {
            try { return jiongDecrypt(enc); } catch (e) { throw new Error('Shizi decrypt failed: ' + e.message); }
        }
        return parseJson(enc, {});
    }
function jiongDecrypt(blob) {
        var parts = String(blob).split('.');
        if (parts.length < 2) return parseJson(blob, {});
        var std1 = b64alpha(parts[0], CUSTOM_B64, STANDARD_B64);
        var sym = rsaDecryptToBytes(std1, RSA_PRIV_PEM);
        var raw = b64dec(parts[1], CUSTOM_B64);
        var plain = transformDec(raw, sym, reverseBytes(sym));
        return parseJson(bytesToUtf8(plain), {});
    }
function toVodList(arr) {
        var list = [];
        for (var i = 0; i < arr.length; i++) {
            var it = arr[i]; if (!it) continue;
            var vid = String(it.id); var name = it.name || it.title || '';
            if (vid && name) list.push({
                vod_id: vid, vod_name: name, vod_pic: it.pic || '',
                vod_remarks: it.remarks || it.year || '', type_name: it.type || '',
                vod_year: String(it.year || ''), vod_area: it.area || ''
            });
        }
        return list;
    }
function home() {
        // 直接用后端 /app/channel 返回的真实分类（参考 shizi_api.py 的 channel()），
        // 不硬编码、也不放"推荐"（App 自带首页 tab 显示 homeVod）。
        var cls = [], filters = {};
        try {
            var r = shiziCall('GET', '/app/channel', { 'top-level': 'true' }, null);
            var data = (r && r.data) || [];
            var arr = Array.isArray(data) ? data : ((data && (data.list || data.items)) || []);
            for (var i = 0; i < arr.length; i++) {
                var c = arr[i] || {};
                var cid = c.id != null ? String(c.id) : (c.channel_id != null ? String(c.channel_id) : String(c.code != null ? c.code : ''));
                var name = c.name || c.title || '';
                if (cid && name && cid !== '0') {
                    cls.push({ type_id: cid, type_name: name });
                    filters[cid] = channelFilters(c, cid);
                }
            }
        } catch (e) {}
        if (!cls.length) throw new Error('分类信息获取失败，请稍后重试');
        return { class: cls, filters: filters };
    }
function channelFilters(channel, tid) {
        var filters = [];
        var fields = [['types', 'type', '类型'], ['years', 'year', '年份'], ['areas', 'area', '地区']];
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i], values = channel[field[0]];
            if (!Array.isArray(values) || !values.length) continue;
            var options = [{ n: '全部', v: '' }], seen = {};
            for (var j = 0; j < values.length; j++) {
                var value = String(values[j] == null ? '' : values[j]).trim();
                if (!value || seen[value]) continue;
                seen[value] = true;
                options.push({ n: value, v: value });
            }
            if (options.length > 1) filters.push({ key: field[1], name: field[2], init: '', value: options });
        }
        filters.push({ key: 'sort', name: '排序', init: CHANNEL_SORT[String(tid)] || 'hits', value: [
            { n: '最新', v: 'addtime' }, { n: '热度', v: 'hits' }, { n: '推荐', v: 'weight' }
        ] });
        return filters;
    }
function homeVod() {
        // 综合/推荐：channel 0 sort=weight。
        var r = shiziCall('GET', '/app/video/list', { channel: 0, sort: 'weight', limit: 20, page: 1 }, null);
        return { list: toVodList(_listFrom(r)) };
    }
var CHANNEL_SORT = { '1': 'addtime', '2': 'hits', '26': 'addtime' };
function _listFrom(r) {
        var data = r && r.data;
        return Array.isArray(data) ? data : (data && (data.items || data.list)) || [];
    }
function category(tid, pg, filter, extend) {
        extend = extend || {};
        var query = { channel: tid || 0, sort: extend.sort || CHANNEL_SORT[String(tid)] || 'hits', limit: 20, page: pg || 1 };
        var keys = ['type', 'year', 'area'];
        for (var i = 0; i < keys.length; i++) {
            if (extend[keys[i]]) query[keys[i]] = String(extend[keys[i]]);
        }
        var arr = _listFrom(shiziCall('GET', '/app/video/list', query, null));
        return { list: toVodList(arr), page: parseInt(pg || 1), pagecount: 99 };
    }
function search(wd, quick, pg) {
        var r = shiziCall('GET', '/app/video/search', { key: wd, limit: 25, page: pg || 1 }, null);
        var data = r && r.data;
        var arr = Array.isArray(data) ? data : (data && (data.items || data.list)) || [];
        return { list: toVodList(arr) };
    }
function detail(id) {
        var r = shiziCall('GET', '/app/video/detail', { id: id }, null);
        var data = (r && r.data) || {};
        var parts = data.parts || [];
        var routes = {}, order = [], playUrls = [];
        for (var i = 0; i < parts.length; i++) {
            var g = parts[i] || {};
            var play = g.play || 'newup-jp';
            var playZh = g.play_zh || play;
            if (!routes[playZh]) { routes[playZh] = []; order.push(playZh); }
            var plist = g.part || [];
            for (var j = 0; j < plist.length; j++) {
                var ep = plist[j];
                routes[playZh].push(ep + '$' + id + '|' + play + '|' + ep);
            }
        }
        for (var k = 0; k < order.length; k++) playUrls.push(routes[order[k]].join('#'));
        return { list: [{
            related: toVodList(data.related || data.recommendations || data.related_videos || data.guesslike || data.similar || data.relate_list || []), vod_id: String(id),
            vod_name: data.name || '',
            vod_pic: data.pic || '',
            type_name: data.type || '',
            vod_year: data.year || '',
            vod_remarks: data.remarks || '',
            vod_content: data.content || '',
            vod_play_from: order.join('$$$'),
            vod_play_url: playUrls.join('$$$')
        }] };
    }
function _j(o) { try { return JSON.stringify(o); } catch (e) { return '{}'; } }
globalThis.__niviiSource = {init: function(ext) { globalThis.ext = ext || {}; },
home: function() { return _j(home()); },
homeVod: function() { return _j(homeVod()); },
category: function(tid, pg, filter, extend) { return _j(category(tid, pg, filter, extend)); },
detail: function(id) { return _j(detail(id)); },
related: function(id) {
            var r = shiziCall('GET', '/app/video/detail', {id: id}, null), d = (r && r.data) || {};
            var items = d.related || d.recommendations || d.related_videos || d.guesslike || d.similar || d.relate_list || [];
            if (!Array.isArray(items)) items = items.items || items.list || [];
            return _j({list: toVodList(items)});
        },
search: function(wd, quick, pg) { return _j(search(wd, quick, pg)); }};
})();
