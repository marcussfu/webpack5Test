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
    import('./js/reduce')
        .then((res) => {
            console.log("module loading success", res.default(2,1));
        })
        .catch((err) => {
            console.log("module loading fail", err);
        });
};

document.getElementById("btnForLazyloadMul").onclick = function() {
    import('./js/math').then(({mul}) => {
        console.log('mul', mul(3,3));
    })
}
