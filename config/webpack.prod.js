const path = require("path");
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

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
        filename: "static/js/main.js",
        // auto clean last dist
        clean: true,
    },
    module: {
        rules: [
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
                exclude: /node_modules/, // 排除node_modules's js
                loader: 'babel-loader',
                // options: {
                //     presets: ['@babel/preset-env'],
                // },
            },
        ],
    },
    plugins: [
        new ESLintPlugin({
            context: path.resolve(__dirname, "../src"),
        }),
        new HtmlWebpackPlugin({
            // template, 以public/index.html文件創建新的html文件
            // 新的html文件重點: 1. 結構和原來一致，2. 自動引入打包輸出的資源
            template: path.resolve(__dirname, "../public/index.html"),
        }),
        new MiniCssExtractPlugin({
            filename: "static/css/main.css",
        }),
    ],
    optimization: {
        minimizer: [
            // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
            // `...`,
            new CssMinimizerPlugin(),
        ],
    },
    // WARNING in asset size limit: The following asset(s) exceed the recommended size limit (244 KiB)
    // Assets: static/images/74c4383e31.gif (11.5 MiB)
    performance: {
        hints: false,
    },
    mode: "production",
};