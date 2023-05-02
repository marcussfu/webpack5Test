npm init -y

npm i webpack webpack-cli -D

npx webpack ./src/main.js --mode=development  //還沒加上webpack.config.js前
                                 production

npx webpack


原生只能編譯js，要編譯其他需要套件


visual code remove comments shortcut command
透過正規進行搜尋，並使用快捷鍵 command + enter 替換全部。

//.*\n
// 開頭
. 所有字元
* 不限數量
\n 尾巴為換行



.eslintrc
.eslintrc.js
.eslintrc.json

package.json's eslintConfig

eslint會自動查找相關文件，所以只要存在一個就行

parserOptions // 解析選項
rules // 具體規則
  off: 0
  warn: 1
  error: 2 
extends // 繼承
  直接繼承已經寫好的規則, 而在rules的規則會覆蓋或新增在原有的規則上
  extends: ['react-app']


npm i eslint eslint-webpack-plugin --save-dev

Eslint檢查、Babel編譯

## babel

npm install -D babel-loader @babel/core @babel/preset-env


## 處理html資源
npm install --save-dev html-webpack-plugin


## 開發環境自動打包，只要Code修改儲存，就會自動npx webpack(實時重新加載

npm i webpack-dev-server -D

npx webpack serve


## 在package.json的scripts設定好shortcut

dev 模式
npx webpack serve --config ./config/webpack.dev.js

production 模式
npx webpack --config ./config/webpack.prod.js

就能直接npm start(npm run dev) 開發模式 、npm run build 生產模式了

## 提取CSS成單獨文件

css打包在js中，當js load進來後，再創建style來生成樣式
但網站這樣會出現閃屏

於是透過單獨的css, 再通過link標簽加載

npm i --save-dev mini-css-extract-plugin

在webpack.prod.js加入
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

要把style.loader改成MiniCssExtractPlugin.loader //提取css成單獨文件

## css兼容性處理

1. npm i postcss-loader postcss postcss-preset-env -D

2. 在webpack.prod.js的rules的use裡加上postcss-loader
但要加在css-loader後面，其他loader前面

ex: css-loader
              <- 加在這postcss-loader
    sass-loader

3. 在package.json加上
"browserslist": [
    "last 2 version",
    "> 1%",
    "not dead"
  ]
以設定交集的瀏覽器條件

## 封裝style loader函數

讓重覆的style loader可以透過呼叫函式直接取得，有不同的再透過傳入pre再讀取進來
getStyleLoader()

## 基礎css壓縮
CssMinimizerWebpackPlugin

1. npm install css-minimizer-webpack-plugin --save-dev

2. 在webpack.prod.js引入const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

3. 再於 module.exports加入
optimization: {
    minimizer: [
      // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
      // `...`,
      new CssMinimizerPlugin(),
    ],
  },

## 基礎html和js在production模式下默認壓縮成一行了

開發模式: code可以編譯自動化運行
生產模式: code編譯優化輸出，壓縮最小化輸出檔

## webpack高級，就是進行webpack優化，讓編譯和運行時效能更好

* 提升開發體驗
* 提升打包速度
* 減少code體績
* 優化code運行性能

每個優化都有三點要自問
* Why
* What
* How

## SourceMap
* Why
在開發模式下，可以點開發工具的sources，看對應的js打包後的樣子
但開發模式下，要是js有錯誤，提示code的位置是打包後的位置，而不是原本的對應位置

* What
源碼映射，用來生成源碼與構建後的代碼映射的方案
生成一個xxx.map，包含源碼和構建後的代碼每一行一列的映射關係
當構建後代碼出錯了，會通過xxx.map，從構建後代碼出錯位置找到源碼出錯位置
從而讓瀏覽器提示源碼出錯位置，能更快找到錯誤

* How
development mode

cheap-module-source-map
優點: 打包編譯速度快，只包含行映射
缺點: 沒有列映射

在webpack.dev.js加上devtool: 'cheap-module-source-map',

production mode

source-map
優點: 包含行/列映射
缺點: 打包編譯速度更慢

在webpack.prod.js加上devtool: 'source-map',

要重新用 npm start才能

## HotModuleReplacement
* Why
在開發模式時修改了其中一個module code，webpack畎認會將所有module全部重新打包，速度很慢

所以需要做到改了什麼module code，就只有這個module需要重新打包，這樣速度就會比較快

生產模式就是全部重新打包，所以不能用這個

