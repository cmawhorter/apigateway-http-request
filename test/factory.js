'use strict';

var ApigatewayHttpRequest = require('../src/main.js').ApigatewayHttpRequest;
var fromIncomingEvent = require('../src/factory.js').fromIncomingEvent;

var apigatewayPostJsonBody = require('./mock-events/apigateway-POST-json-body.json');

describe('factory', function() {
  describe('#fromIncomingEvent', function() {
    it('should take an event and return an ApigatewayHttpRequest object', function() {
      var result = fromIncomingEvent(apigatewayPostJsonBody);
      expect(result).toBeAn(ApigatewayHttpRequest);
    });
    it('should take a requestId', function() {
      var requestId = 'tha_request';
      var result = fromIncomingEvent(apigatewayPostJsonBody, requestId);
      expect(result.requestId).toEqual(requestId);
    });
  });
});
