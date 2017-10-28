import BaseResponse from './_base.js';

export default class ErrorResponse extends BaseResponse {
  constructor(message, type, statusCode, headers, requestId) {
    super(undefined, statusCode, headers, requestId);
    this.type       = type || ErrorResponse.UNKNOWN;
    this.message    = message || null;
    this.code       = null;
    this.request    = null;
  }

  toResponse() {
    return {
      error: {
        type:     this.type,
        message:  this.message,
        code:     this.code,
        request:  this.request,
      },
    };
  }
}

ErrorResponse.UNKNOWN          = 'unknown_error';
ErrorResponse.NETWORK          = 'network_error';
ErrorResponse.API              = 'api_error';
ErrorResponse.AUTH             = 'authentication_error';
ErrorResponse.INVALID_REQUEST  = 'invalid_request_error';
ErrorResponse.NOT_FOUND        = 'not_found';
