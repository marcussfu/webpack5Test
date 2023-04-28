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


