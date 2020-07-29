const path = require('path');
const HTMLWebpackPlugin = require("html-webpack-plugin");
const webpack = require('webpack');


let config = {
    entry: './src/js/index.js',
    output: {
        filename: 'js/bundle.js'
    },
    devServer: {
        contentBase: './dist/dev/'
    },
    plugins: [
        new HTMLWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        }),
        new webpack.ProgressPlugin(),
    ],
    module: {
        rules: [{
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {

                test: /\.css$/i,
                use: [{
                        loader: 'style-loader',
                        options: {
                            injectType: 'styleTag'
                        }
                    },
                    'css-loader',
                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'img',
                },
            }
        ],
    },
};


const outPath = (mode) => {
    return (mode === 'production') ? 'dist/prod' : 'dist/dev'
}

module.exports = (env, argv) => {
    config.output.path = path.resolve(__dirname, outPath(argv.mode))
    return config
};