const css = require('css');
let pxReg, exceptReg, exceptSelectReg, formatReg, propertyReg, pxGlobalReg;

module.exports = class Scale {
  constructor(options) {
    const defaultConfig = {
      exceptSelect: '.except',
      exceptText: '--doc-scale',
      exceptProperty: 'background',
      units: 'px',
      rule: (value) => {
        return value == 0
          ? value
          : `calc(${value}${this.config.units} * var(--doc-scale))`;
      },
    };
    this.config = { ...defaultConfig, ...options };
    pxReg = new RegExp(`\\b(\\d+(\\.\\d+)?)${this.config.units}\\b`);
    exceptReg = new RegExp(`.*${this.config.exceptText}.*`);
    exceptSelectReg = new RegExp(`^${this.config.exceptSelect}.`);
    formatReg = new RegExp("^'(.+)'$");
    propertyReg = this.config.exceptProperty
      ? new RegExp(`^${this.config.exceptProperty}`)
      : '';
    pxGlobalReg = new RegExp(pxReg.source, 'g');
  }
  generateScale(cssText) {
    let astObj = css.parse(cssText);
    this.processRules(astObj.stylesheet.rules);
    return css.stringify(astObj);
  }
  processRules(rules) {
    for (let i = 0; i < rules.length; i++) {
      let rule = rules[i];

      if (rule.type === 'media') {
        this.processRules(rule.rules); // recursive invocation while dealing with media queries
        continue;
      } else if (rule.type === 'keyframes') {
        this.processRules(rule.keyframes, true); // recursive invocation while dealing with keyframes
        continue;
      } else if (
        (rule.type !== 'rule' && rule.type !== 'keyframe') ||
        (rule.selectors && exceptSelectReg.test(rule.selectors))
      ) {
        continue;
      }
      rule.declarations.forEach((node) => {
        if (
          node.type === 'declaration' &&
          pxReg.test(node.value) &&
          !exceptReg.test(node.value) &&
          (!propertyReg || !propertyReg.test(node.property))
        ) {
          node.value = this.replace(node.value);
        }
      });
    }
  }
  replace(value) {
    let except = formatReg.test(value);
    let reg = except ? formatReg : pxGlobalReg;
    return value.replace(reg, ($0, $1) => {
      return except ? $1 : this.config.rule($1);
    });
  }
};
