const os = require("os"); // nodejs 核心module，直接使用
const path = require("path");
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin');

const threads = os.cpus().length; // cpu核數

// 用來獲得處理 style的loader
const getStyleLoader = (pre) => {
    return [
        MiniCssExtractPlugin.loader, // css from js to create style tag in html to active
        "css-loader", //css to commonjs to js
        {
            loader: "postcss-loader",
            options: {
                postcssOptions: {
                    plugins: [
                        "postcss-preset-env",// solve most style compatible problem
                    ],
                },
            },
        },
        pre,
    ].filter(Boolean);
};

module.exports = {
    entry: "./src/main.js",
    output: {
        path: path.resolve(__dirname, "../dist"),
        // entry js
        filename: "static/js/[name].[contenthash:10].js", // 會直接取用默認的entry名字，就算之後改成多入口也沒問題
        // 給打包輸出的其他文件命名
        chunkFilename: "static/js/[name].chunk.[contenthash:10].js", // 加個chunk的副檔名比較清楚呈現這個是chunk分割的文件
        assetModuleFilename: 'static/media/[hash:10][ext][query]', // 圖片、字體等通過type:asset處理資源命名方式，統一在這設定
        // auto clean last dist
        clean: true,
    },
    module: {
        rules: [
            {
                // each document only use one loader of these loader, reduce package time
                oneOf: [
                    // loader
                    {
                        test: /\.css$/,//only detect .css
                        use: getStyleLoader(), //execute order from right to left, down to up
                    },
                    {
                        test: /\.less$/,
                        use: getStyleLoader('less-loader'),
                    },
                    {
                        test: /\.s[ac]ss$/,
                        use: getStyleLoader('sass-loader'),
                    },
                    {
                        test: /\.styl$/,
                        use: getStyleLoader('stylus-loader'),
                    },
                    {
                        test: /\.(png|jpe?g|gif|webp|svg)$/,
                        type: "asset",
                        parser: {
                            dataUrlCondition: {
                                // small than 10kb's pic turn to base64(小於 10kb的轉base64)
                                // good: reduce request count   bad: size bigger
                                maxSize: 10 * 1024, // 10kb
                            }
                        },
                        // generator: {
                        //     // export pic url and name
                        //     // [hash:10] hash filename only take 10 digit
                        //     filename: 'static/images/[hash:10][ext][query]',
                        // }
                    },
                    {
                        test: /\.(ttf|woff2?|mp3|mp4|avi)$/,
                        type: "asset/resource",
                        // generator: {
                        //     // export pic url and name
                        //     filename: 'static/media/[hash:10][ext][query]',
                        // }
                    },
                    {
                        test: /\.m?js$/,
                        // exclude: /node_modules/, // 排除node_modules下的js，其他文件都處理
                        include: path.resolve(__dirname, '../src'), // 只處理src下的文件，其他文件不處理
                        use: [
                            {
                                loader: 'thread-loader', // 開啟多核
                                options: {
                                    work: threads, // 核數量
                                },
                            },
                            {
                                loader: 'babel-loader',
                                options: {
                                    // presets: ['@babel/preset-env'],
                                    cacheDirectory: true, // 開啟babel緩存
                                    cacheCompression: false, // 關閉緩存文件壓縮
                                    plugins: ["@babel/plugin-transform-runtime"], //減少代碼體積
                                },
                            },
                        ]
                    },
                ]
            }
        ],
    },
    plugins: [
        new ESLintPlugin({
            context: path.resolve(__dirname, "../src"),
            exclude: 'node_modules', // 默認值，不寫也會排除掉node_modules
            cache: true, // 開啟緩存
            cacheLocation: path.resolve(
                __dirname,
                "../node_modules/.cache/eslintcache"
            ),
            threads, // 開啟多核和設置多核數量
        }),
        new HtmlWebpackPlugin({
            // template, 以public/index.html文件創建新的html文件
            // 新的html文件重點: 1. 結構和原來一致，2. 自動引入打包輸出的資源
            template: path.resolve(__dirname, "../public/index.html"),
        }),
        new MiniCssExtractPlugin({
            filename: "static/css/[name].[contenthash:10].css", // 將來也可能多入口，不見得都合成一個檔，所以filename也是設定成[name]可直接取對應設定的方式
            chunkFilename: 'static/css/[name].chunk.[contenthash:10].css', // 如果也有動態import css檔的時候，就會需要也對chunk的csst檔命名
        }),
        new PreloadWebpackPlugin({
            rel: 'preload',
            as: 'script',
            // rel: 'prefetch',
        }),
    ],
    optimization: {
        // 壓縮的操作放這
        minimizer: [
            // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
            // `...`,
            // 壓縮 css
            new CssMinimizerPlugin(),
            // 壓縮 js
            new TerserWebpackPlugin({
                parallel: threads, // 開啟多核和設置多核數量
            }),
            new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.imageminMinify,
                    options: {
                        // Lossless optimization with custom option
                        // Feel free to experiment with options for better result for you
                        plugins: [
                            ["gifsicle", { interlaced: true }],
                            ["jpegtran", { progressive: true }],
                            ["optipng", { optimizationLevel: 5 }],
                            // Svgo configuration here https://github.com/svg/svgo#configuration
                            [
                                "svgo",
                                {
                                    plugins: [
                                        {
                                            name: "preset-default",
                                            params: {
                                                overrides: {
                                                    removeViewBox: false,
                                                    addAttributesToSVGElement: {
                                                        params: {
                                                            attributes: [
                                                                { xmlns: "http://www.w3.org/2000/svg" },
                                                            ],
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    ],
                                },
                            ],
                        ],
                    },
                },
            }),
        ],
        // 代碼分割配置
        splitChunks: {
            chunks: 'all',
            // 其他都用默認值
        },
        runtimeChunk: {
            name: (entrypoint) => `runtime~${entrypoint.name}`,
        },
    },
    // WARNING in asset size limit: The following asset(s) exceed the recommended size limit (244 KiB)
    // Assets: static/images/74c4383e31.gif (11.5 MiB)
    performance: {
        hints: false,
    },
    mode: "production",
    devtool: 'source-map',
};