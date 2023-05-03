module.exports = {
    //compile es6
    presets: [
        [
            "@babel/preset-env",
            {
                useBuiltIns: 'usage', // 按需加載自動引入
                corejs: 3,
            },
        ],
    ],
};