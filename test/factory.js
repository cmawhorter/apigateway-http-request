'use strict';

const ApigatewayHttpRequest = require('../src/main.js').ApigatewayHttpRequest;
const fromIncomingEvent = require('../src/factory.js').fromIncomingEvent;

const apigatewayPostJsonBody = require('./mock-events/apigateway-POST-json-body.json');

describe('factory', function() {
  describe('#fromIncomingEvent', function() {
    it('should take an event and return an ApigatewayHttpRequest object', function() {
      let result = fromIncomingEvent(apigatewayPostJsonBody);
      expect(result).toBeAn(ApigatewayHttpRequest);
    });
    it('should take a requestId', function() {
      let requestId = 'tha_request';
      let result = fromIncomingEvent(apigatewayPostJsonBody, requestId);
      expect(result.requestId).toEqual(requestId);
    });
  });
});
