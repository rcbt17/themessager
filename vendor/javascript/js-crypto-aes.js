import*as e from"js-crypto-env";var r={};Object.defineProperty(r,"__esModule",{value:true});var t={"AES-GCM":{nodePrefix:"aes-",nodeSuffix:"-gcm",ivLength:12,tagLength:16,staticIvLength:true},"AES-CBC":{nodePrefix:"aes-",nodeSuffix:"-cbc",ivLength:16,staticIvLength:true},"AES-CTR":{nodePrefix:"aes-",nodeSuffix:"-ctr",ivLength:12,staticIvLength:false}};var n={"AES-KW":{nodePrefix:"id-aes",nodeSuffix:"-wrap",ivLength:8,staticIvLength:true,defaultIv:new Uint8Array([166,166,166,166,166,166,166,166])}};r.default={ciphers:t,wrapKeys:n};var a={};var o=a&&a.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(a,"__esModule",{value:true});a.decrypt=a.encrypt=a.unwrapKey=a.wrapKey=void 0;var i=o(r);
/**
 * Node.js KeyWrapping function simply uses encrypt function.
 * @param keyToBeWrapped {Uint8Array} - plaintext key
 * @param wrappingKey {Uint8Array} - wrapping key
 * @param name {string} - 'AES-KW'
 * @param iv {Uint8Array} - default is '0xA6A6A6A6A6A6A6A6'
 * @param nodeCrypto {Object} - NodeCrypto object
 * @return {Uint8Array} - Unwrapped Key
 */var wrapKey$3=function(e,r,t,n){var o=t.name,i=t.iv;return(0,a.encrypt)(e,r,{name:o,iv:i},n,true)};a.wrapKey=wrapKey$3;
/**
 * Node.js KeyUnwrapping function as well as keyWrapping
 * @param wrappedKey {Uint8Array} - Wrapped key
 * @param unwrappingKey {Uint8Array} - Key used for wrapping
 * @param name {string} - 'AES-KW'
 * @param iv {Uint8Array} - default is '0xA6A6A6A6A6A6A6A6'
 * @param nodeCrypto {Object} - NodeCrypto object
 * @return {Uint8Array} - Unwrapped Key
 */var unwrapKey$3=function(e,r,t,n){var o=t.name,i=t.iv;return(0,a.decrypt)(e,r,{name:o,iv:i},n,true)};a.unwrapKey=unwrapKey$3;
/**
 * Encrypt plaintext message via AES Node.js crypto API
 * @param {Uint8Array} msg - Plaintext message to be encrypted.
 * @param {Uint8Array} key - Byte array of symmetric key.
 * @param {String} name - Name of AES algorithm like 'AES-GCM'.
 * @param {Uint8Array} [iv] - Byte array of initial vector if required.
 * @param {Uint8Array} [additionalData] - Byte array of additional data if required.
 * @param {Number} [tagLength] - Authentication tag length if required.
 * @param {Object} nodeCrypto - NodeCrypto object, i.e., require(crypto) in Node.js.
 * @param wrapKey {Boolean} [false] - true if called as AES-KW
 * @return {Uint8Array} - Encrypted message byte array.
 * @throws {Error} - Throws error if UnsupportedCipher.
 */var encrypt$3=function(e,r,t,n,a){var o=t.name,u=t.iv,c=t.additionalData,p=t.tagLength;void 0===a&&(a=false);var l=getNodeName(o,r.byteLength,a?i.default.wrapKeys:i.default.ciphers);var f;switch(o){case"AES-GCM":f=n.createCipheriv(l,r,u,{authTagLength:p});f.setAAD(c);break;case"AES-CTR":if(0===u.length||u.length>16)throw new Error("InvalidIVLength");var y=new Uint8Array(16);y.set(u);y[15]+=1;f=n.createCipheriv(l,r,y);break;default:f=n.createCipheriv(l,r,u);break}var v;var s;var d;try{v=new Uint8Array(f.update(e));s=new Uint8Array(f.final());d=new Uint8Array([]);"AES-GCM"===o&&(d=new Uint8Array(f.getAuthTag()))}catch(e){throw new Error("NodeCrypto_EncryptionFailure")}var h=new Uint8Array(v.length+s.length+d.length);h.set(v);h.set(s,v.length);h.set(d,v.length+s.length);return h};a.encrypt=encrypt$3;
