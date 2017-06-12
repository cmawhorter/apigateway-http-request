'use strict';

var ApigatewayHttpSuccessResponse = require('../src/main.js').ApigatewayHttpSuccessResponse;

describe('ApigatewayHttpSuccessResponse', function() {
  describe('#ctor', function() {
    it('should take an event and return an ApigatewayHttpSuccessResponse object', function() {
      var result = new ApigatewayHttpSuccessResponse();
      expect(result).toBeAn(ApigatewayHttpSuccessResponse);
    });
    it('should be serializable', function() {
      var result = new ApigatewayHttpSuccessResponse();
      expect(result.format()).toIncludeKeys([
        'statusCode',
        'headers',
        'body',
      ]);
    });
  });
});
