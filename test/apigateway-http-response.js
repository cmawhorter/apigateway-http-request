'use strict';

const ApigatewayHttpBaseResponse = require('../src/main.js').ApigatewayHttpBaseResponse;

describe('ApigatewayHttpBaseResponse', function() {
  describe('#toJSON', function() {
    it('should return a properly formatted object', function() {
      let res = new ApigatewayHttpBaseResponse({ hello: 'world' }, 200, { 'some-header': 'some-header-value' }, 'req_1');
      let result = res.format();
      expect(result).toBeAn(Object);
      expect(result).toIncludeKeys([ 'statusCode', 'headers', 'body' ]);
      expect(result.headers).toBeAn(Object);
      expect(result.statusCode).toEqual(200);
      expect(result.headers['some-header']).toEqual('some-header-value');
      expect(result.body).toEqual('{"hello":"world"}');
    });
  });
});