/**
 * Decrypt data through AES Node.js crypto API.
 * @param {Uint8Array} data - Encrypted message to be decrypted.
 * @param {Uint8Array} key - Byte array of symmetric key.
 * @param {String} name - Name of AES algorithm like 'AES-GCM'.
 * @param {Uint8Array} [iv] - Byte array of initial vector if required.
 * @param {Uint8Array} [additionalData] - Byte array of additional data if required.
 * @param {Number} [tagLength] - Authentication tag length if required.
 * @param {Object} nodeCrypto - NodeCrypto object, i.e., require(crypto) in Node.js.
 * @return {Uint8Array} - Decrypted message byte array.
 * @param unwrapKey {Boolean} [false] - true if called as AES-KW
 * @throws {Error} - Throws error if UnsupportedCipher or DecryptionFailure.
 */var decrypt$3=function(e,r,t,n,a){var o=t.name,u=t.iv,c=t.additionalData,p=t.tagLength;void 0===a&&(a=false);var l=getNodeName(o,r.byteLength,a?i.default.wrapKeys:i.default.ciphers);var f;var y;switch(o){case"AES-GCM":f=n.createDecipheriv(l,r,u,{authTagLength:p});f.setAAD(c);y=e.slice(0,e.length-p);var v=e.slice(e.length-p);f.setAuthTag(v);break;case"AES-CTR":if(0===u.length||u.length>16)throw new Error("InvalidIVLength");var s=new Uint8Array(16);s.set(u);s[15]+=1;f=n.createDecipheriv(l,r,s);y=e;break;default:f=n.createDecipheriv(l,r,u);y=e;break}var d;var h;try{d=f.update(y);h=f.final()}catch(e){throw new Error("NodeCrypto_DecryptionFailure")}var w=new Uint8Array(h.length+d.length);w.set(d);w.set(h,d.length);return w};a.decrypt=decrypt$3;
/**
 * get node algorithm name
 * @param name {string} - name of webcrypto alg like AES-GCM
 * @param keyLength {number} - aes encryption key
 * @param dict {object} - params.ciphers or params.wrapKeys
 * @return {string} - node algorithm name
 */var getNodeName=function(e,r,t){var n=t[e].nodePrefix;n="".concat(n).concat((8*r).toString());return n+t[e].nodeSuffix};var u={};var c=u&&u.__awaiter||function(e,r,t,n){function adopt(e){return e instanceof t?e:new t((function(r){r(e)}))}return new(t||(t=Promise))((function(t,a){function fulfilled(e){try{step(n.next(e))}catch(e){a(e)}}function rejected(e){try{step(n.throw(e))}catch(e){a(e)}}function step(e){e.done?t(e.value):adopt(e.value).then(fulfilled,rejected)}step((n=n.apply(e,r||[])).next())}))};var p=u&&u.__generator||function(e,r){var t,n,a,o,i={label:0,sent:function(){if(1&a[0])throw a[1];return a[1]},trys:[],ops:[]};return o={next:verb(0),throw:verb(1),return:verb(2)},"function"===typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function verb(e){return function(r){return step([e,r])}}function step(u){if(t)throw new TypeError("Generator is already executing.");while(o&&(o=0,u[0]&&(i=0)),i)try{if(t=1,n&&(a=2&u[0]?n.return:u[0]?n.throw||((a=n.return)&&a.call(n),0):n.next)&&!(a=a.call(n,u[1])).done)return a;(n=0,a)&&(u=[2&u[0],a.value]);switch(u[0]){case 0:case 1:a=u;break;case 4:i.label++;return{value:u[1],done:false};case 5:i.label++;n=u[1];u=[0];continue;case 7:u=i.ops.pop();i.trys.pop();continue;default:if(!(a=i.trys,a=a.length>0&&a[a.length-1])&&(6===u[0]||2===u[0])){i=0;continue}if(3===u[0]&&(!a||u[1]>a[0]&&u[1]<a[3])){i.label=u[1];break}if(6===u[0]&&i.label<a[1]){i.label=a[1];a=u;break}if(a&&i.label<a[2]){i.label=a[2];i.ops.push(u);break}a[2]&&i.ops.pop();i.trys.pop();continue}u=r.call(e,i)}catch(e){u=[6,e];n=0}finally{t=a=0}if(5&u[0])throw u[1];return{value:u[0]?u[1]:void 0,done:true}}};Object.defineProperty(u,"__esModule",{value:true});u.decrypt=u.encrypt=u.unwrapKey=u.wrapKey=void 0;
