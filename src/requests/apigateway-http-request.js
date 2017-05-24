import HttpMessage from '../lib/http-message.js';

export default class ApigatewayHttpRequest extends HttpMessage {
  constructor(data) {
    data = data || {};
    super(data.headers, data.body, data.requestId);
    this.resource     = data.resource || null;
    this.method       = data.method || null;
    this.path         = data.path || [];
    this.querystring  = data.querystring || {};
    this.context      = data.context || {};
  }

  get query() {
    return this.querystring;
  }

  toJSON() {
    return {
      headers:      this.headers.toJSON(),
      body:         this.body,
      requestId:    this.requestId,
      resource:     this.resource,
      method:       this.method,
      path:         this.path,
      querystring:  this.querystring,
      context:      this.context,
    };
  }
}
