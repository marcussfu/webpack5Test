const path = require("path");
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: "./src/main.js",
    output: {
        // 開發模式沒有輸出
        path: undefined,
        // entry js
        filename: "static/js/main.js",
    },
    module: {
        rules: [
            {
                // each document only use one loader of these loader, reduce package time
                oneOf: [
                    // loader
                    {
                        test: /\.css$/,//only detect .css
                        use: [ //execute order from right to left, down to up
                            "style-loader", // css from js to create style tag in html to active
                            "css-loader" //css to commonjs to js
                        ],
                    },
                    {
                        test: /\.less$/,
                        use: [
                            "style-loader",
                            "css-loader",
                            'less-loader'
                        ],
                    },
                    {
                        test: /\.s[ac]ss$/,
                        use: [
                            "style-loader",
                            "css-loader",
                            'sass-loader'
                        ],
                    },
                    {
                        test: /\.styl$/,
                        use: [
                            "style-loader",
                            "css-loader",
                            'stylus-loader'
                        ],
                    },
                    {
                        test: /\.(png|jpe?g|gif|webp|svg)$/,
                        type: "asset",
                        parser: {
                            dataUrlCondition: {
                                // small than 10kb's pic turn to base64
                                // good: reduce request count   bad: size bigger
                                maxSize: 10 * 1024, // 10kb
                            }
                        },
                        generator: {
                            // export pic url and name
                            // [hash:10] hash filename only take 10 digit
                            filename: 'static/images/[hash:10][ext][query]',
                        }
                    },
                    {
                        test: /\.(ttf|woff2?|mp3|mp4|avi)$/,
                        type: "asset/resource",
                        generator: {
                            // export pic url and name
                            filename: 'static/media/[hash:10][ext][query]',
                        }
                    },
                    {
                        test: /\.m?js$/,
                        // exclude: /node_modules/, // 排除node_modules下的js，其他文件都處理
                        include: path.resolve(__dirname, '../src'), // 只處理src下的文件，其他文件不處理
                        loader: 'babel-loader',
                        // options: {
                        //     presets: ['@babel/preset-env'],
                        // },
                    },
                ]
            }
        ],
    },
    plugins: [
        new ESLintPlugin({
            context: path.resolve(__dirname, "../src"),
            exclude: 'node_modules', // 默認值，不寫也會排除掉node_modules
        }),
        new HtmlWebpackPlugin({
            // template, 以public/index.html文件創建新的html文件
            // 新的html文件重點: 1. 結構和原來一致，2. 自動引入打包輸出的資源
            template: path.resolve(__dirname, "../public/index.html"),
        }),
    ],
    devServer: {//npx webpack serve，不會輸出dist
        host: 'localhost',
        port: '3100',
        open: true, // open broswer auto
        hot: true, // open HMR(only development)
    },
    mode: "development",
    devtool: 'cheap-module-source-map',
};