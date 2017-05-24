'use strict';

const ApigatewayHttpRequest = require('../src/main.js').ApigatewayHttpRequest;

describe('ApigatewayHttpRequest', function() {
  describe('#ctor', function() {
    it('should take an event and return an ApigatewayHttpRequest object', function() {
      let result = new ApigatewayHttpRequest();
      expect(result).toBeAn(ApigatewayHttpRequest);
    });
    it('should be serializable', function() {
      let result = new ApigatewayHttpRequest();
      expect(result.toJSON()).toIncludeKeys([
        'resource',
        'method',
        'path',
        'querystring',
        'context',
        'headers',
        'body',
        'requestId',
      ]);
    });
  });
});
