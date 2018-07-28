const postcssImport = require('postcss-import');
const postcssFocus = require('postcss-focus');
const postcssReporter = require('postcss-reporter');
const postcssPresetEnv = require('postcss-preset-env');

const postcssPlugins = [
  postcssImport({
    path: ['src'],
  }),
  postcssFocus(), // Add a :focus to every :hover
  postcssPresetEnv({ // Allow future CSS features to be used, also auto-prefixes the CSS...
    stage: 0,
    browsers: ['last 2 versions', 'IE > 10', 'Safari >= 8', 'Android > 4'], // ...based on this browser list
  }),
  postcssReporter({ // Posts messages from plugins to the terminal
    clearMessages: true,
  }),
];

module.exports = {
  plugins: postcssPlugins,
};
