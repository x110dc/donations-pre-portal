// paths.js
const SCSS_DIR = './static/sass';
const CSS_OUTPUT_DIR = './static/build/';
const SVG_DIR = './static/img';
// const SVG_LIB_DIR = './node_modules/@texastribune/queso-ui/icons/base';
const SVG_OUTPUT_DIR = './templates/includes';


const CSS_MAP = [
  {
    in: `${SCSS_DIR}/business.scss`,
    out: CSS_OUTPUT_DIR,
  },
];

// Tip: you can mix and match icons from @texastribune/queso-ui and some stored locally
const SVG_MAP = [
  {
    in: [
      `${SVG_DIR}/star.svg`,
      `${SVG_DIR}/check.svg`,
    ],
    out: `${SVG_OUTPUT_DIR}/my-svg-sprite.html`,
  },
];

const MANIFEST_FILE = `${CSS_OUTPUT_DIR}styles.json`;


module.exports = {
  CSS_MAP,
  SVG_MAP,
  MANIFEST_FILE
};
