const loaderUtils = require('loader-utils');
const path = require('path');

module.exports = function loader(source) {
  const issuer = this._module.issuer;
  if (issuer) {
    const issuerRequest = issuer.request.replace(/\?.*/, '');
    if (issuerRequest === __filename) return source;
  }

  const helperPath = JSON.parse(loaderUtils.stringifyRequest(this,
    path.resolve(__dirname, 'helper.js')));

  const options = loaderUtils.getOptions(this);
  const jssModule = options.jssModule || 'jss';

  return `
import jss, { SheetsManager } from '${jssModule}';
import original from '${this.currentRequest}';
import helper from '${helperPath}';
const key = {}, wrapper = helper(jss, SheetsManager, original, key);
export default wrapper;
`;
};
