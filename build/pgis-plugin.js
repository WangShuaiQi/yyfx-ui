const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: {
        'MapToolMenuPlugin' : './static/pgis/MapToolMenuPlugin.js',
        'init' : './static/pgis/init.js',
        'MapApp' : './static/pgis/MapApp.js',
        'mapConfig' : './static/pgis/mapConfig.js',
        'EzServerClient-src': './static/pgis/EzServerClient-src.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../dist/static/pgis')
    },
    plugins:[
        new UglifyJsPlugin({
            uglifyOptions: {
                compress: {
                warnings: false
                }
            }
        })
    ]
}