* What
HotModuleReplacement(HMR)，在運行中替換、增加或刪除module，無需重新加載整個頁面

* How

在devServer裡加hot: true，一樣要重新npm start

ex: 更新index.css

[HMR]  - ./src/css/index.css
log.js:24 [HMR] App is up to date.

就只會更改這個檔案，不會整個refresh

但js需要在main.js加上
```
if (module.hot) {
  module.hot.accept('./js/add');
  module.hot.accept('./js/count', function(count) {// 一但count發生變化後，就調用附加的函式
    const result = count(2, 3);
    console.log(result);
  });
  // 後續還有增加需要熱module更新的，加在這下面
}
```
但這樣很麻煩，要一直加，如果是vue或react, 就可以各別用 vue-loader和react-hot-loader來處理

## oneOf
* Why
打包時每個文件都會經過所有loader處理，雖然實際上沒有處理到，但都要經過一遍，比較慢
* What
顧名思義就是只能匹配上一個loader，其他就不匹配了
* How
在rules裡再包一層oneOf
```
  rules: [
    {
      oneOf: [
        //各種loader
      ]
    }
  ]
```
開發環境和生產環境都可以用

開發環境: 一樣需要重新 npm start，編譯速度會快一點點
生產環境: npm run build，打包速度會快一點點

## include/Exclude
* Why
第三方函式庫或plugin已經下載到node_modules，這些文件不需要再編譯就可以直接使用的，所以在對js處理時，要排除掉node_modules下的文件
* What
include: 包含，只處理xxx文件
exclude: 排除，除了xxx文件以外的其他文件都處理
只針對js文件
* How
開發環境和生產環境都可以用
include和exclude只能存其一，不能都加上去

ex:
```
{
    test: /\.m?js$/,
    // exclude: /node_modules/, // 排除node_modules下的js，其他文件都處理
    include: path.resolve(__dirname, '../src'), // 只處理src下的文件，其他文件不處理
    loader: 'babel-loader',
    // options: {
    //     presets: ['@babel/preset-env'],
    // },
},


new ESLintPlugin({
    context: path.resolve(__dirname, "../src"),
    exclude: 'node_modules', // 默認值，不寫也會排除掉node_modules
}),
```

開發環境: 一樣需要重新 npm start
生產環境: npm run build
看有沒有正常編譯

## cache
* Why
每次打包js都要經過eslint檢查和babel編譯，速度比較慢
可以緩存之前的eslint檢查和babel編譯結果，這樣第二次打包速度就會更快了
* What
對eslint檢查和babel編譯結果進行緩存。
* How
開發環境和生產環境都可以用
Babel
  js
  options: {
    cacheDirectory: true, // 開啟babel緩存
    cacheCompression: false, // 關閉緩存文件壓縮
  }

Eslint
在new EsLintPlugin({
  cache: true, // 開啟緩存
  cacheLocation: path.resolve(
    __dirname,
    "../node_modules/.cache/eslintcache"
  ),
})

開發環境: 一樣需要重新 npm start
生產環境: npm run build
看有沒有正常編譯

## Thead 多核打包
* Why
專案愈大，打包速度會越慢，想要提升打包速度
其實就是提升js的打包速度，因為其他文件相對較少
js主要是eslint、babel、terser(壓縮)三個工具
所以就是要提升他們的運行速度
可以開啟多核同時處理js文件，這樣速度就比之前單核打包更快了
* What
多核打包，同時一起打包，速度更快
warn: 請僅在特別耗時的操作中使用，因為每個核啟動就有大約600ms左右開銷
* How
開發環境和生產環境都可以用
1. 獲取CPU的核數
   const os = require("os"); // nodejs 核心module，直接使用
   const threads = os.cpus().length; // cpu核數
2. 下載包
   npm i thread-loader -D
3. 使用
```
   // babel
   use: [
      { // 要在babel-loader前面
          loader: 'thread-loader', // 開啟多核
          options: {
              work: threads, // 核數量
          }
      },
      {
          loader: 'babel-loader',
          ...
      },
  ]

  // eslint
  new EsLintPlugin({
    ...
    threads, // 開啟多核和設置多核數量
  })
```

引入壓縮的函式庫(內建)
```
// 開發模式下沒有壓縮，所以就不用加在webpack.dev.js
const TerserWebpackPlugin = require("terser-webpack-plugin");

在optimization加入壓縮的相關操作
optimization: {
  minimizer: [
    ...
    new TerserWebpackPlugin({
        parallel: threads, // 開啟多核和設置多核數量
    }),
  ]
}),
```

