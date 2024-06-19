const path = require('path');
const { override, addLessLoader, adjustStyleLoaders } = require('customize-cra');

module.exports = function override(config, env) {
    const wasmExtensionRegExp = /\.wasm$/;
    config.resolve.extensions.push('.wasm');

    config.experiments = {
        asyncWebAssembly: true,
        syncWebAssembly: true
      };

    // Add a dedicated loader for WASM
    config.module.rules.push({
        test: wasmExtensionRegExp,
        type: "webassembly/async",
    });

    // 添加 LESS 支持
    config = addLessLoader({
        lessOptions: {
            javascriptEnabled: true,
            // modifyVars: { '@primary-color': '#1DA57A' },
            localIdentName: '[local]--[hash:base64:5]'
        }
    })(config, env);

    adjustStyleLoaders(({ use: [,,postcss] }) => {
        const postcssOptions = postcss.options;
        postcss.options = {postcssOptions}
    })(config, env);


    return config;
};

