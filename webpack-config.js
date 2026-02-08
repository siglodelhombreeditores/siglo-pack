const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const AssetsPlugin = require("assets-webpack-plugin");

class WebpackConfig {
  /**
   * @param {string} module
   * @param {'development'|'production'} mode
   */
  constructor(module, mode = 'development') {
    this.module = module;
    this.mode = mode;
    this.outputPath = path.resolve(process.cwd(), 'public');
    this.entries = new Map();
    this.externals = {};
  }

  get isProduction() {
    return this.mode === 'production';
  }

  /**
   * @param {string} name
   * @param {string|object} src
   * @returns {WebpackConfig}
   */
  addEntry(name, src) {
    if (this.entries.has(name)) {
      throw new Error(`Duplicate name "${name}" passed to addEntry(): entries must be unique.`);
    }
    this.entries.set(name, src);
    return this;
  }

  addExternals(externals = {}) {
    Object.assign(this.externals, externals);
    return this;
  }

  build() {
    return {
      entry: this.#buildEntryConfig(),
      mode: this.mode,
      output: {
        path: this.outputPath,
        filename: this.#getDestinationFilename('.js'),
        chunkFilename: this.#getDestinationFilename('.js'),
        pathinfo: !this.isProduction,
        clean: {
          keep: /entrypoints\.json/ // clean: true borra entrypoints.json
        },
        publicPath: `/modules/${this.module}/public/`,
      },
      module: {
        rules: this.#buildRules(),
      },
      plugins: this.#buildPlugins(),
      externals: this.externals,
      devtool: this.isProduction
        // https://webpack.js.org/configuration/devtool/#for-production
        ? 'source-map'
        // https://webpack.js.org/configuration/devtool/#for-development
        : 'inline-source-map',
    }
  }

  #buildEntryConfig() {
    const entry = {};
    for (const [entryName, entryChunks] of this.entries) {
      // entryFile could be an array, we don't care
      entry[entryName] = entryChunks;
    }
    return entry;
  }

  #getDestinationFilename(append = '', contenthash = null) {
    return (this.isProduction && contenthash !== false || contenthash ? '[name].[contenthash]' : '[name]') + append
  }

  #buildRules() {
    const rules = [];
    rules.push({
      test: /\.(js|jsx|ts|tsx)?$/,
      exclude: /(node_modules)/,
      resolve: {
        fullySpecified: false,
        extensions: ['.js', '.ts'],
      },
      use: {
        loader: 'esbuild-loader',
        options: {
          loader: 'ts',
          target: 'es2015',
        },
      },
    });

    rules.push({
      test: /\.(sa|sc|c)ss$/,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            sourceMap: !this.isProduction
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: !this.isProduction
          }
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
          }
        }
      ]
    })

    return rules;
  }

  #buildPlugins() {
    return [
      new MiniCssExtractPlugin({filename: this.#getDestinationFilename('.css')}),
      new AssetsPlugin({
        path: this.outputPath,
        filename: 'entrypoints.json',
        entrypoints: true,
        prettyPrint: !this.isProduction,
        removeFullPathAutoPrefix: true,
        processOutput: assets => {
          for (const bundle in assets) {
            for (const type in assets[bundle]) {
              if (!Array.isArray(assets[bundle][type])) {
                assets[bundle][type] = [assets[bundle][type]];
              }
            }
          }
          return JSON.stringify(assets, null, 2);
        }
      })
    ]
  }
}

module.exports = WebpackConfig