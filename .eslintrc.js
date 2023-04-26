module.exports = {
    extends: ['eslint:recommended'],
    env: {
        node: true,
        browser: true,
    },
    parserOptions: {
        ecmaVersion: 6, //es6
        sourceType: 'module', //es module
        // ecmaFeatures: { // ES other feature
        //     jsx: ture
        // }
    },
    rules: {
        "no-var": 2, // can't use var variable
    },
    
}