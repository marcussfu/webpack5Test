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