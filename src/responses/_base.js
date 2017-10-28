import HttpMessage from '../lib/http-message.js';
import { assertValidStatusCode } from '../lib/status-codes.js';

export default class BaseResponse extends HttpMessage {
  constructor(body, statusCode, headers, requestId) {
    super(headers, body, requestId);
    this._statusCode = statusCode || 0;
  }

  get statusCode() {
    return this._statusCode;
  }

  set statusCode(value) {
    assertValidStatusCode(value);
    this._statusCode = value;
  }

  addCORS(scope) {
    this.headers.add('access-control-allow-origin', scope);
  }

  addGlobalCORS() {
    this.addCORS('*');
  }

  toResponse() {
    return this.body;
  }

  format() {
    let statusCode  = this.statusCode;
    let body        = this.toResponse();
    let encBody     = null;
    let contentType = 'text/plain';
    if (Buffer.isBuffer(body)) {
      encBody = body.toString('base64');
      contentType = 'application/octet-stream';
    }
    else if (undefined !== body) {
      encBody = JSON.stringify(body);
      contentType = 'application/json';
    }
    else {
      // noop.  no body
    }
    // don't clobber existing header. only set if
    // no content-type header currently exists
    // fixes #3
    if (undefined === this.headers.get('content-type')) {
      this.headers.add('content-type', contentType);
    }
    return {
      statusCode,
      headers:      this.headers.toJSON(),
      body:         encBody
    };
  }
}
