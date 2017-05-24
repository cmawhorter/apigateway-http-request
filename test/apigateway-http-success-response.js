'use strict';

const ApigatewayHttpSuccessResponse = require('../src/main.js').ApigatewayHttpSuccessResponse;

describe('ApigatewayHttpSuccessResponse', function() {
  describe('#ctor', function() {
    it('should take an event and return an ApigatewayHttpSuccessResponse object', function() {
      let result = new ApigatewayHttpSuccessResponse();
      expect(result).toBeAn(ApigatewayHttpSuccessResponse);
    });
    it('should be serializable', function() {
      let result = new ApigatewayHttpSuccessResponse();
      expect(result.toJSON()).toIncludeKeys([
        'statusCode',
        'headers',
        'body',
      ]);
    });
  });
});