/**
 * WebCrypto KeyWrapping function simply uses encrypt function.
 * @param keyToBeWrapped {Uint8Array} - plaintext key
 * @param wrappingKey {Uint8Array} - wrapping key
 * @param name {string} - 'AES-KW'
 * @param iv {Uint8Array} - default is '0xA6A6A6A6A6A6A6A6'
 * @param webCrypto {Object} - crypto.subtle object
 * @return {Uint8Array} - Unwrapped Key
 */var wrapKey$2=function(e,r,t,n){var a=t.name,o=t.iv;return c(void 0,void 0,void 0,(function(){var t,i,u,c;return p(this,(function(p){switch(p.label){case 0:p.trys.push([0,4,,5]);return[4,n.importKey("raw",r,{name:a},false,["wrapKey","unwrapKey"])];case 1:t=p.sent();return[4,n.importKey("raw",e,{name:a},true,["wrapKey","unwrapKey"])];case 2:i=p.sent();return[4,n.wrapKey("raw",i,t,{name:a,iv:o})];case 3:u=p.sent();return[2,new Uint8Array(u)];case 4:c=p.sent();throw c instanceof Error?new Error("WebCrypto_FailedToWrapKey - ".concat(c.message)):new Error("WebCrypto_FailedToWrapKey");case 5:return[2]}}))}))};u.wrapKey=wrapKey$2;
/**
 * WebCrypto KeyUnwrapping function as well as keyWrapping
 * @param wrappedKey {Uint8Array} - Wrapped key
 * @param unwrappingKey {Uint8Array} - Key used for wrapping
 * @param name {string} - 'AES-KW'
 * @param iv {Uint8Array} - default is '0xA6A6A6A6A6A6A6A6'
 * @param webCrypto {Object} - crypto.subtle object
 * @return {Uint8Array} - Unwrapped Key
 */var unwrapKey$2=function(e,r,t,n){var a=t.name,o=t.iv;return c(void 0,void 0,void 0,(function(){var t,i,u,c;return p(this,(function(p){switch(p.label){case 0:p.trys.push([0,4,,5]);return[4,n.importKey("raw",r,{name:a},false,["wrapKey","unwrapKey"])];case 1:t=p.sent();return[4,n.unwrapKey("raw",e,t,{name:a,iv:o},{name:"AES-GCM"},true,["encrypt","decrypt"])];case 2:i=p.sent();u=Uint8Array.bind;return[4,n.exportKey("raw",i)];case 3:return[2,new(u.apply(Uint8Array,[void 0,p.sent()]))];case 4:c=p.sent();throw c instanceof Error?new Error("WebCrypto_FailedToUnwrapKey - ".concat(c.message)):new Error("WebCrypto_FailedToUnwrapKey");case 5:return[2]}}))}))};u.unwrapKey=unwrapKey$2;
