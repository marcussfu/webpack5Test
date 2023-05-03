// 完整引入
// import 'core-js';
// 按需加載
// import 'core-js/es/promise';

import add from './js/add';
// import {mul} from './js/math';

import './css/index.css';
import './css/all.css';
import './css/icofont.css';
import './less/box2.less';
import './sass/box3.sass';
import './sass/box4.scss';
import './stylus/box5.styl';

console.log(add(4,6));

document.getElementById("btnForLazyload").onclick = function() {
    // import 動態載入，會將動態載入的文件代碼分割成單獨module
    // 在需要使用的時候自動加載
    // /* webpackChunkName: "reduce" */ webpack魔法命名
    import(/* webpackChunkName: "reduce" */'./js/reduce')
        .then((res) => {
            console.log("module loading success", res.default(2,1));
        })
        .catch((err) => {
            console.log("module loading fail", err);
        });
};

document.getElementById("btnForLazyloadMul").onclick = function() {
    // /* webpackChunkName: "reduce" */ webpack魔法命名
    import(/* webpackChunkName: "math" */'./js/math').then(({mul}) => {
        console.log('mul', mul(3,3));
    });
}

new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
});

const arr = [1, 2, 3, 4];
console.log(arr.includes(1));

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').then(registration => {
        console.log('SW registered: ', registration);
      }).catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
    });
}