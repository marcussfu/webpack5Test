const path = require("path");
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
    entry: "./src/main.js",
    output: {
        path: path.resolve(__dirname, "dist"),
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
        ],
    },
    plugins: [
        new ESLintPlugin({
            context: path.resolve(__dirname, "src"),
        }),
    ],
    mode: "development",
};