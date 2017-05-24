import { id as generateId } from 'eyed';
import HttpHeaders from './http-headers.js';

export default class HttpMessage {
  constructor(headers, body, requestId) {
    this._requestId   = requestId || generateId('req');
    this._headers     = new HttpHeaders(headers);
    this._body        = body;
  }

  get requestId() {
    return this._requestId;
  }

  get headers() {
    return this._headers;
  }

  get body() {
    return this._body;
  }

  set body(value) {
    this._body = value;
  }
}
