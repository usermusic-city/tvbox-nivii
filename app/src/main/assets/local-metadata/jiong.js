// 4K1 metadata rules. Final playback resolution remains on the server.
globalThis.__niviiDetailRelatedVersion=1;
(function () {
    function str(v, fallback) { return v == null || v === '' ? (fallback || '') : String(v); }
    function call(path, query) { return JSON.parse(__niviiJiongCall(path, JSON.stringify(query || {}))); }
    function rows(r) {var d=r && r.data;return Array.isArray(d)?d:(d && (d.items || d.list || d.data) || []);}
    function complete(r) {return !!r && r.code===20000 && (Array.isArray(r.data) || !!r.data && ['items','list','data'].some(function(k){return Array.isArray(r.data[k]);}));}
    function cards(r) {return rows(r).filter(function(x){return x && typeof x==='object';}).map(function(x){return {vod_id:str(x.id),vod_name:str(x.name),vod_pic:str(x.pic),vod_remarks:str(x.continu,str(x.remarks)),type_name:str(x.type),vod_year:str(x.year)};});}
    function home() {
        var classes=[],filters={},names={'1':'日本动画','2':'国产动画','26':'动画电影'};
        rows(call('/app/channel',{'top-level':'true'})).forEach(function(c){
            if(!c || !c.id || !c.name || String(c.id)==='0')return;
            var id=str(c.id),fields=[];classes.push({type_id:id,type_name:names[id] || str(c.name)});
            [['types','type','类型'],['years','year','年份'],['areas','area','地区']].forEach(function(f){
                if(!Array.isArray(c[f[0]]))return;
                var seen={},choices=[{n:'全部',v:''}];
                c[f[0]].forEach(function(v){v=str(v).trim();if(v && !seen[v]){seen[v]=true;choices.push({n:v,v:v});}});
                if(choices.length>1)fields.push({key:f[1],name:f[2],init:'',value:choices});
            });
            fields.push({key:'sort',name:'排序',init:'addtime',value:[{n:'最新',v:'addtime'},{n:'热度',v:'hits'},{n:'推荐',v:'weight'}]});filters[id]=fields;
        });
        if(!classes.length)throw new Error('分类信息获取失败，请稍后重试');
        return {'class':classes,filters:filters};
    }
    function category(a) {
        var f=a.extend || {},page=Math.max(1,Number(a.page)||1),q={channel:str(a.tid,'0'),sort:str(f.sort,str(a.sort,'addtime')),limit:24,page:page};
        ['type','year','area'].forEach(function(k){var v=f[k]==null?a[k]:f[k];if(v)q[k]=str(v);});
        return {list:cards(call('/app/video/list',q)),page:page,pagecount:99};
    }
    function detail(a) {
        var id=str(a.id).trim();if(!id)throw new Error('id is required');
        var response=call('/app/video/detail',{id:id}), d=response.data || {},from=[],urls=[];
        (d.parts || []).forEach(function(g){if(!g)return;var play=str(g.play,'mp4'),eps=(g.part || []).map(function(p){p=str(p);return p+'$'+id+'||'+play+'||'+p;});if(eps.length){from.push(str(g.play_zh,play));urls.push(eps.join('#'));}});
        var v={vod_id:str(d.id,id),vod_play_from:from.join('$$$'),vod_play_url:urls.join('$$$')};
        [['vod_name','name'],['vod_alias','ename'],['vod_pic','pic'],['type_name','type'],['vod_year','year'],['vod_area','area'],['vod_actor','actor'],['vod_director','director'],['vod_content','content'],['vod_remarks','continu']].forEach(function(f){v[f[0]]=str(d[f[1]]);});
        function pick(x){return x && (x.related || x.recommendations || x.related_videos || x.guesslike || x.similar || x.relate_list);}
        v.related=cards({data:pick(d) || pick(response) || []});
        return {list:[v]};
    }
    function title(v){return __niviiNormalize(str(v),'title');}
    function episode(v){return __niviiNormalize(str(v),'episode');}
    function match(a) {
        var name=str(a.name).trim(),wanted=episode(a.episode),out=[],seen={},targets={},found=[],full=true;
        if(!name || !wanted)return {sources:out};
        for(var page=1;;page++){
            var r=call('/app/video/search',{key:name,limit:24,page:page});if(r.code!==20000)throw new Error('4K1 danmaku title search failed');
            full=full && complete(r);var batch=rows(r),fresh=0;
            batch.forEach(function(c){if(c && !seen[str(c.id)]){seen[str(c.id)]=true;found.push(c);fresh++;}});
            if(batch.length<24 || !fresh)break;
        }
        found.forEach(function(c){
            if(title(c.name)!==title(name))return;
            var id=str(c.id),r=call('/app/video/detail',{id:id}),groups=r.data && r.data.parts;
            full=full && r.code===20000 && Array.isArray(groups) && groups.length>0;
            (groups || []).forEach(function(g){(g.part || []).forEach(function(p){if(episode(p)!==wanted)return;var t={vid:id,play:str(g.play,'mp4'),part:str(p)},key=JSON.stringify(t);if(!targets[key]){targets[key]=true;out.push(t);}});});
        });
        return {sources:out,_localCacheComplete:!!full};
    }
    function segment(a) {
        var start=Math.max(0,Number(a.start)||0),end=Math.min(start+60000,Number(a.end)||start+60000),out=[],seen={},successes=0,full=true;
        (a.sources || []).forEach(function(s){
            var r;try{r=call('/app/danmu',{vid:str(s.vid),play:str(s.play),part:str(s.part),start_time_point:start,end_time_point:end});}catch(e){full=false;return;}
            if(r.code!==20000){full=false;return;}successes++;full=full && complete(r);
            rows(r).forEach(function(row){
                if(!row || typeof row!=='object')return;
                var p,raw=row.content || '';try{p=JSON.parse(raw);}catch(e){p={content:raw};}
                if(!p || typeof p!=='object' || Array.isArray(p))return;
                var text=str(p.content).trim(),time=Number(row.time_point || 0),color=Number(p.color || 4294967295);
                if(!isFinite(time)||!isFinite(color))return;
                time=time<0?Math.ceil(time):Math.floor(time);color=(color<0?Math.ceil(color):Math.floor(color))>>>0;
                var identity=JSON.stringify([time,text,color,str(row.uid)]);
                if(!text || time<start || time>=end || seen[identity])return;
                seen[identity]=true;out.push({time_ms:time,content:text,color:color,id:row.id==null?0:row.id,uid:row.uid==null?'':row.uid});
            });
        });
        if((a.sources || []).length && !successes)throw new Error('4K1 danmaku request failed');
        out.sort(function(a,b){return a.time_ms-b.time_ms;});return {items:out,_localCacheComplete:!!full};
    }
    globalThis.__niviiSource={read:function(action,a){
        if(action==='home_meta')return home();if(action==='category')return category(a);if(action==='detail')return detail(a);
        if(action==='related'){
            var result=call('/app/video/detail',{id:a.id}), d=result && result.data || {};
            var items=d.related || d.recommendations || d.related_videos || d.guesslike || d.similar || d.relate_list || [];
            return {list:cards({data:items})};
        }
        if(action==='danmaku_match')return match(a);if(action==='danmaku_segment')return segment(a);
        if(action==='search'){var key=str(a.keyword).trim(),page=Math.max(1,Number(a.page)||1);if(!key)throw new Error('keyword is required');return {list:cards(call('/app/video/search',{key:key,limit:24,page:page})),page:page,pagecount:99};}
        throw new Error('Unsupported metadata action');
    }};
})();