/**
 * Encrypt data through AES of WebCrypto API.
 * @param {Uint8Array} msg - Plaintext message to be encrypted.
 * @param {Uint8Array} key - Byte array of symmetric key.
 * @param {String} name - Name of AES algorithm like 'AES-GCM'.
 * @param {Uint8Array} [iv] - Byte array of initial vector if required.
 * @param {Uint8Array} [additionalData] - Byte array of additional data if required.
 * @param {Number} [tagLength] - Authentication tag length if required.
 * @param {Object} webCrypto - WebCrypto object, i.e., window.crypto.subtle
 * @return {Promise<Uint8Array>} - Encrypted data byte array.
 * @throws {Error} - Throws if UnsupportedCipher.
 */var encrypt$2=function(e,r,t,n){var a=t.name,o=void 0===a?"AES-GCM":a,i=t.iv,u=t.additionalData,l=t.tagLength;return c(void 0,void 0,void 0,(function(){var t,a,c,f;return p(this,(function(p){switch(p.label){case 0:t=setCipherParams({name:o,iv:i,additionalData:u,tagLength:l});p.label=1;case 1:p.trys.push([1,4,,5]);return[4,n.importKey("raw",r,t,false,["encrypt","decrypt"])];case 2:a=p.sent();return[4,n.encrypt(t,a,e)];case 3:c=p.sent();return[2,new Uint8Array(c)];case 4:f=p.sent();throw f instanceof Error?new Error("WebCrypto_EncryptionFailure: ".concat(f.message)):new Error("WebCrypto_EncryptionFailure");case 5:return[2]}}))}))};u.encrypt=encrypt$2;
/**
 * Decrypt data through AES of WebCrypto API.
 * @param {Uint8Array} data - Encrypted message to be decrypted.
 * @param {Uint8Array} key - Byte array of symmetric key.
 * @param {String} name - Name of AES algorithm like 'AES-GCM'.
 * @param {Uint8Array} [iv] - Byte array of initial vector if required.
 * @param {Uint8Array} [additionalData] - Byte array of additional data if required.
 * @param {Number} [tagLength] - Authentication tag length if required.
 * @param {Object} webCrypto - WebCrypto object, i.e., window.crypto.subtle
 * @return {Promise<Uint8Array>} - Decrypted plaintext message.
 * @throws {Error} - Throws if UnsupportedCipher or DecryptionFailure.
 */var decrypt$2=function(e,r,t,n){var a=t.name,o=t.iv,i=t.additionalData,u=t.tagLength;return c(void 0,void 0,void 0,(function(){var t,c,l,f;return p(this,(function(p){switch(p.label){case 0:t=setCipherParams({name:a,iv:o,additionalData:i,tagLength:u});p.label=1;case 1:p.trys.push([1,4,,5]);return[4,n.importKey("raw",r,t,false,["encrypt","decrypt"])];case 2:c=p.sent();return[4,n.decrypt(t,c,e)];case 3:l=p.sent();return[2,new Uint8Array(l)];case 4:f=p.sent();throw f instanceof Error?new Error("WebCrypto_DecryptionFailure: ".concat(f.message)):new Error("WebCrypto_DecryptionFailure");case 5:return[2]}}))}))};u.decrypt=decrypt$2;
