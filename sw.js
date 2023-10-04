(()=>{"use strict";var e={913:()=>{try{self["workbox:core:6.5.2"]&&_()}catch(e){}},977:()=>{try{self["workbox:precaching:6.5.2"]&&_()}catch(e){}},80:()=>{try{self["workbox:routing:6.5.2"]&&_()}catch(e){}},873:()=>{try{self["workbox:strategies:6.5.2"]&&_()}catch(e){}}},t={};function s(a){var n=t[a];if(void 0!==n)return n.exports;var i=t[a]={exports:{}};return e[a](i,i.exports,s),i.exports}(()=>{s(913);const e=(e,...t)=>{let s=e;return t.length>0&&(s+=` :: ${JSON.stringify(t)}`),s};class t extends Error{constructor(t,s){super(e(t,s)),this.name=t,this.details=s}}const a={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:"undefined"!=typeof registration?registration.scope:""},n=e=>[a.prefix,e,a.suffix].filter((e=>e&&e.length>0)).join("-"),i=e=>e||n(a.precache),r=e=>e||n(a.runtime);function c(e,t){const s=t();return e.waitUntil(s),s}s(977);function o(e){if(!e)throw new t("add-to-cache-list-unexpected-type",{entry:e});if("string"==typeof e){const t=new URL(e,location.href);return{cacheKey:t.href,url:t.href}}const{revision:s,url:a}=e;if(!a)throw new t("add-to-cache-list-unexpected-type",{entry:e});if(!s){const e=new URL(a,location.href);return{cacheKey:e.href,url:e.href}}const n=new URL(a,location.href),i=new URL(a,location.href);return n.searchParams.set("__WB_REVISION__",s),{cacheKey:n.href,url:i.href}}class h{constructor(){this.updatedURLs=[],this.notUpdatedURLs=[],this.handlerWillStart=async({request:e,state:t})=>{t&&(t.originalRequest=e)},this.cachedResponseWillBeUsed=async({event:e,state:t,cachedResponse:s})=>{if("install"===e.type&&t&&t.originalRequest&&t.originalRequest instanceof Request){const e=t.originalRequest.url;s?this.notUpdatedURLs.push(e):this.updatedURLs.push(e)}return s}}}class l{constructor({precacheController:e}){this.cacheKeyWillBeUsed=async({request:e,params:t})=>{const s=(null==t?void 0:t.cacheKey)||this._precacheController.getCacheKeyForURL(e.url);return s?new Request(s,{headers:e.headers}):e},this._precacheController=e}}let u;async function f(e,s){let a=null;if(e.url){a=new URL(e.url).origin}if(a!==self.location.origin)throw new t("cross-origin-copy-response",{origin:a});const n=e.clone(),i={headers:new Headers(n.headers),status:n.status,statusText:n.statusText},r=s?s(i):i,c=function(){if(void 0===u){const e=new Response("");if("body"in e)try{new Response(e.body),u=!0}catch(e){u=!1}u=!1}return u}()?n.body:await n.blob();return new Response(c,r)}function d(e,t){const s=new URL(e);for(const e of t)s.searchParams.delete(e);return s.href}class p{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}const g=new Set;s(873);function y(e){return"string"==typeof e?new Request(e):e}class w{constructor(e,t){this._cacheKeys={},Object.assign(this,t),this.event=t.event,this._strategy=e,this._handlerDeferred=new p,this._extendLifetimePromises=[],this._plugins=[...e.plugins],this._pluginStateMap=new Map;for(const e of this._plugins)this._pluginStateMap.set(e,{});this.event.waitUntil(this._handlerDeferred.promise)}async fetch(e){const{event:s}=this;let a=y(e);if("navigate"===a.mode&&s instanceof FetchEvent&&s.preloadResponse){const e=await s.preloadResponse;if(e)return e}const n=this.hasCallback("fetchDidFail")?a.clone():null;try{for(const e of this.iterateCallbacks("requestWillFetch"))a=await e({request:a.clone(),event:s})}catch(e){if(e instanceof Error)throw new t("plugin-error-request-will-fetch",{thrownErrorMessage:e.message})}const i=a.clone();try{let e;e=await fetch(a,"navigate"===a.mode?void 0:this._strategy.fetchOptions);for(const t of this.iterateCallbacks("fetchDidSucceed"))e=await t({event:s,request:i,response:e});return e}catch(e){throw n&&await this.runCallbacks("fetchDidFail",{error:e,event:s,originalRequest:n.clone(),request:i.clone()}),e}}async fetchAndCachePut(e){const t=await this.fetch(e),s=t.clone();return this.waitUntil(this.cachePut(e,s)),t}async cacheMatch(e){const t=y(e);let s;const{cacheName:a,matchOptions:n}=this._strategy,i=await this.getCacheKey(t,"read"),r=Object.assign(Object.assign({},n),{cacheName:a});s=await caches.match(i,r);for(const e of this.iterateCallbacks("cachedResponseWillBeUsed"))s=await e({cacheName:a,matchOptions:n,cachedResponse:s,request:i,event:this.event})||void 0;return s}async cachePut(e,s){const a=y(e);var n;await(n=0,new Promise((e=>setTimeout(e,n))));const i=await this.getCacheKey(a,"write");if(!s)throw new t("cache-put-with-no-response",{url:(r=i.url,new URL(String(r),location.href).href.replace(new RegExp(`^${location.origin}`),""))});var r;const c=await this._ensureResponseSafeToCache(s);if(!c)return!1;const{cacheName:o,matchOptions:h}=this._strategy,l=await self.caches.open(o),u=this.hasCallback("cacheDidUpdate"),f=u?await async function(e,t,s,a){const n=d(t.url,s);if(t.url===n)return e.match(t,a);const i=Object.assign(Object.assign({},a),{ignoreSearch:!0}),r=await e.keys(t,i);for(const t of r)if(n===d(t.url,s))return e.match(t,a)}(l,i.clone(),["__WB_REVISION__"],h):null;try{await l.put(i,u?c.clone():c)}catch(e){if(e instanceof Error)throw"QuotaExceededError"===e.name&&await async function(){for(const e of g)await e()}(),e}for(const e of this.iterateCallbacks("cacheDidUpdate"))await e({cacheName:o,oldResponse:f,newResponse:c.clone(),request:i,event:this.event});return!0}async getCacheKey(e,t){const s=`${e.url} | ${t}`;if(!this._cacheKeys[s]){let a=e;for(const e of this.iterateCallbacks("cacheKeyWillBeUsed"))a=y(await e({mode:t,request:a,event:this.event,params:this.params}));this._cacheKeys[s]=a}return this._cacheKeys[s]}hasCallback(e){for(const t of this._strategy.plugins)if(e in t)return!0;return!1}async runCallbacks(e,t){for(const s of this.iterateCallbacks(e))await s(t)}*iterateCallbacks(e){for(const t of this._strategy.plugins)if("function"==typeof t[e]){const s=this._pluginStateMap.get(t),a=a=>{const n=Object.assign(Object.assign({},a),{state:s});return t[e](n)};yield a}}waitUntil(e){return this._extendLifetimePromises.push(e),e}async doneWaiting(){let e;for(;e=this._extendLifetimePromises.shift();)await e}destroy(){this._handlerDeferred.resolve(null)}async _ensureResponseSafeToCache(e){let t=e,s=!1;for(const e of this.iterateCallbacks("cacheWillUpdate"))if(t=await e({request:this.request,response:t,event:this.event})||void 0,s=!0,!t)break;return s||t&&200!==t.status&&(t=void 0),t}}class _ extends class{constructor(e={}){this.cacheName=r(e.cacheName),this.plugins=e.plugins||[],this.fetchOptions=e.fetchOptions,this.matchOptions=e.matchOptions}handle(e){const[t]=this.handleAll(e);return t}handleAll(e){e instanceof FetchEvent&&(e={event:e,request:e.request});const t=e.event,s="string"==typeof e.request?new Request(e.request):e.request,a="params"in e?e.params:void 0,n=new w(this,{event:t,request:s,params:a}),i=this._getResponse(n,s,t);return[i,this._awaitComplete(i,n,s,t)]}async _getResponse(e,s,a){let n;await e.runCallbacks("handlerWillStart",{event:a,request:s});try{if(n=await this._handle(s,e),!n||"error"===n.type)throw new t("no-response",{url:s.url})}catch(t){if(t instanceof Error)for(const i of e.iterateCallbacks("handlerDidError"))if(n=await i({error:t,event:a,request:s}),n)break;if(!n)throw t}for(const t of e.iterateCallbacks("handlerWillRespond"))n=await t({event:a,request:s,response:n});return n}async _awaitComplete(e,t,s,a){let n,i;try{n=await e}catch(i){}try{await t.runCallbacks("handlerDidRespond",{event:a,request:s,response:n}),await t.doneWaiting()}catch(e){e instanceof Error&&(i=e)}if(await t.runCallbacks("handlerDidComplete",{event:a,request:s,response:n,error:i}),t.destroy(),i)throw i}}{constructor(e={}){e.cacheName=i(e.cacheName),super(e),this._fallbackToNetwork=!1!==e.fallbackToNetwork,this.plugins.push(_.copyRedirectedCacheableResponsesPlugin)}async _handle(e,t){const s=await t.cacheMatch(e);return s||(t.event&&"install"===t.event.type?await this._handleInstall(e,t):await this._handleFetch(e,t))}async _handleFetch(e,s){let a;const n=s.params||{};if(!this._fallbackToNetwork)throw new t("missing-precache-entry",{cacheName:this.cacheName,url:e.url});{0;const t=n.integrity,i=e.integrity,r=!i||i===t;if(a=await s.fetch(new Request(e,{integrity:i||t})),t&&r){this._useDefaultCacheabilityPluginIfNeeded();await s.cachePut(e,a.clone());0}}return a}async _handleInstall(e,s){this._useDefaultCacheabilityPluginIfNeeded();const a=await s.fetch(e);if(!await s.cachePut(e,a.clone()))throw new t("bad-precaching-response",{url:e.url,status:a.status});return a}_useDefaultCacheabilityPluginIfNeeded(){let e=null,t=0;for(const[s,a]of this.plugins.entries())a!==_.copyRedirectedCacheableResponsesPlugin&&(a===_.defaultPrecacheCacheabilityPlugin&&(e=s),a.cacheWillUpdate&&t++);0===t?this.plugins.push(_.defaultPrecacheCacheabilityPlugin):t>1&&null!==e&&this.plugins.splice(e,1)}}_.defaultPrecacheCacheabilityPlugin={cacheWillUpdate:async({response:e})=>!e||e.status>=400?null:e},_.copyRedirectedCacheableResponsesPlugin={cacheWillUpdate:async({response:e})=>e.redirected?await f(e):e};class v{constructor({cacheName:e,plugins:t=[],fallbackToNetwork:s=!0}={}){this._urlsToCacheKeys=new Map,this._urlsToCacheModes=new Map,this._cacheKeysToIntegrities=new Map,this._strategy=new _({cacheName:i(e),plugins:[...t,new l({precacheController:this})],fallbackToNetwork:s}),this.install=this.install.bind(this),this.activate=this.activate.bind(this)}get strategy(){return this._strategy}precache(e){this.addToCacheList(e),this._installAndActiveListenersAdded||(self.addEventListener("install",this.install),self.addEventListener("activate",this.activate),this._installAndActiveListenersAdded=!0)}addToCacheList(e){const s=[];for(const a of e){"string"==typeof a?s.push(a):a&&void 0===a.revision&&s.push(a.url);const{cacheKey:e,url:n}=o(a),i="string"!=typeof a&&a.revision?"reload":"default";if(this._urlsToCacheKeys.has(n)&&this._urlsToCacheKeys.get(n)!==e)throw new t("add-to-cache-list-conflicting-entries",{firstEntry:this._urlsToCacheKeys.get(n),secondEntry:e});if("string"!=typeof a&&a.integrity){if(this._cacheKeysToIntegrities.has(e)&&this._cacheKeysToIntegrities.get(e)!==a.integrity)throw new t("add-to-cache-list-conflicting-integrities",{url:n});this._cacheKeysToIntegrities.set(e,a.integrity)}if(this._urlsToCacheKeys.set(n,e),this._urlsToCacheModes.set(n,i),s.length>0){const e=`Workbox is precaching URLs without revision info: ${s.join(", ")}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(e)}}}install(e){return c(e,(async()=>{const t=new h;this.strategy.plugins.push(t);for(const[t,s]of this._urlsToCacheKeys){const a=this._cacheKeysToIntegrities.get(s),n=this._urlsToCacheModes.get(t),i=new Request(t,{integrity:a,cache:n,credentials:"same-origin"});await Promise.all(this.strategy.handleAll({params:{cacheKey:s},request:i,event:e}))}const{updatedURLs:s,notUpdatedURLs:a}=t;return{updatedURLs:s,notUpdatedURLs:a}}))}activate(e){return c(e,(async()=>{const e=await self.caches.open(this.strategy.cacheName),t=await e.keys(),s=new Set(this._urlsToCacheKeys.values()),a=[];for(const n of t)s.has(n.url)||(await e.delete(n),a.push(n.url));return{deletedURLs:a}}))}getURLsToCacheKeys(){return this._urlsToCacheKeys}getCachedURLs(){return[...this._urlsToCacheKeys.keys()]}getCacheKeyForURL(e){const t=new URL(e,location.href);return this._urlsToCacheKeys.get(t.href)}getIntegrityForCacheKey(e){return this._cacheKeysToIntegrities.get(e)}async matchPrecache(e){const t=e instanceof Request?e.url:e,s=this.getCacheKeyForURL(t);if(s){return(await self.caches.open(this.strategy.cacheName)).match(s)}}createHandlerBoundToURL(e){const s=this.getCacheKeyForURL(e);if(!s)throw new t("non-precached-url",{url:e});return t=>(t.request=new Request(e),t.params=Object.assign({cacheKey:s},t.params),this.strategy.handle(t))}}s(80);(async()=>{const e=function(){const e=JSON.parse(new URLSearchParams(self.location.search).get("params"));return e.debug&&console.log("[Docusaurus-PWA][SW]: Service Worker params:",e),e}(),t=[{"revision":"5cde87e0c856ea2eab523f827e3b315d","url":"404.html"},{"revision":"a09a68a1bdce771b80292ab3296b89b9","url":"A-Introduction/compilation-and-execution.html"},{"revision":"008d8573c4258e476cd96cdf41522914","url":"A-Introduction/cpp-building-blocks.html"},{"revision":"d9c4d09a45d20171607cec7e89e53e38","url":"A-Introduction/overview.html"},{"revision":"95857cd7876e4113723f8be0e38ad48f","url":"assets/css/styles.4437d4cc.css"},{"revision":"a2e33fdd08ed53e7420df30852e886ca","url":"assets/js/04ec5033.2f9fd679.js"},{"revision":"cbb05dbb7718f778b57c8daa7578d2e6","url":"assets/js/07041aed.9111f975.js"},{"revision":"20767d9aae6c16e0689e3e4b197d13fb","url":"assets/js/0e384e19.3388f3b7.js"},{"revision":"42cbed81bfed2cd7bfea0d5369cfe88e","url":"assets/js/0fe3804c.c03a0ba2.js"},{"revision":"7606235723c160ecf3c3934b8eee3345","url":"assets/js/129ae20a.9704cc4d.js"},{"revision":"3a91900f0e5ab80fe15cc987624b05b1","url":"assets/js/131.1a826c55.js"},{"revision":"977d9f0b9b5fe8635761173f315be8e7","url":"assets/js/15a20f2a.0281d175.js"},{"revision":"c115f120fc090281a20a73ca771212d2","url":"assets/js/17896441.96cd5678.js"},{"revision":"f65089a37dd26aa895514aaccdec614a","url":"assets/js/17d97401.10bcdaa9.js"},{"revision":"06c5d995fdac87984495e1bf6169bab0","url":"assets/js/1be78505.618f3790.js"},{"revision":"d4aae326f341e07a2f01275bd45a6954","url":"assets/js/2005e4d5.e9ff68e0.js"},{"revision":"d4aaeee43fbaebb3e9c5c94ef16b09b2","url":"assets/js/283.c6b4d580.js"},{"revision":"8615abf25816a9ff0deaa79931c4fb72","url":"assets/js/32b60c02.9d9b4449.js"},{"revision":"bad7186e192bd0d90e8ef43b44b6834e","url":"assets/js/335a152a.fd844e9a.js"},{"revision":"21b63b42001de95985d2b321c61189ef","url":"assets/js/4718124c.0d0c1680.js"},{"revision":"0c4de7072e6f8665c04b47946a2973d5","url":"assets/js/4d7ab22d.977b1272.js"},{"revision":"eb457a65fd7f9ea65924ebb1557721fa","url":"assets/js/4ded2802.79df1d13.js"},{"revision":"56ba3722b309fcd8124c091643e9d8b9","url":"assets/js/50a2f903.4f0f889a.js"},{"revision":"ef8e117dd05665d1d9878fb0acde8433","url":"assets/js/539.53b348ba.js"},{"revision":"0fc5f9689a0a73b697a1047838100ed7","url":"assets/js/5d6d29a0.aed6fa6b.js"},{"revision":"e4c8e6c0dfb0e0dab36f417956a4fa45","url":"assets/js/6ecdb084.e11fffde.js"},{"revision":"600187a9689793bb0164177cd727ecfa","url":"assets/js/6edd9ff2.c960e90a.js"},{"revision":"d7038ee1dadcd482314077ab8fbc6b2b","url":"assets/js/73cefa48.9f73233e.js"},{"revision":"01f2d3a13752ccee99421ead8994fc53","url":"assets/js/8401227c.da243c68.js"},{"revision":"51da257d4bbfbef50244ad0d149be795","url":"assets/js/85493427.2a42a6bf.js"},{"revision":"43b98856d215c3f3dfa470257a5d3423","url":"assets/js/935f2afb.f2d583ea.js"},{"revision":"d39bf3159579ac1d94163d6336bfc604","url":"assets/js/944e1f91.29ab1440.js"},{"revision":"fef4648126865fb166dd97ac70288df9","url":"assets/js/96c1f1a2.722dd0bc.js"},{"revision":"18b3e39b712ce3a0e637aebd4c5e676e","url":"assets/js/972.e92e0503.js"},{"revision":"5894af70e3740a1b519cf0b96cff318f","url":"assets/js/a5b178df.4376b0c4.js"},{"revision":"9e9b27dbcba754d89a474a318d937a7f","url":"assets/js/a6573247.2877eb57.js"},{"revision":"7c4af2aecb2164658714f8fbac127f27","url":"assets/js/a80ffcf9.9872abba.js"},{"revision":"eb23791fb657f83acf86a4fbef2020aa","url":"assets/js/a9735876.408a66c8.js"},{"revision":"81732e4571f8ca1adbc1e367de66e704","url":"assets/js/aa0d2e22.874bf989.js"},{"revision":"5cff9adc920f08bb19ff0c1e7e378dc3","url":"assets/js/abdd60e0.aa9d2187.js"},{"revision":"1dd970fb6d26c1ecade2d0f4bb9dfab7","url":"assets/js/ad238542.20eba86a.js"},{"revision":"a0fa0d5583843514a796ce4deb5825f0","url":"assets/js/b16ad6ce.cadbf7b9.js"},{"revision":"b632c26d9acc2b5e126516c6e2a5b734","url":"assets/js/b2160f54.7ef0a029.js"},{"revision":"d8b376c885516237826c801e75ab0f34","url":"assets/js/d456dc5b.69562987.js"},{"revision":"fc9241c0165e35fbacf5a7f26c126aca","url":"assets/js/d4a8d3f9.6f59d0d1.js"},{"revision":"4fce6ef1d368c585987a2e494919bd1e","url":"assets/js/dec842a7.2c1ddd13.js"},{"revision":"afddfaf17c66b723f23104d4c18d279c","url":"assets/js/f65098e1.7737c850.js"},{"revision":"63ca76d2c5972d954e2bf9683dae5e57","url":"assets/js/main.c82fd425.js"},{"revision":"ddb4ff752dae9264b6832eaf89ba5e43","url":"assets/js/runtime~main.74e04ef6.js"},{"revision":"6ffd64e131f0ad07a965e219538a3807","url":"B-Types/classes-and-scoped-enumerations.html"},{"revision":"9d0e4c82cc3269b3d5b2b0e768649b67","url":"B-Types/fundamental-types.html"},{"revision":"8a7466a1fc647a53df1238230d2b7374","url":"B-Types/pointers-references-and-arrays.html"},{"revision":"ad5501b9837602b723e59de92dedb12f","url":"C-Class-Relationships/class-templates.html"},{"revision":"7a40fb6e97f2e348e05c65188a90b163","url":"C-Class-Relationships/compositions-aggregations-and-associations.html"},{"revision":"2110f4733cd443612b1c84951a84b0c5","url":"C-Class-Relationships/inheritance-and-inclusion-polymorphism.html"},{"revision":"e3de9b1d2fab4855d1a2596f29c02ede","url":"D-Processing/error-handling.html"},{"revision":"d8222555430b791d852ad05c2a43d5f1","url":"D-Processing/expressions.html"},{"revision":"26ad629979e77d7b220a182b93c1540d","url":"D-Processing/functions.html"},{"revision":"52d09be8d207a70612dc6c3eaa3ea177","url":"E-STL/algorithms.html"},{"revision":"a35f0bd5b45f42044583112e609c9ff7","url":"E-STL/containers-and-iterations.html"},{"revision":"fe247d854a1cacb344bd69553df151ef","url":"E-STL/file-stream-objects.html"},{"revision":"b98ed0903236abf1944ed117795c518d","url":"E-STL/standard-library.html"},{"revision":"53d09a994a783ff0b3424ec2d2547757","url":"F-MemoryModel/raw-pointers.html"},{"revision":"1ae69b4d9cd2ab92ca9a859312a22063","url":"F-MemoryModel/smart-pointers.html"},{"revision":"977318665eed449c9eff8695c42d6586","url":"G-Performance/multithreading.html"},{"revision":"480cebc9765d726cde50fedf61ca3972","url":"G-Performance/thread-classes.html"},{"revision":"ff2687900d32b17ac01c2d5f26ec32fe","url":"H-Deeper-Detail/arrays-and-pointers.html"},{"revision":"1385241b0f54c8e328007c9946966499","url":"H-Deeper-Detail/bit-wise-expressions.html"},{"revision":"ee6f10599ac6c9552a284e7f328bf2ad","url":"H-Deeper-Detail/linked-list-technology.html"},{"revision":"4507167c6aba67ce6cfccf980b8aa41e","url":"H-Deeper-Detail/multiple-inheritance.html"},{"revision":"5842e3446d1d47954539cf35a389450f","url":"H-Deeper-Detail/other-topics.html"},{"revision":"f6f4a1c5811c47622215f8acf8edb456","url":"H-Deeper-Detail/pre-processor-directives.html"},{"revision":"3e66f4f751cbd32a6b11f990e09634d3","url":"index.html"},{"revision":"4b91025dfd69a28daaea5e47b7b97846","url":"manifest.json"},{"revision":"9a0beb67797f302ff72506eea4740ee0","url":"Resources-Appendices/c-and-cpp.html"},{"revision":"09a1819741429ea3e24fb7454fa0853a","url":"Resources-Appendices/c-libraries.html"},{"revision":"55f3a36d18618c251c46eae87ed9efa8","url":"Resources-Appendices/doubly-linked-list.html"},{"revision":"40093379fdcf828138948ada0a726420","url":"Resources-Appendices/platform-io-dependencies.html"},{"revision":"6161440c3251d9767df958d54a64df2b","url":"Resources-Appendices/sample-code-index.html"},{"revision":"e4479614256d552f9f08fa4a397e40e0","url":"Resources-Appendices/sample-code-repository.html"},{"revision":"2fc713c2244221de1b24feb89c6adec0","url":"Resources-Appendices/string-class.html"},{"revision":"d7a1f7988c997ab1c9bf3592047b16ac","url":"assets/images/2darray-74139ff309f6d4c04b2dc7115e75c9ac.png"},{"revision":"2411f4d9cb25e49d0333897fe549360e","url":"assets/images/abstract-e87418a3c620d22e45e391431822f4f1.svg"},{"revision":"0e1dd396a32b777717c0512385b5608a","url":"assets/images/application-ad7d21941338fc7ad1a799b316c9a179.png"},{"revision":"094f571f9521d6948882765df1d1d0ed","url":"assets/images/chain_r-aa4a4faf72e9ce98080fe977a325735c.png"},{"revision":"e70a1ef66f87603f2c8e44a9e133c3cf","url":"assets/images/chain-f06a6a86627e423f3b57545f46fd0d19.png"},{"revision":"394ac96260530d2142316d86b94f853d","url":"assets/images/compatibility-08c5e725f1a06d8735f6cefe35c1994f.png"},{"revision":"ab7eea6f475a4520de09ed4e4c3ac31f","url":"assets/images/compile_link-34029fc124e56e275b31d5a1fa19424a.png"},{"revision":"956622e59a7bde6275f0f9d6e8d2f521","url":"assets/images/console-7c686ad8db2b8a60eb2d2374aecc1f0d.png"},{"revision":"ed05ff439032709973dbee13f6fdd244","url":"assets/images/containers-9824cf5eb8763bd5e38733ec391a3293.png"},{"revision":"5f2ad1f8fbaaf27363b514eed7484aac","url":"assets/images/duplicate-1b0f1b1e8944bcd198661dbdd35fad74.png"},{"revision":"b2c81e58bb56f4cdabbbbe0b36363140","url":"assets/images/expressions-c5e9ed5288bc895ce1fea799ccd8bbad.svg"},{"revision":"6d5bdb179012124a375beec004a48db6","url":"assets/images/fstream-bac67f50faf8263a32fbe36433c9796d.png"},{"revision":"953d6d3b8c9fcf1b360a5cd105cae4f7","url":"assets/images/future-c5a76a02c68df33889aab4d113efddb7.png"},{"revision":"f6fd187a72b46f2a2a877b10e14408fd","url":"assets/images/library-537cb80dc8f20c03356e7243a0ac156a.png"},{"revision":"dd1135d2213dfe3446eba94f22a575cb","url":"assets/images/linkage_external-b2fd11726529ea75596ad716e0001349.png"},{"revision":"0fa31c0fe19aab5fcc8d43b6cc7a2b63","url":"assets/images/linkage_internal-47cd965eaa5f97c4e8ec58c0653f59de.png"},{"revision":"119cc15daac59537fa2633eefd6665c8","url":"assets/images/memory_organization-68aacb2b898703372f787f9d74aee847.png"},{"revision":"b8e997e0776fc36ea549f3be0c522195","url":"assets/images/memory-1c96bdc4575afb11f5ba4f834576ad1e.png"},{"revision":"9ee7b844946ceefa796893a73714c70a","url":"assets/images/queue-63c241a91c08066e4f1f17a2a4aecd87.png"},{"revision":"715c56a88a98e4f4e99d305cdab9c962","url":"assets/images/ragged-84057acac116a299bea66a5dbb3f3ae3.png"},{"revision":"5120c18671a96a107bf8b3d042dd8c3e","url":"assets/images/smart-400a54c5828dfe3a0af7c583defe0937.png"},{"revision":"b2f641277d84babc03f65bad7d69719f","url":"assets/images/stack-955372f70b57b75d39e7f678a6661c1f.png"},{"revision":"7a15e40aa188f2b9579cdd4ffbe2bd4a","url":"assets/images/stl-0ffb9650ff3732ee9e63df830990335d.png"},{"revision":"ffc04ba610b60acae25433eecd2a1001","url":"assets/images/thread-fb8a4cf0ac36813533e5659190d6ab08.png"},{"revision":"f834a99eddc3774eae27b78d303595cf","url":"assets/images/type_bool-1bc4267cb8c9cf72f6c9f25c0255314c.png"},{"revision":"40e178ba8da0d685de73b29b41c516e7","url":"assets/images/type_char-196410978fb38302f7951a44481a8f9f.png"},{"revision":"9158d353586a73caa0302b4e1da79f6f","url":"assets/images/type_double_representation_1-ac3c55c2308dfec8200a5a7757188cc1.png"},{"revision":"fc08c55ff6a66097f8563cfd43a19966","url":"assets/images/type_double_representation_2-5b8c5dd02cb89c25ba81bd784c45a768.png"},{"revision":"acfbf1a2cbd405318aa4c633cf679fd1","url":"assets/images/type_double-2dfca291b915dce6fee38e4f1f0584d6.png"},{"revision":"3d397fb5c20ed8a933051222d91699a8","url":"assets/images/type_float_representation_1-7142cea70e469687f15ad686c48a41e3.png"},{"revision":"89d027777732480bec6c4db59d13e924","url":"assets/images/type_float_representation_2-59b2499d902defff389916273e3661df.png"},{"revision":"e36a225cd4a5e3567b68d9ddee391159","url":"assets/images/type_float-c4398fa44e7d7c6bcff6f87b8f8ef7b2.png"},{"revision":"f3353ac8c82a1ca5cd6c0ade42a2b17a","url":"assets/images/type_int-b04deb28b0b45490fcb1e70f8466d8ad.png"},{"revision":"afd33ce4c06791f3f14d1dbc7e96c4bc","url":"assets/images/type_ldouble-d1bb54f9c07d107538a60bc98674e030.png"},{"revision":"4313138006a5841708acd899745296c6","url":"assets/images/type_lint-e465633ff2b506a17282f022983dbd21.png"},{"revision":"1bc73b8665fae667a62f2136dfa2ec08","url":"assets/images/type_llint-71d1b9aaf9c0d7d951291f760df185fd.png"},{"revision":"57c63936ff9a47919590c673f8d2391e","url":"assets/images/type_schar-0acd2e8142b7498f0dddfcd73296d739.png"},{"revision":"472d7787c3ec4de712a795270e9203ed","url":"assets/images/type_sint-e2da56bec122ce266521c621cb29b0b1.png"},{"revision":"cdb85df4b857a20ebf701fd92ecac375","url":"assets/images/types-a4518f30c030323ea4d65fa013392c7a.png"},{"revision":"22c305528a7be287e59e9a9a754a82d4","url":"assets/images/virtual-e06f54f451bb1d644e0b036f9e995e08.png"},{"revision":"5f707198a2504ab5a22a56884a95541a","url":"assets/images/wfstream-53fbaf4079267b3eb80fb27b42adf75a.png"},{"revision":"d7a1f7988c997ab1c9bf3592047b16ac","url":"img/2darray.png"},{"revision":"2411f4d9cb25e49d0333897fe549360e","url":"img/abstract.svg"},{"revision":"d34440f596aadfdfa390763f31666503","url":"img/aggregation.svg"},{"revision":"0e1dd396a32b777717c0512385b5608a","url":"img/application.png"},{"revision":"a595997f70f60b16fb972a5e3c6bd2a9","url":"img/association.svg"},{"revision":"094f571f9521d6948882765df1d1d0ed","url":"img/chain_r.png"},{"revision":"e70a1ef66f87603f2c8e44a9e133c3cf","url":"img/chain.png"},{"revision":"e74fccf74795df7bc7c38003ed1b2f36","url":"img/click-to-select-region.png"},{"revision":"394ac96260530d2142316d86b94f853d","url":"img/compatibility.png"},{"revision":"ab7eea6f475a4520de09ed4e4c3ac31f","url":"img/compile_link.png"},{"revision":"657aa6f719c334417b25a4d6ae708257","url":"img/composition.svg"},{"revision":"956622e59a7bde6275f0f9d6e8d2f521","url":"img/console.png"},{"revision":"ed05ff439032709973dbee13f6fdd244","url":"img/containers.png"},{"revision":"258d5a63f399a09d8924a0526aeceec2","url":"img/coordinates.png"},{"revision":"8a8617ff0102c10ad02bbec3c953b21b","url":"img/deque.png"},{"revision":"d193f08827c21ed94fb14a75e44b97c2","url":"img/diamond.png"},{"revision":"7fa1a026116afe175cae818030d4ffc4","url":"img/docusaurus.png"},{"revision":"fec4b6524d0b89466b26d042654620b9","url":"img/doubly.png"},{"revision":"5f2ad1f8fbaaf27363b514eed7484aac","url":"img/duplicate.png"},{"revision":"b2c81e58bb56f4cdabbbbe0b36363140","url":"img/expressions.svg"},{"revision":"ef2266bfb84465c731756b58cde0afb8","url":"img/favicon.ico"},{"revision":"6d5bdb179012124a375beec004a48db6","url":"img/fstream.png"},{"revision":"953d6d3b8c9fcf1b360a5cd105cae4f7","url":"img/future.png"},{"revision":"f6fd187a72b46f2a2a877b10e14408fd","url":"img/library.png"},{"revision":"dd1135d2213dfe3446eba94f22a575cb","url":"img/linkage_external.png"},{"revision":"0fa31c0fe19aab5fcc8d43b6cc7a2b63","url":"img/linkage_internal.png"},{"revision":"44d767784e833f199a48125b83af2177","url":"img/linkage_none.png"},{"revision":"22c6eb8088b86099d5a78b5a13f7b24d","url":"img/logo-dark.svg"},{"revision":"8817e00103e8837d17c2758b0ce25c41","url":"img/logo.svg"},{"revision":"119cc15daac59537fa2633eefd6665c8","url":"img/memory_organization.png"},{"revision":"b8e997e0776fc36ea549f3be0c522195","url":"img/memory.png"},{"revision":"84313baa32ef7046043ceba6fd7203cd","url":"img/multiple.png"},{"revision":"19aef25c1d412e6ce19b2e21c67a19b0","url":"img/nested-functions.svg"},{"revision":"8c4e63fd680a0175a0bdf050ed145cdf","url":"img/nodes.png"},{"revision":"e6c6611e4b2b60489c136df1b3bb1c8f","url":"img/process.png"},{"revision":"2e1cb1ba37fc5ae886ea57248bdb60bd","url":"img/pwa/icon-192x192.png"},{"revision":"a0f8ed72d3d3489353a57a03aeac9b0d","url":"img/pwa/icon-256x256.png"},{"revision":"ab9ed19e2716b5c233d6132d66204d53","url":"img/pwa/icon-384x384.png"},{"revision":"b71acc5b894ccfac0c22eb39a590f2a0","url":"img/pwa/icon-512x512.png"},{"revision":"9ee7b844946ceefa796893a73714c70a","url":"img/queue.png"},{"revision":"715c56a88a98e4f4e99d305cdab9c962","url":"img/ragged.png"},{"revision":"95c2331d1d5498250d198d4ca5f89290","url":"img/replicated.png"},{"revision":"1f66560301a2d19aa20cfc0847a046e8","url":"img/shape.svg"},{"revision":"5120c18671a96a107bf8b3d042dd8c3e","url":"img/smart.png"},{"revision":"b2f641277d84babc03f65bad7d69719f","url":"img/stack.png"},{"revision":"7a15e40aa188f2b9579cdd4ffbe2bd4a","url":"img/stl.png"},{"revision":"3519dc7918811144d74add58e6dc4ce6","url":"img/subobject.png"},{"revision":"ffc04ba610b60acae25433eecd2a1001","url":"img/thread.png"},{"revision":"b9d9189ed8f8dd58e70d9f8b3f693b3e","url":"img/tutorial/docsVersionDropdown.png"},{"revision":"c14bff79aafafca0957ccc34ee026e2c","url":"img/tutorial/localeDropdown.png"},{"revision":"f834a99eddc3774eae27b78d303595cf","url":"img/type_bool.png"},{"revision":"40e178ba8da0d685de73b29b41c516e7","url":"img/type_char.png"},{"revision":"0bf4f62c8e1e25f343da9d1ccdcd80fd","url":"img/type_definition.png"},{"revision":"9158d353586a73caa0302b4e1da79f6f","url":"img/type_double_representation_1.png"},{"revision":"fc08c55ff6a66097f8563cfd43a19966","url":"img/type_double_representation_2.png"},{"revision":"acfbf1a2cbd405318aa4c633cf679fd1","url":"img/type_double.png"},{"revision":"3d397fb5c20ed8a933051222d91699a8","url":"img/type_float_representation_1.png"},{"revision":"89d027777732480bec6c4db59d13e924","url":"img/type_float_representation_2.png"},{"revision":"e36a225cd4a5e3567b68d9ddee391159","url":"img/type_float.png"},{"revision":"f3353ac8c82a1ca5cd6c0ade42a2b17a","url":"img/type_int.png"},{"revision":"afd33ce4c06791f3f14d1dbc7e96c4bc","url":"img/type_ldouble.png"},{"revision":"4313138006a5841708acd899745296c6","url":"img/type_lint.png"},{"revision":"1bc73b8665fae667a62f2136dfa2ec08","url":"img/type_llint.png"},{"revision":"57c63936ff9a47919590c673f8d2391e","url":"img/type_schar.png"},{"revision":"472d7787c3ec4de712a795270e9203ed","url":"img/type_sint.png"},{"revision":"cdb85df4b857a20ebf701fd92ecac375","url":"img/types.png"},{"revision":"8d04d316f4d1777793ee773fcbf16cea","url":"img/undraw_docusaurus_mountain.svg"},{"revision":"3d3d63efa464a74e2befd1569465ed21","url":"img/undraw_docusaurus_react.svg"},{"revision":"932b535fc71feb29877bc4b9d708b1d0","url":"img/undraw_docusaurus_tree.svg"},{"revision":"8a69bec1a445ce18f3803faa07fa5b2f","url":"img/value-categories.svg"},{"revision":"4bbda027f7c35303784e5f31f5b3f15a","url":"img/vector.png"},{"revision":"22c305528a7be287e59e9a9a754a82d4","url":"img/virtual.png"},{"revision":"5f707198a2504ab5a22a56884a95541a","url":"img/wfstream.png"}],s=new v({fallbackToNetwork:!0});e.offlineMode&&(s.addToCacheList(t),e.debug&&console.log("[Docusaurus-PWA][SW]: addToCacheList",{precacheManifest:t})),await async function(e){}(),self.addEventListener("install",(t=>{e.debug&&console.log("[Docusaurus-PWA][SW]: install event",{event:t}),t.waitUntil(s.install(t))})),self.addEventListener("activate",(t=>{e.debug&&console.log("[Docusaurus-PWA][SW]: activate event",{event:t}),t.waitUntil(s.activate(t))})),self.addEventListener("fetch",(async t=>{if(e.offlineMode){const a=t.request.url,n=function(e){const t=new URL(e,self.location.href);return t.origin!==self.location.origin?[]:(t.search="",t.hash="",[t.href,`${t.href}${t.pathname.endsWith("/")?"":"/"}index.html`])}(a);for(const i of n){const r=s.getCacheKeyForURL(i);if(r){const s=caches.match(r);e.debug&&console.log("[Docusaurus-PWA][SW]: serving cached asset",{requestURL:a,possibleURL:i,possibleURLs:n,cacheKey:r,cachedResponse:s}),t.respondWith(s);break}}}})),self.addEventListener("message",(async t=>{e.debug&&console.log("[Docusaurus-PWA][SW]: message event",{event:t});const s=t.data?.type;"SKIP_WAITING"===s&&self.skipWaiting()}))})()})()})();