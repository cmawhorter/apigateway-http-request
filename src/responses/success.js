import BaseResponse from './_base.js';

export default class ObjectResponse extends BaseResponse {
  constructor(body, statusCode, headers, requestId) {
    super(body, statusCode, headers, requestId);
  }

  toResponse() {
    return this.body;
  }
}