/**
 * Set params for encryption algorithms.
 * @param {String} name - Name of AES algorithm like 'AES-GCM'.
 * @param {Uint8Array} [iv] - Byte array of initial vector if required.
 * @param {Uint8Array} [additionalData] - Byte array of additional data if required.
 * @param {Number} [tagLength] - Authentication tag length if required.
 */var setCipherParams=function(e){var r=e.name,t=e.iv,n=e.additionalData,a=e.tagLength;var o={name:r,iv:t,additionalData:n,tagLength:a};switch(r){case"AES-GCM":o.tagLength=8*a;break;case"AES-CBC":break;case"AES-CTR":if(0===t.length||t.length>16)throw new Error("InvalidIVLength");o.counter=new Uint8Array(16);o.counter.set(t);o.counter[15]+=1;o.length=128;break}return o};var l="default"in e?e.default:e;var f={};var y=f&&f.__createBinding||(Object.create?function(e,r,t,n){void 0===n&&(n=t);var a=Object.getOwnPropertyDescriptor(r,t);a&&!("get"in a?!r.__esModule:a.writable||a.configurable)||(a={enumerable:true,get:function(){return r[t]}});Object.defineProperty(e,n,a)}:function(e,r,t,n){void 0===n&&(n=t);e[n]=r[t]});var v=f&&f.__setModuleDefault||(Object.create?function(e,r){Object.defineProperty(e,"default",{enumerable:true,value:r})}:function(e,r){e.default=r});var s=f&&f.__importStar||function(e){if(e&&e.__esModule)return e;var r={};if(null!=e)for(var t in e)"default"!==t&&Object.prototype.hasOwnProperty.call(e,t)&&y(r,e,t);v(r,e);return r};var d=f&&f.__awaiter||function(e,r,t,n){function adopt(e){return e instanceof t?e:new t((function(r){r(e)}))}return new(t||(t=Promise))((function(t,a){function fulfilled(e){try{step(n.next(e))}catch(e){a(e)}}function rejected(e){try{step(n.throw(e))}catch(e){a(e)}}function step(e){e.done?t(e.value):adopt(e.value).then(fulfilled,rejected)}step((n=n.apply(e,r||[])).next())}))};var h=f&&f.__generator||function(e,r){var t,n,a,o,i={label:0,sent:function(){if(1&a[0])throw a[1];return a[1]},trys:[],ops:[]};return o={next:verb(0),throw:verb(1),return:verb(2)},"function"===typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function verb(e){return function(r){return step([e,r])}}function step(u){if(t)throw new TypeError("Generator is already executing.");while(o&&(o=0,u[0]&&(i=0)),i)try{if(t=1,n&&(a=2&u[0]?n.return:u[0]?n.throw||((a=n.return)&&a.call(n),0):n.next)&&!(a=a.call(n,u[1])).done)return a;(n=0,a)&&(u=[2&u[0],a.value]);switch(u[0]){case 0:case 1:a=u;break;case 4:i.label++;return{value:u[1],done:false};case 5:i.label++;n=u[1];u=[0];continue;case 7:u=i.ops.pop();i.trys.pop();continue;default:if(!(a=i.trys,a=a.length>0&&a[a.length-1])&&(6===u[0]||2===u[0])){i=0;continue}if(3===u[0]&&(!a||u[1]>a[0]&&u[1]<a[3])){i.label=u[1];break}if(6===u[0]&&i.label<a[1]){i.label=a[1];a=u;break}if(a&&i.label<a[2]){i.label=a[2];i.ops.push(u);break}a[2]&&i.ops.pop();i.trys.pop();continue}u=r.call(e,i)}catch(e){u=[6,e];n=0}finally{t=a=0}if(5&u[0])throw u[1];return{value:u[0]?u[1]:void 0,done:true}}};var w=f&&f.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(f,"__esModule",{value:true});f.unwrapKey=f.wrapKey=f.decrypt=f.encrypt=void 0;var g=s(l);var b=s(a);var m=s(u);var K=w(r);
/**
 * Check if the given algorithm spec is valid.
 * @param {String} name - Name of the specified algorithm like 'AES-GCM'.
 * @param {Uint8Array} iv - IV byte array if required
 * @param {Number} tagLength - Authentication tag length if required
 * @throws {Error} - Throws if UnsupportedAlgorithm, InvalidArguments, InvalidIVLength, or InvalidTagLength.
 */var assertAlgorithms=function(e){var r=e.name,t=e.iv,n=e.tagLength;if(K.default.ciphers[r].ivLength){if(!(t instanceof Uint8Array))throw new Error("InvalidArguments");if(t.byteLength<2||t.byteLength>16)throw new Error("InvalidIVLength");if(K.default.ciphers[r].staticIvLength&&K.default.ciphers[r].ivLength!==t.byteLength)throw new Error("InvalidIVLength")}if(K.default.ciphers[r].tagLength&&n){if(!Number.isInteger(n))throw new Error("InvalidArguments");if(n<4||n>16)throw new Error("InvalidTagLength")}};
