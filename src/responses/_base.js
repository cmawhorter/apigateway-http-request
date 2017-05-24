import HttpMessage from '../lib/http-message.js';
import { assertValidStatusCode } from '../lib/status-codes.js';

export default class BaseResponse extends HttpMessage {
  constructor(statusCode, headers, body, requestId) {
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

  toJSON() {
    let statusCode  = this.statusCode;
    let body        = this.toResponse();
    let encBody     = null;
    if (Buffer.isBuffer(body)) {
      encBody = body.toString('base64');
      this.headers.add('content-type', 'application/octet-stream');
    }
    else if (undefined !== body) {
      encBody = JSON.stringify(body);
      this.headers.add('content-type', 'application/json');
    }
    else {
      // noop.  no body
    }
    return {
      statusCode,
      headers:      this.headers.toJSON(),
      body:         encBody
    };
  }
}
