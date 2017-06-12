# apigateway-http-request [![Build Status](https://travis-ci.org/cmawhorter/apigateway-http-request.svg?branch=master)](http://travis-ci.org/cmawhorter/apigateway-http-request)

For use with AWS Lambda.  Parses an incoming API Gateway event into a more familiar structure similar to an express `req`.

## Getting started

Here's an example AWS Lambda function that echos back incoming request body.

```js
import { fromIncomingEvent, ApigatewayHttpSuccessResponse } from 'apigateway-http-request'

export default { 
  handler(event, context, callback) {
    let req = fromIncomingEvent(event); // returns an ApigatewayHttpRequest
    console.log(req);
    // optionally use included response
    let body        = { timestamp: Date.now(), echo: req.body };
    let statusCode  = 200;
    let headers     = { 'Some-Header': 'hi' };
    // if no requestId is supplied one will be generated
    // let requestId   = 'generated request id or one supplied by aws';
    let res = new ApigatewayHttpSuccessResponse(body, statusCode, headers, requestId);
    callback(null, res.format());
  }
};
```
