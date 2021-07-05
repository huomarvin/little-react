const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: './src/index.js',
		mode: 'development',
		devtool: "inline-source-map",
    module: {
        rules: [
            {
              test: /\.m?js$/,
              exclude: /node_modules/,
              use: {
                loader: 'babel-loader',
              }
            }
          ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
    ],
		devServer: {
			// 指定开发环境应用运行的根据目录
			contentBase: ["./dist", './public'],
			// 指定控制台输出的信息
			stats: "errors-only",
			// 不启动压缩
			compress: false,
			host: "localhost",
			port: 5000
		}
};