/**
 * Encrypt data with AES
 * @param {Uint8Array} msg - Message to be encrypted.
 * @param {Uint8Array} key - The symmetric key used to encrypt the message.
 * @param {String} [name = 'AES-GCM'] - Name of the specified algorithm like 'AES-GCM'.
 * @param {Uint8Array} [iv] - Byte array of the initial vector if required.
 * @param {Uint8Array} [additionalData = new Uint8Array([])] - Byte array of additional data if required.
 * @param {Number} [tagLength = params.ciphers[name].tagLength] - Authentication tag length if required.
 * @return {Promise<Uint8Array>} - Encrypted message.
 * @throws {Error} - Throws if InvalidArguments, FaildToEncryptWeb/Node, or UnsupportedEnvironment (no webcrypto/nodecrypto).
 */var encrypt$1=function(e,r,t){var n=t.name,a=void 0===n?"AES-GCM":n,o=t.iv,i=t.additionalData,u=void 0===i?new Uint8Array([]):i,c=t.tagLength;return d(void 0,void 0,void 0,(function(){var t;return h(this,(function(n){assertAlgorithms({name:a,iv:o,tagLength:c});K.default.ciphers[a].tagLength&&!c&&(c=K.default.ciphers[a].tagLength);t=g.getCrypto();if("webCrypto"===t.name){if("function"!==typeof t.crypto.importKey||"function"!==typeof t.crypto.encrypt)throw new Error("UnsupportedWebCrypto");return[2,m.encrypt(e,r,{name:a,iv:o,additionalData:u,tagLength:c},t.crypto)]}if("nodeCrypto"===t.name)return[2,b.encrypt(e,r,{name:a,iv:o,additionalData:u,tagLength:c},t.crypto)];throw new Error("UnsupportedEnvironment")}))}))};f.encrypt=encrypt$1;
/**
 * Decrypt data with AES
 * @param {Uint8Array} data - Byte array of encrypted data.
 * @param {Uint8Array} key - Byte array of symmetric key to be used for decryption.
 * @param {String} [name = 'AES-GCM'] - Name of the specified algorithm like 'AES-GCM'.
 * @param {Uint8Array} [iv] - Byte array of the initial vector if required.
 * @param {Uint8Array} [additionalData = new Uint8Array([])] - Byte array of additional data if required.
 * @param {Number} [tagLength = params.ciphers[name].tagLength] - Authentication tag length if required.
 * @return {Promise<Uint8Array>} - Decrypted plaintext message.
 * @throws {Error} - Throws if InvalidArguments, FailedToDecryptWeb/Node, or UnsupportedEnvironment (no webcrypto/nodecrypto).
 */var decrypt$1=function(e,r,t){var n=t.name,a=void 0===n?"AES-GCM":n,o=t.iv,i=t.additionalData,u=void 0===i?new Uint8Array([]):i,c=t.tagLength;return d(void 0,void 0,void 0,(function(){var t;return h(this,(function(n){assertAlgorithms({name:a,iv:o,tagLength:c});K.default.ciphers[a].tagLength&&!c&&(c=K.default.ciphers[a].tagLength);t=g.getCrypto();if("webCrypto"===t.name){if("function"!==typeof t.crypto.importKey||"function"!==typeof t.crypto.decrypt)throw new Error("UnsupportedWebCrypto");return[2,m.decrypt(e,r,{name:a,iv:o,additionalData:u,tagLength:c},t.crypto)]}if("nodeCrypto"===t.name)return[2,b.decrypt(e,r,{name:a,iv:o,additionalData:u,tagLength:c},t.crypto)];throw new Error("UnsupportedEnvironment")}))}))};f.decrypt=decrypt$1;
