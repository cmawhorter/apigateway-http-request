(function (exports,crypto,buffer) {
'use strict';

crypto = 'default' in crypto ? crypto['default'] : crypto;
buffer = 'default' in buffer ? buffer['default'] : buffer;

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

// Unique ID creation requires a high quality random # generator.  In node.js
// this is prett straight-forward - we use the crypto API.

var rb = crypto.randomBytes;

function rng$1() {
  return rb(16);
}

var rng_1 = rng$1;

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid$1(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  return  bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]];
}

var bytesToUuid_1 = bytesToUuid$1;

// Unique ID creation requires a high quality random # generator.  We feature
// detect to determine the best RNG source, normalizing to a function that
// returns 128-bits of randomness, since that's what's usually required
var rng = rng_1;
var bytesToUuid = bytesToUuid_1;

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

// random #'s we need to init node and clockseq
var _seedBytes = rng();

// Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
var _nodeId = [
  _seedBytes[0] | 0x01,
  _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
];

// Per 4.2.2, randomize (14 bit) clockseq
var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

// Previous uuid creation time
var _lastMSecs = 0;
var _lastNSecs = 0;

// See https://github.com/broofa/node-uuid for API details
function v1$1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];

  options = options || {};

  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

  // Time since last uuid creation (in msecs)
  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += 12219292800000;

  // `time_low`
  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = clockseq >>> 8 | 0x80;

  // `clock_seq_low`
  b[i++] = clockseq & 0xff;

  // `node`
  var node = options.node || _nodeId;
  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf ? buf : bytesToUuid(b);
}

var v1_1 = v1$1;

var rng$2 = rng_1;
var bytesToUuid$2 = bytesToUuid_1;

function v4$1(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options == 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng$2)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid$2(rnds);
}

var v4_1 = v4$1;

var v1 = v1_1;
var v4 = v4_1;

var uuid = v4;
uuid.v1 = v1;
uuid.v4 = v4;

var index$2 = uuid;

var index$6 = createCommonjsModule(function (module, exports) {
var buffer$$1 = buffer;

if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer$$1;
} else {
  // Copy properties from require('buffer')
  Object.keys(buffer$$1).forEach(function (prop) {
    exports[prop] = buffer$$1[prop];
  });
  exports.Buffer = SafeBuffer;
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

// Copy static methods from Buffer
Object.keys(Buffer).forEach(function (prop) {
  SafeBuffer[prop] = Buffer[prop];
});

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
};

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size);
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding);
    } else {
      buf.fill(fill);
    }
  } else {
    buf.fill(0);
  }
  return buf
};

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
};

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer$$1.SlowBuffer(size)
};
});

// base-x encoding
// Forked from https://github.com/cryptocoinjs/bs58
// Originally written by Mike Hearn for BitcoinJ
// Copyright (c) 2011 Google Inc
// Ported to JavaScript by Stefan Thomas
// Merged Buffer refactorings from base58-native by Stephen Pair
// Copyright (c) 2013 BitPay Inc

var Buffer$1 = index$6.Buffer;

var index$4 = function base (ALPHABET) {
  var ALPHABET_MAP = {};
  var BASE = ALPHABET.length;
  var LEADER = ALPHABET.charAt(0);

  // pre-compute lookup table
  for (var z = 0; z < ALPHABET.length; z++) {
    var x = ALPHABET.charAt(z);

    if (ALPHABET_MAP[x] !== undefined) throw new TypeError(x + ' is ambiguous')
    ALPHABET_MAP[x] = z;
  }

  function encode (source) {
    if (source.length === 0) return ''

    var digits = [0];
    for (var i = 0; i < source.length; ++i) {
      for (var j = 0, carry = source[i]; j < digits.length; ++j) {
        carry += digits[j] << 8;
        digits[j] = carry % BASE;
        carry = (carry / BASE) | 0;
      }

      while (carry > 0) {
        digits.push(carry % BASE);
        carry = (carry / BASE) | 0;
      }
    }

    var string = '';

    // deal with leading zeros
    for (var k = 0; source[k] === 0 && k < source.length - 1; ++k) string += ALPHABET[0];
    // convert digits to a string
    for (var q = digits.length - 1; q >= 0; --q) string += ALPHABET[digits[q]];

    return string
  }

  function decodeUnsafe (string) {
    if (string.length === 0) return Buffer$1.allocUnsafe(0)

    var bytes = [0];
    for (var i = 0; i < string.length; i++) {
      var value = ALPHABET_MAP[string[i]];
      if (value === undefined) return

      for (var j = 0, carry = value; j < bytes.length; ++j) {
        carry += bytes[j] * BASE;
        bytes[j] = carry & 0xff;
        carry >>= 8;
      }

      while (carry > 0) {
        bytes.push(carry & 0xff);
        carry >>= 8;
      }
    }

    // deal with leading zeros
    for (var k = 0; string[k] === LEADER && k < string.length - 1; ++k) {
      bytes.push(0);
    }

    return Buffer$1.from(bytes.reverse())
  }

  function decode (string) {
    var buffer$$1 = decodeUnsafe(string);
    if (buffer$$1) return buffer$$1

    throw new Error('Non-base' + BASE + ' character')
  }

  return {
    encode: encode,
    decodeUnsafe: decodeUnsafe,
    decode: decode
  }
};

