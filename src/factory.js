import ApigatewayHttpRequest from './requests/apigateway-http-request.js';

// bc default decode fn
export function decodeBody(body, isBase64Encoded) {
  if (typeof body === 'string') {
    return isBase64Encoded ? new Buffer(body, 'base64').toString() : JSON.parse(body);
  }
  else {
    return null;
  }
}

export function fromIncomingEvent(event, requestId, decodingFn = decodeBody) {
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
  try {
    request.body = decodingFn(body, event.isBase64Encoded);
  }
  catch (err) {
    console.log('Warning: Unable to decode incoming request body. Leaving it raw.', err);
    request.body = body; // pass through raw if decoding fails
  }
  return request;
}


