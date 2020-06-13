const loaderUtils = require('loader-utils');
const Value = require('./value');

module.exports = function (source) {
  let options = loaderUtils.getOptions(this);
  let valueIns = new Value(options);
  return valueIns.generateScale(source);
};