var index = createCommonjsModule(function (module) {
'use strict';

var uuid  = index$2;
var BaseX = index$4;
var basex = BaseX('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

var ids = module.exports = {
  separator: '_',

  uuid: function() {
    var buffer$$1 = new Buffer(16);
    uuid.v4(null, buffer$$1);
    return basex.encode(buffer$$1);
  },

  id: function(prefix, separator) {
    separator = void 0 === separator ? ids.separator : separator || '';
    return prefix + separator + ids.uuid();
  },

  create: function(prefix, separator) {
    return ids.id.bind(null, prefix, separator);
  }
};
});

var index_3 = index.id;

var toHeaderName = function (str) {
  return (str || '').toString().trim();
};

var toHeaderId = function (str) {
  return toHeaderName(str).toLowerCase();
};

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var find = function (collection, str) {
  var searchHeaderId = toHeaderId(str);
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = collection[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _step$value = slicedToArray(_step.value, 3),
          headerId = _step$value[0],
          headerName = _step$value[1],
          headerValues = _step$value[2];

      if (headerId === searchHeaderId) {
        return headerValues;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return null;
};

var append = function (collection, str, value) {
  var existingHeader = find(collection, str);
  if (!existingHeader) {
    existingHeader = [];
    collection.push([toHeaderId(str), toHeaderName(str), existingHeader]);
  }
  // only string is allowed
  existingHeader.push('' + value);
};

var remove = function (collection, str) {
  var existingHeader = find(collection, str);
  if (existingHeader) {
    existingHeader.length = 0;
  }
};

var replace = function (collection, str, values) {
  remove(collection, str);
  values.forEach(function (value) {
    return append(collection, str, value);
  });
};

var fromHash = function (obj, isFlat) {
  if (void 0 === isFlat) isFlat = true; // default to expecting flat
  obj = obj || {};
  var collection = [];
  Object.keys(obj).forEach(function (key) {
    var value = obj[key];
    if (isFlat) {
      append(collection, key, value);
    } else {
      if (!Array.isArray(value)) {
        value = [value];
      }
      value.forEach(function (item) {
        return append(collection, key, item);
      });
    }
  });
  return collection;
};

var toHash = function (collection, flatten, strict) {
  if (void 0 === flatten) flatten = true;
  if (void 0 === strict) strict = true;
  var obj = {};
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = collection[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _step$value = slicedToArray(_step.value, 3),
          headerId = _step$value[0],
          headerName = _step$value[1],
          headerValues = _step$value[2];

      var isEmpty = headerValues.length === 0;
      if (!isEmpty || true !== strict) {
        var value = void 0;
        if (isEmpty) {
          value = flatten ? null : [];
        } else {
          value = flatten ? headerValues[headerValues.length - 1] : Array.prototype.slice.call(headerValues);
        }
        obj[headerName] = value;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};





var slicedToArray$1 = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var HttpHeaders = function () {
  function HttpHeaders(arrOrHash) {
    classCallCheck(this, HttpHeaders);

    this._collection = [];
    this.import(arrOrHash);
  }

  createClass(HttpHeaders, [{
    key: 'import',
    value: function _import(arrOrHash) {
      if (Array.isArray(arrOrHash)) {
        this._collection = arrOrHash;
      } else if (null !== arrOrHash && undefined !== arrOrHash) {
        this._collection = fromHash(arrOrHash, true);
      }
    }
  }, {
    key: 'get',
    value: function get$$1(headerName) {
      var headerValues = find(this._collection, headerName);
      return null === headerValues ? undefined : headerValues[0];
    }
  }, {
    key: 'add',
    value: function add(headerName, headerValue) {
      // apigateway doesn't support dupe header names (multiple values)
      replace(this._collection, headerName, [headerValue]);
    }
  }, {
    key: 'remove',
    value: function remove$$1(headerName) {
      remove(this._collection, headerName);
    }
  }, {
    key: 'toRawHeaders',
    value: function toRawHeaders() {
      var rawHeaders = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this._collection[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = slicedToArray$1(_step.value, 3),
              headerId = _step$value[0],
              headerName = _step$value[1],
              headerValues = _step$value[2];

          var headerValue = headerValues[0];
          if (headerValue && null !== headerValue) {
            rawHeaders.push(headerName + ': ' + headerValue);
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return rawHeaders;
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      var flattenHeaderValues = true;
      var strictHeaderValueRequired = true;
      return toHash(this._collection, flattenHeaderValues, strictHeaderValueRequired);
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.toRawHeaders().join('\n');
    }

    // array methods

  }, {
    key: '_nativeArrayMethod',
    value: function _nativeArrayMethod(method, args) {
      return this._collection[method].apply(this._collection, args);
    }
  }, {
    key: 'forEach',
    value: function forEach() {
      return this._nativeArrayMethod('forEach', arguments);
    }
  }, {
    key: 'every',
    value: function every() {
      return this._nativeArrayMethod('every', arguments);
    }
  }, {
    key: 'filter',
    value: function filter() {
      return this._nativeArrayMethod('filter', arguments);
    }
  }, {
    key: 'find',
    value: function find$$1() {
      return this._nativeArrayMethod('find', arguments);
    }
  }, {
    key: 'includes',
    value: function includes() {
      return this._nativeArrayMethod('includes', arguments);
    }
  }, {
    key: 'map',
    value: function map() {
      return this._nativeArrayMethod('map', arguments);
    }
  }, {
    key: 'some',
    value: function some() {
      return this._nativeArrayMethod('some', arguments);
    }
  }, {
    key: 'length',
    get: function get$$1() {
      return this._collection.length;
    }
  }]);
  return HttpHeaders;
}();

var HttpMessage = function () {
  function HttpMessage(headers, body, requestId) {
    classCallCheck(this, HttpMessage);

    this._requestId = requestId || index_3('req');
    this._headers = new HttpHeaders(headers);
    this._body = body;
  }

  createClass(HttpMessage, [{
    key: 'requestId',
    get: function get$$1() {
      return this._requestId;
    }
  }, {
    key: 'headers',
    get: function get$$1() {
      return this._headers;
    }
  }, {
    key: 'body',
    get: function get$$1() {
      return this._body;
    },
    set: function set$$1(value) {
      this._body = value;
    }
  }]);
  return HttpMessage;
}();

var ApigatewayHttpRequest = function (_HttpMessage) {
  inherits(ApigatewayHttpRequest, _HttpMessage);

  function ApigatewayHttpRequest(data) {
    classCallCheck(this, ApigatewayHttpRequest);

    data = data || {};

    var _this = possibleConstructorReturn(this, (ApigatewayHttpRequest.__proto__ || Object.getPrototypeOf(ApigatewayHttpRequest)).call(this, data.headers, data.body, data.requestId));

    _this.resource = data.resource || null;
    _this.method = data.method || null;
    _this.path = data.path || [];
    _this.querystring = data.querystring || {};
    _this.context = data.context || {};
    return _this;
  }

  createClass(ApigatewayHttpRequest, [{
    key: 'toJSON',
    value: function toJSON() {
      return {
        headers: this.headers.toJSON(),
        body: this.body,
        requestId: this.requestId,
        resource: this.resource,
        method: this.method,
        path: this.path,
        querystring: this.querystring,
        context: this.context
      };
    }
  }, {
    key: 'query',
    get: function get$$1() {
      return this.querystring;
    }
  }]);
  return ApigatewayHttpRequest;
}(HttpMessage);

function assertValidStatusCode(value) {
  if (isNaN(value)) throw new Error('statusCode must be number');
  if (value < 0) throw new Error('statusCode must be positive number');
  if (Math.floor(value) !== value) throw new Error('statusCode must be whole number');
}

var BaseResponse = function (_HttpMessage) {
  inherits(BaseResponse, _HttpMessage);

  function BaseResponse(body, statusCode, headers, requestId) {
    classCallCheck(this, BaseResponse);

    var _this = possibleConstructorReturn(this, (BaseResponse.__proto__ || Object.getPrototypeOf(BaseResponse)).call(this, headers, body, requestId));

    _this._statusCode = statusCode || 0;
    return _this;
  }

  createClass(BaseResponse, [{
    key: 'addCORS',
    value: function addCORS(scope) {
      this.headers.add('access-control-allow-origin', scope);
    }
  }, {
    key: 'addGlobalCORS',
    value: function addGlobalCORS() {
      this.addCORS('*');
    }
  }, {
    key: 'toResponse',
    value: function toResponse() {
      return this.body;
    }
  }, {
    key: 'format',
    value: function format() {
      var statusCode = this.statusCode;
      var body = this.toResponse();
      var encBody = null;
      if (Buffer.isBuffer(body)) {
        encBody = body.toString('base64');
        this.headers.add('content-type', 'application/octet-stream');
      } else if (undefined !== body) {
        encBody = JSON.stringify(body);
        this.headers.add('content-type', 'application/json');
      } else {
        // noop.  no body
      }
      return {
        statusCode: statusCode,
        headers: this.headers.toJSON(),
        body: encBody
      };
    }
  }, {
    key: 'statusCode',
    get: function get$$1() {
      return this._statusCode;
    },
    set: function set$$1(value) {
      assertValidStatusCode(value);
      this._statusCode = value;
    }
  }]);
  return BaseResponse;
}(HttpMessage);

var ErrorResponse = function (_BaseResponse) {
  inherits(ErrorResponse, _BaseResponse);

  function ErrorResponse(message, type, statusCode, headers, requestId) {
    classCallCheck(this, ErrorResponse);

    var _this = possibleConstructorReturn(this, (ErrorResponse.__proto__ || Object.getPrototypeOf(ErrorResponse)).call(this, undefined, statusCode, headers, requestId));

    _this.type = type || ErrorResponse.UNKNOWN;
    _this.message = message || null;
    _this.code = null;
    _this.request = null;
    return _this;
  }

  createClass(ErrorResponse, [{
    key: 'toResponse',
    value: function toResponse() {
      return {
        error: {
          type: this.type,
          message: this.message,
          code: this.code,
          request: this.request
        }
      };
    }
  }]);
  return ErrorResponse;
}(BaseResponse);

ErrorResponse.UNKNOWN = 'unknown_error';
ErrorResponse.NETWORK = 'network_error';
ErrorResponse.API = 'api_error';
ErrorResponse.AUTH = 'authentication_error';
ErrorResponse.INVALID_REQUEST = 'invalid_request_error';

var ObjectResponse = function (_BaseResponse) {
  inherits(ObjectResponse, _BaseResponse);

  function ObjectResponse(body, statusCode, headers, requestId) {
    classCallCheck(this, ObjectResponse);
    return possibleConstructorReturn(this, (ObjectResponse.__proto__ || Object.getPrototypeOf(ObjectResponse)).call(this, body, statusCode, headers, requestId));
  }

  createClass(ObjectResponse, [{
    key: 'toResponse',
    value: function toResponse() {
      return this.body;
    }
  }]);
  return ObjectResponse;
}(BaseResponse);

function fromIncomingEvent(event, requestId) {
  var requestContext = event.requestContext;
  var headers = event.headers || {};
  var body = event.body || null;
  var path = ((event.pathParameters || {}).proxy || '').split('/');
  var request = new ApigatewayHttpRequest({
    headers: headers,
    requestId: requestId || requestContext.requestId,
    method: event.httpMethod || null,
    path: path,
    resource: path.shift(),
    querystring: event.queryStringParameters,
    context: requestContext
  });
  if (event.isBase64Encoded) {
    request.body = new Buffer(body, 'base64').toString();
  } else if (typeof body === 'string') {
    request.body = JSON.parse(body);
  }
  return request;
}

exports.ApigatewayHttpRequest = ApigatewayHttpRequest;
exports.ApigatewayHttpBaseResponse = BaseResponse;
exports.ApigatewayHttpErrorResponse = ErrorResponse;
exports.ApigatewayHttpSuccessResponse = ObjectResponse;
exports.fromIncomingEvent = fromIncomingEvent;

}((this.Bondo = this.Bondo || {}),crypto,buffer));
//# sourceMappingURL=apigateway-http-request.js.map
