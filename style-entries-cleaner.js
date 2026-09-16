class StyleEntriesCleaner {

  /**
   * @param {string[]} entryNames
   */
  constructor(entryNames) {
    this.entryNames = entryNames;
  }
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('DeleteStyleOnlyJS', (compilation) => {
      compilation.hooks.processAssets.tap(
        { name: 'StyleEntriesCleaner', stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ANALYSE },
        (assets) => {
          this.entryNames.forEach((name) => {
            ['.js', '.js.map'].forEach((ext) => {
              const filename = `${name}${ext}`;
              if (assets[filename]) compilation.deleteAsset(filename);
            });
          });
        }
      );
    });
  }
}

module.exports = StyleEntriesCleaner;