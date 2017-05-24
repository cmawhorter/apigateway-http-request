import ApigatewayHttpRequest from './requests/apigateway-http-request.js';

export function fromIncomingEvent(event, requestId) {
  let requestContext  = event.requestContext;
  let headers         = event.headers || {};
  let body            = event.body || null;
  let path            = ((event.pathParameters || {}).proxy || '').split('/');
  let request = new ApigatewayHttpRequest({
    headers,
    requestId:    requestId || requestContext.requestId,
    method:       event.httpMethod || null,
    path:         path,
    resource:     path.shift(),
    querystring:  event.queryStringParameters,
    context:      requestContext,
  });
  if (event.isBase64Encoded) {
    request.body = new Buffer(body, 'base64').toString();
  }
  else if (typeof body === 'string') {
    request.body = JSON.parse(body);
  }
  return request;
}


