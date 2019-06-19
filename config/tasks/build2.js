// build.js
const { styles, icons } = require('@texastribune/queso-tools');
const { CSS_MAP, MANIFEST_FILE, SVG_MAP } = require('../paths2');

async function build() {
  await styles(CSS_MAP, MANIFEST_FILE);
  await icons(SVG_MAP);
}

build()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err.message);
    process.exit(1);
  });