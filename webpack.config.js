const path = require("path"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  MiniCssExtractPlugin = require("mini-css-extract-plugin"),
  PrettierPlugin = require("prettier-webpack-plugin"),
  CopyWebpackPlugin = require("copy-webpack-plugin"),
  webpack = require("webpack");

const sass = {
  test: /\.(sass|scss)$/,
  include: path.resolve("src"),
  use: [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {}
    },

    {
      loader: "css-loader",
      options: {
        sourceMap: true,
        url: false
      }
    },

    {
      loader: "postcss-loader",
      options: {
        ident: "postcss",
        sourceMap: true,
        plugins: [
          require("cssnano")({
            preset: ["default", { discardComments: { removeAll: true } }]
          }),

          require("autoprefixer")({
            cascade: false,
            browsers: ["last 4 version", "IE >= 8"]
          })
        ]
      }
    },

    {
      loader: "sass-loader",
      options: { sourceMap: true }
    }
  ]
};

const pug = {
  test: /\.pug$/,
  use: ["html-loader?attrs=false", "pug-html-loader"],
  exclude: path.resolve("src/js/frontend")
};

const pugJSX = {
  test: /\.pug$/,
  use: ["babel-loader", "pug-as-jsx-loader"],
  exclude: path.resolve("src/pug")
};

const js = {
  test: /\.js$/,
  loader: "babel-loader"
};

const jsx = {
  test: /\.jsx$/,
  loader: "babel-loader"
};

const config = {
  entry: ["./src/js/frontend/main.js", "./src/sass/style.sass"],
  output: {
    path: path.resolve("docs"), // for github pages deploy
    filename: "[name].bundle.js"
  },

  devServer: {
    disableHostCheck: true, // fix wds disconnect error
    overlay: true
  },

  module: { rules: [pug, sass, js, jsx, pugJSX] },
  plugins: [
    new PrettierPlugin({
      printWidth: 90, // Specify the length of line that the printer will wrap on.
      tabWidth: 2, // Specify the number of spaces per indentation-level.
      useTabs: true, // Indent lines with tabs instead of spaces.
      semi: true, // Print semicolons at the ends of statements.
      encoding: "utf-8", // Which encoding scheme to use on files
      extensions: [".js"], // Which file extensions to process
      trailingComma: "all",
      arrowParens: "always"
    }),

    new MiniCssExtractPlugin({
      filename: "style.bundle.css"
    }),

    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "src/pug/index.pug",
      inject: false
    })
  ]
};

module.exports = (env, options) => {
  const isProd = options.mode === "production";

  config.devtool = isProd ? false : "cheap-module-eval-source-map";

  config.plugins.push(
    new webpack.DefinePlugin({ PROD_MODE: JSON.stringify(isProd) })
  );

  return config;
};
