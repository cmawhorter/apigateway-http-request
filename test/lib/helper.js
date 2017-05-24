global.assert = require('assert');
global.expect = require('expect');

require('babel-register')({
  only: /\b(src|lodash\-es|async\-es)\b/,
});
