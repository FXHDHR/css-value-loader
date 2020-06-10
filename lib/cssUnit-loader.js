const loaderUtils = require('loader-utils');
const PxScale = require('./unit');

module.exports = function (source) {
  let options = loaderUtils.getOptions(this);
  let pxScaleIns = new PxScale(options);
  return pxScaleIns.generateScale(source);
};