/**
 * AES-KW wrapping
 * @param keyToBeWrapped {Uint8Array} - key bytes to be wrapped
 * @param wrappingKey {Uint8Array} - wrapping key encryption key
 * @param name {'AES-KW'} - this is simply for future extension
 * @return {Promise<Uint8Array>} - output wrapped key
 */var wrapKey$1=function(e,r,t){var n=t.name;return d(void 0,void 0,void 0,(function(){var t,a;return h(this,(function(o){if(e.length%8>0)throw new Error("WrappedKeyMustBeMultipleOf8");t=g.getCrypto();a=K.default.wrapKeys["AES-KW"].defaultIv;if("webCrypto"===t.name){if("function"!==typeof t.crypto.importKey||"function"!==typeof t.crypto.wrapKey)throw new Error("UnsupportedWebCrypto");return[2,m.wrapKey(e,r,{name:n,iv:a},t.crypto)]}if("nodeCrypto"===t.name)return[2,b.wrapKey(e,r,{name:n,iv:a},t.crypto)];throw new Error("UnsupportedEnvironment")}))}))};f.wrapKey=wrapKey$1;
/**
 * AES-KW unwrapping
 * @param wrappedKey {Uint8Array} - wrapped key bytes
 * @param wrappingKey {Uint8Array} - wrapping key encryption key
 * @param name {'AES-KW'} - this is simply for future extension
 * @return {Promise<Uint8Array>} - output unwrapped key
 */var unwrapKey$1=function(e,r,t){var n=t.name;return d(void 0,void 0,void 0,(function(){var t,a;return h(this,(function(o){t=g.getCrypto();a=K.default.wrapKeys["AES-KW"].defaultIv;if("webCrypto"===t.name){if("function"!==typeof t.crypto.importKey||"function"!==typeof t.crypto.unwrapKey)throw new Error("UnsupportedWebCrypto");return[2,m.unwrapKey(e,r,{name:n,iv:a},t.crypto)]}if("nodeCrypto"===t.name)return[2,b.unwrapKey(e,r,{name:n,iv:a},t.crypto)];throw new Error("UnsupportedEnvironment")}))}))};f.unwrapKey=unwrapKey$1;var E={};var _=E&&E.__createBinding||(Object.create?function(e,r,t,n){void 0===n&&(n=t);var a=Object.getOwnPropertyDescriptor(r,t);a&&!("get"in a?!r.__esModule:a.writable||a.configurable)||(a={enumerable:true,get:function(){return r[t]}});Object.defineProperty(e,n,a)}:function(e,r,t,n){void 0===n&&(n=t);e[n]=r[t]});var L=E&&E.__setModuleDefault||(Object.create?function(e,r){Object.defineProperty(e,"default",{enumerable:true,value:r})}:function(e,r){e.default=r});var C=E&&E.__importStar||function(e){if(e&&e.__esModule)return e;var r={};if(null!=e)for(var t in e)"default"!==t&&Object.prototype.hasOwnProperty.call(e,t)&&_(r,e,t);L(r,e);return r};Object.defineProperty(E,"__esModule",{value:true});E.unwrapKey=E.wrapKey=E.decrypt=E.encrypt=void 0;var A=C(f);E.encrypt=A.encrypt;E.decrypt=A.decrypt;E.wrapKey=A.wrapKey;E.unwrapKey=A.unwrapKey;E.default={encrypt:E.encrypt,decrypt:E.decrypt,wrapKey:E.wrapKey,unwrapKey:E.unwrapKey};const S=E.__esModule,D=E.unwrapKey,U=E.wrapKey,M=E.decrypt,j=E.encrypt;export{S as __esModule,M as decrypt,E as default,j as encrypt,D as unwrapKey,U as wrapKey};

