const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
for(const file of fs.readdirSync(__dirname).filter(f=>f.endsWith('.js'))) {
  new vm.Script(read('mods/'+file), {filename:file});
}
// 搬移前檢查暫存包；搬移後自動檢查正式 static/。
const assetDir = fs.existsSync(path.join(root, 'static/js/main.d3867357.js')) ? 'static' : 'static/v3.0';
const bundle = read(assetDir + '/js/main.d3867357.js');
new vm.Script(bundle);
for (const match of bundle.matchAll(/"static\/(media\/[^"?]+)"/g)) {
  assert.ok(fs.existsSync(path.join(root, assetDir, match[1])), match[1]);
}
assert.ok(bundle.includes('"static/js/"'));
assert.ok(fs.existsSync(path.join(root, assetDir, 'js/488.5d587303.chunk.js')));
assert.ok(!bundle.includes('"static/v3.0/'));
const css = read(assetDir + '/css/main.f870afe0.css');
for (const match of css.matchAll(/url\((?:["']?)(\.\.\/media\/[^)"'?]+)(?:["']?)\)/g)) {
  assert.ok(fs.existsSync(path.resolve(root, assetDir, 'css', match[1])), match[1]);
}
const map = JSON.parse(read(assetDir + '/js/main.d3867357.js.map'));
const source = name => map.sourcesContent[map.sources.indexOf(name)];
assert.match(source('component/Actorcard.js'), /<FitText>\{actor\?\.level\}<\/FitText>/);
assert.match(source('lib/DCContext.js'), /cities,\s+setCities,/);
assert.match(source('pages/attacks/PortalMap.js'), /reward: true, reward_collected: false/);
// 實際執行等級工具，模擬 FitText 內文字更新，確認子元件未被刪除。
const text = {nodeValue:'30'};
let data = {level:30, level_cap:50};
const el = {className:'Actorcard_actorLv__test', dataset:{}, style:{}, nodeType:1,
  get textContent(){return text.nodeValue;},
  set textContent(_){throw new Error('不能移除 FitText');}, querySelectorAll:()=>[]};
let callbacks;
const level = {console, NodeFilter:{SHOW_TEXT:4}, document:{readyState:'complete',nodeType:9,
  querySelectorAll:()=>[el], createTreeWalker:()=>{let done=false;return {nextNode:()=>done?null:(done=true,text)};}},
  RFStore:{findData:()=>data}, UWSched:{register:x=>callbacks=x}, getComputedStyle:()=>({fontSize:'16px'})};
level.window=level;
vm.runInNewContext(read('mods/show_level_cap.js'),level);
assert.equal(text.nodeValue,'30/50');
data={level:31,level_cap:60};text.nodeValue='31';
callbacks.onText({closest:()=>el});
assert.equal(text.nodeValue,'31/60');
// 靜音音效仍呼叫原生 play，才能發出 ended；BGM 靜音則暫停。
let plays=0;
class Media {play(){plays++;return Promise.resolve();} pause(){this.paused=true;} addEventListener(){} }
class Audio extends Media {constructor(src){super();this.src=src;this.loop=false;this.volume=1;}}
const audio={console,URL,HTMLMediaElement:Media,HTMLAudioElement:Audio,
  document:{baseURI:'http://localhost/',readyState:'loading',addEventListener(){}},localStorage:{getItem:()=>null}};
audio.window=audio;
vm.runInNewContext(read('mods/rf_audio_panel.js'),audio);
const effect=new Audio('/audio/sound_effect/SE1.mp3');effect.play();
assert.equal(effect.volume,0);assert.equal(plays,1);
const music=new Audio('/audio/music/BGM10.mp3');music.loop=true;music.play();
assert.equal(plays,1);assert.equal(music.paused,true);
// 載入器把遊戲排在工具後，所有動態腳本均依序執行。
const scripts=[];
const loader={console,URL,localStorage:{getItem:()=>null},document:{readyState:'loading',
  currentScript:{src:'http://localhost/mods/loader.js',dataset:{main:'../static/js/main.d3867357.js'}},
  createElement:tag=>({tag,dataset:{}}),head:{appendChild:el=>{if(el.tag==='script') scripts.push(el);}},addEventListener(){}}};
loader.window=loader;
vm.runInNewContext(read('mods/loader.js'),loader);
assert.equal(scripts.at(-1).src,'http://localhost/static/js/main.d3867357.js');
assert.match(read('index.html'), /data-main="\.\.\/static\/js\/main\.d3867357\.js"/);
assert.match(read('index.html'), /href="\.\/static\/css\/main\.f870afe0\.css"/);
assert.ok(scripts.every(s=>s.async===false));
console.log('PASS: v3.0 資源、資料契約、FitText 更新、靜音完成流程、載入順序');
