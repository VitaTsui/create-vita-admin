const path = require("path");
const webpack = require("webpack");
const TerserJSPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const envPath = path.resolve(__dirname, `../.env/.env.prod`);
const envConfig = require("dotenv").config({ path: envPath }).parsed;

const definePlugin = {};
Object.keys(envConfig).map((key) => {
  definePlugin[`process.env.${key}`] = JSON.stringify(envConfig[key]);
});

// Path normalization helper
const normalizePath = (inputPath) => {
  return path.normalize(inputPath).replace(/\\/g, "/");
};

// Normalized cwd
const cwd = normalizePath(process.cwd());

const config = {
  mode: "production",
  devtool: false,
  output: {
    clean: true,
    path: path.resolve(__dirname, "../dist"),
    filename: (pathData) => {
      let name = pathData.chunk.name;
      if (name === "main") {
        return "static/js/[name].[hash:8].js";
      }
      return "static/js/[name].[hash:8].chunk.js";
    },
    chunkFilename: "static/js/[name].[hash:8].chunk.js",
    assetModuleFilename: "static/media/[ext]/[hash][ext][query]",
  },
  plugins: [
    new webpack.DefinePlugin(definePlugin),
    new MiniCssExtractPlugin({
      filename: (pathData) => {
        let name = pathData.chunk.name;
        if (name === "main") {
          return "static/css/[name].[hash:8].css";
        }
        return "static/css/[name].[hash:8].chunk.css";
      },
      // Async chunks have no name, fall back to [id] (avoids name rendering as the literal undefined)
      chunkFilename: "static/css/[id].[hash:8].chunk.css",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: normalizePath(path.resolve(__dirname, "../public")),
          to: normalizePath(path.resolve(__dirname, "../dist")),
          globOptions: {
            dot: true,
            gitignore: true,
            ignore: ["**/index.html"],
          },
          noErrorOnMissing: false,
          force: true,
          context: cwd, // Add context configuration
        },
      ],
    }),
    new CleanWebpackPlugin(),
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            )?.[1];
            // Return undefined when no package name matches, letting webpack name it by chunk id (avoids the literal "undefined")
            return packageName ? packageName.replace("@", "") : undefined;
          },
          minSize: 20 * 1024,
          maxSize: 200 * 1024,
          minChunks: 1,
          priority: 100,
          reuseExistingChunk: true,
        },
      },
    },
    minimizer: [
      new TerserJSPlugin({
        extractComments: false,
        parallel: true,
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
          },
        },
      }),
      new CssMinimizerPlugin({
        parallel: true,
      }),
    ],
  },
};

module.exports = config;