打包初期會覺得反而變慢，是因為開啟多核處理的關係
隨著專案規模愈大，就會感受到打包速度變快

## Tree Shaking
* Why
自己定義的函式庫或引入的第三方函式庫
沒有處理在打包時會引入整個函式庫，但實際上可能只用上部分函式庫
卻整個都要引入，體積太大了
* What
Tree Shaking是一個術語，用於描述javascript中沒有使用上的代碼
* How
webpack已經默認使用了

這個在生產模式下試就好了
ex: 使用了math的mul函式，而沒有用divide函式
打包後就只會有mul函式被打包，divide就沒有

## 減少babel生成文件的體積
* Why
babel為編譯的文件都插入輔助代碼，讓體積變大
ex: 一些公共方法使用了非常小的輔助代碼，比如: _extend，默認會加到每一個需要的文件中

可以將輔助代碼作為獨立module，避免重覆引入
* What
@babel/plugin-transform-runtime: 禁用babel自動對每個文件的runtime注入，而是引入@babel/plugin-transform-runtime，並且讓所有輔助代碼從這裡引用
* How
開發環境和生產環境都可以用
module愈多提速會愈明顯
1. down pacakge
   npm i @babel/plugin-transform-runtime -D
2. 在babel-loader裡加入plugins: ["@babel/plugin-transform-runtime"]//減少代碼體積

## 壓縮圖片
* Why
如果引用較多圖片，圖片體積就會比較大，請求速度會比較慢
所以對圖片進行壓縮，減少圖片體積
warn: local靜態圖片才需要壓縮，如果圖片是用網路url取得，那就不用壓縮了
* What
image-minimizer-webpack-plugin: 用來壓縮圖片的plugin
* How
1. down package
npm i image-minimizer-webpack-plugin imagemin -D
2. 有損壓縮或無損壓縮的package下載
無損壓縮: 體積會大些，但沒損害圖片
npm i imagemin-gifsicle imagemin-jpegtran imagemin-optipng imagemin-svgo -D
有損壓縮: 體績會小些，但有損害圖片
npm i imagemin-gifsicle imagemin-mozjpeg imagemin-pngquant imagemin-svgo -D
3. 配置
以無損壓縮配置為例: 
在webpack.prod.js(壓縮只要在生產環境使用)
加入const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

壓縮要放在optimization
```
// 壓縮圖片
new ImageMinimizerPlugin({
  minimizer: {
    implementation: ImageMinimizerPlugin.imageminGenerate,
    options: {
      plugins:[
        ["gifsicle", { interlaced: true }],
        ["jpegtran", { progressive: true }],
        ["optipng", { optimizationLevel: 5 }],
        [
          "svgo",
          {
            plugins: [
              "preset-default",
              "prefixIds",
              {
                name: "sortAttrs",
                params: {
                  xmlnsOrder: "alphabetical",
                },
              },
            ],
          },
        ],
      ],
    },
  },
}),
```
4. 其他
發現如果圖片太大，像girl的gif有12m，在npm run build時
就會出現"stdout maxBuffer length exceeded"的錯誤
所以最好是讓圖片小於2m

## code split
* Why
打包code會把所有js都包到一個文件中，體積會太大，如果只要渲染首頁
就應該只加載首頁的js文件，其他文件都不應該加載

所以需要分割代碼，生成多個js文件，渲染哪個頁面就只加載某個js文件
這樣加載的資源就少，速度就更快
* What
code split主要做兩件事:
1. 分割文件: 將打包生成的文件分割生成多個js文件
2. 按需加載: 需要哪個文件就加載哪個文件
* How
1. 多入口
本來entry只有main.js，output也只有main.js
ex: 改成
entry: {
  // 有多個入口文件
  app: "./src/app.js",
  main: "./src/main.js,
},
output: {
  path: path.resolve(__dirname, "dist"),
  filename: "[name].js", // webpack命名方式，[name]以文件名自已命名
},
2. 多入口-提取公共module
entry: {
  // 有多個入口文件，都import了math.js
  app: "./src/app.js",
  main: "./src/main.js,
},
在打包後，app.js和main.js都會引入相同的math.js，體積變大

