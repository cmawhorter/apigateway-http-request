'use strict';

var ApigatewayHttpRequest = require('../src/main.js').ApigatewayHttpRequest;

describe('ApigatewayHttpRequest', function() {
  describe('#ctor', function() {
    it('should take an event and return an ApigatewayHttpRequest object', function() {
      var result = new ApigatewayHttpRequest();
      expect(result).toBeAn(ApigatewayHttpRequest);
    });
    it('should be serializable', function() {
      var result = new ApigatewayHttpRequest();
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
  describe('#header', function() {
    it('should support missing headers', function() {
      var result = new ApigatewayHttpRequest();
      expect(result.headers.get('missing')).toEqual(undefined);
      result.headers.add('there', 'hello');
      expect(result.headers.get('there')).toEqual('hello');
    });
  });
});
