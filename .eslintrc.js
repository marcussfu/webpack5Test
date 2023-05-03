module.exports = {
    extends: ['eslint:recommended'],
    env: {
        node: true,
        browser: true,
        es6: true,
    },
    parserOptions: {
        ecmaVersion: 11, //es11
        sourceType: 'module', //es module
        // ecmaFeatures: { // ES other feature
        //     jsx: ture
        // }
    },
    rules: {
        "no-var": 2, // can't use var variable
    },
    // plugins: ["import"], // 解決動態導入語法報錯
}