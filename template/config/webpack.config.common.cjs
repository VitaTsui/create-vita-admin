const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const envPath = path.resolve(__dirname, `../.env/.env.common`);
const envConfig = require("dotenv").config({ path: envPath }).parsed;

const PASS_CLS = JSON.parse(envConfig.PASS_CLS);

const config = {
  entry: {
    main: path.resolve(__dirname, "../src/index.tsx"),
  },
  output: {
    publicPath: "/",
  },
  module: {
    rules: [
      {
        // @hsu-react/ui 的 es 产物为 ESM(type:module)、相对导入不带扩展名，
        // 关闭 webpack5 的 fullySpecified 强校验，允许其无扩展名解析。
        test: /\.m?js$/,
        resolve: { fullySpecified: false },
      },
      {
        test: /\.(png|jpe?g|gif|webp|svg)$/i,
        // 排除 node_modules，但放行 @hsu-react/ui 自带的图片资源
        exclude: /node_modules\/(?!@hsu-react\/ui\/)/,
        type: "asset/resource",
      },
      {
        test: /\.(mp4)$/i,
        exclude: /node_modules/,
        type: "asset/resource",
      },
      {
        test: /\.(ttf|otf)$/i,
        exclude: /node_modules/,
        type: "asset/resource",
      },
      {
        test: /\.ts(x)?$/,
        exclude: /node_modules/,
        use: ["ts-loader"],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: {
                auto: true,
                localIdentName: "[local]--[hash:base64:5]",
                getLocalIdent: (_, __, localName) => {
                  for (const key in PASS_CLS) {
                    if (PASS_CLS[key] === "LK" && localName.startsWith(key)) {
                      return localName;
                    } else if (PASS_CLS[key] === "EQ" && localName === key) {
                      return localName;
                    }
                  }

                  return undefined;
                },
              },
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [require("autoprefixer")],
              },
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: {
                auto: true,
                localIdentName: "[local]--[hash:base64:5]",
                getLocalIdent: (_, __, localName) => {
                  for (const key in PASS_CLS) {
                    if (PASS_CLS[key] === "LK" && localName.startsWith(key)) {
                      return localName;
                    } else if (PASS_CLS[key] === "EQ" && localName === key) {
                      return localName;
                    }
                  }

                  return undefined;
                },
              },
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [require("autoprefixer")],
              },
            },
          },
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
              additionalData: `@import "@/styles/variables.global.less";`,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      //模板路径，注意需要和index.html路径对应
      template: path.resolve(__dirname, "../public/index.html"),
    }),
  ],
  resolve: {
    extensions: [
      ".tsx",
      ".ts",
      ".js",
      ".jsx",
      ".mts",
      ".cts",
      ".cjs",
      ".mjs",
      ".less",
    ],
    alias: {
      "@": path.resolve(__dirname, "../src"),
    },
    fallback: {
      bson: require.resolve("bson"),
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      vm: require.resolve("vm-browserify"),
    },
  },
};

module.exports = config;