用SplitChunksPlugin來分割js，提取共用module出來
```
module.exports = {
  //...
  optimization: {
    splitChunks: {
      // include all types of chunks
      chunks: 'all',
      //chunks: 'async',
      //minSize: 20000,
      //minRemainingSize: 0,
      //minChunks: 1,
      //maxAsyncRequests: 30,
      //maxInitialRequests: 30,
      //enforceSizeThreshold: 50000,
      //cacheGroups: {
      //  defaultVendors: {
      //    test: /[\\/]node_modules[\\/]/,
      //    priority: -10,
      //    reuseExistingChunk: true,
      //  },
      //  default: { // 沒有寫的就沿用上面的，有寫的會覆蓋上面的參數值
      //    minChunks: 2,
      //    priority: -20,
      //    reuseExistingChunk: true,
      //  },
      //},
      cacheGroups: {
        default:" {
          minSize: 0, // 我們定義的文件體積太小了，為了測試，所以要改打包的最小文件體積
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        }
      },
    },
  },
};
```
entry幾個，就會出來幾個文件，但會不會再多其他文件，就看chunk分割的結果
3. 多入口-按需要加載(Lazy-loading)
* Why
直接import js文件，就算沒有用到，也會一起打包載入，體積變大變慢
* What
可以的話，就需要再載入(import)
* How
像是在點擊button時，再載入
ex:
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
4. 單入口-按需要加載(Lazy-loading)
如果是spa(單頁應用)
entry和outputs都改成一個

把分割的splitChunks放在optimization裡
optimization: {
  ...
  // 代碼分割配置
  splitChunks: {
      chunks: 'all',
      // 其他都用默認值
  },
},

在main.js加上點擊button再import函式的做法
document.getElementById("btnForLazyloadMul").onclick = function() {
    import('./js/math').then(({mul}) => {
        console.log('mul', mul(3,3));
    })
}

如果會出現eslint提示說import不能動態載入(可能是舊的作法)
在.eslintrc.js加入
plugins: ["import"], // 解決動態導入語法報錯

在npm run build後，會看到動態載入的函式另外被分割成不同的文件，經過dist的index.html測試(透過工具的network)

可以看到點擊button才會載入對應的函式

warn: error  Parsing error: 'import' and 'export' may only appear at the top level

動態import在開發環境會出現這錯誤，查stackoverflow後得到解答

把.eslintrc.js裡的ecmaVersion: 6, 改成 11，大概是之前的es6沒有支援吧，11就內建有支援動態import的eslint檢查了

記得重新 npm start

5. 給分割的chunk文件命名
分割後的chunk js文件，會自動被命名成什麼14.main.js 根本不知道代表什麼

所以需要透過重新命名這些chunk分割打包後的文件名

先在main.js的動態載入函式的地方改成這樣
ex: import(/* webpackChunkName: "reduce" */'./js/reduce')

/* webpackChunkName: "reduce" */ 是webpack魔法命名
"reduce" 就是我們想要給這個chunk文件的名字

然後還要在webpack.prod.js的output裡加上
// 給打包輸出的其他文件命名，name就是webpack魔法命名時指定的名字
chunkFilename: 'static/js/[name].js',

最後再npm run build，就可以看到dist的chunk文件變成清楚的名字了
6. 統一命名
開發環境和生產環境都可以設定，設定完記得重新npm run build 和 npm start
在webpack.prod.js和webpack.dev.js裡，有各種對輸出文件的命名
* output的文件名
* chunk的文件名
* media的文件名(縮小成10位)
* css整合成一個檔的檔名，css之後會有chunk的文件名之類

可以的話，最好讓重覆使用的共用設定，讓命名可以直接透過設定清楚呈現
在output裡的
```
filename: "static/js/[name].js", // 會直接取用默認的entry名字，就算之後改成多入口也沒問題
// 給打包輸出的其他文件命名
chunkFilename: "static/js/[name].chunk.js", // 加個chunk的副檔名比較清楚呈現這個是chunk分割的文件
assetModuleFilename: 'static/media/[hash:10][ext][query]', // 圖片、字體等通過type:asset處理資源命名方式，統一在這設定
```

在plugins裡的MiniCssExtractPlugin
```
new MiniCssExtractPlugin({
    filename: "static/css/[name].css", // 將來也可能多入口，不見得都合成一個檔，所以filename也是設定成[name]可直接取對應設定的方式
    chunkFilename: 'static/css/[name].chunk.css', // 如果也有動態import css檔的時候，就會需要也對chunk的csst檔命名
}),
```