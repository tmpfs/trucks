(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["skate"] = factory();
	else
		root["skate"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.vdom = exports.symbols = exports.state = exports.ready = exports.prop = exports.link = exports.emit = exports.define = exports.Component = undefined;
	
	var _prop = __webpack_require__(1);
	
	var prop = _interopRequireWildcard(_prop);
	
	var _symbols = __webpack_require__(4);
	
	var symbols = _interopRequireWildcard(_symbols);
	
	var _vdom = __webpack_require__(5);
	
	var vdom = _interopRequireWildcard(_vdom);
	
	var _component = __webpack_require__(8);
	
	var _component2 = _interopRequireDefault(_component);
	
	var _define = __webpack_require__(11);
	
	var _define2 = _interopRequireDefault(_define);
	
	var _emit = __webpack_require__(18);
	
	var _emit2 = _interopRequireDefault(_emit);
	
	var _link = __webpack_require__(19);
	
	var _link2 = _interopRequireDefault(_link);
	
	var _ready = __webpack_require__(21);
	
	var _ready2 = _interopRequireDefault(_ready);
	
	var _state = __webpack_require__(20);
	
	var _state2 = _interopRequireDefault(_state);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	exports.Component = _component2.default;
	exports.define = _define2.default;
	exports.emit = _emit2.default;
	exports.link = _link2.default;
	exports.prop = prop;
	exports.ready = _ready2.default;
	exports.state = _state2.default;
	exports.symbols = symbols;
	exports.vdom = vdom;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.string = exports.number = exports.boolean = exports.array = undefined;
	exports.create = create;
	
	var _assign = __webpack_require__(2);
	
	var _assign2 = _interopRequireDefault(_assign);
	
	var _empty = __webpack_require__(3);
	
	var _empty2 = _interopRequireDefault(_empty);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var alwaysUndefinedIfNotANumberOrNumber = function alwaysUndefinedIfNotANumberOrNumber(val) {
	  return isNaN(val) ? undefined : Number(val);
	};
	var alwaysUndefinedIfEmptyOrString = function alwaysUndefinedIfEmptyOrString(val) {
	  return (0, _empty2.default)(val) ? undefined : String(val);
	};
	
	function create(def) {
	  return function () {
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    args.unshift({}, def);
	    return _assign2.default.apply(null, args);
	  };
	}
	
	var array = exports.array = create({
	  coerce: function coerce(val) {
	    return Array.isArray(val) ? val : [val];
	  },
	  default: function _default() {
	    return [];
	  },
	  deserialize: JSON.parse,
	  serialize: JSON.stringify
	});
	
	var boolean = exports.boolean = create({
	  coerce: function coerce(value) {
	    return !!value;
	  },
	  default: false,
	  deserialize: function deserialize(value) {
	    return !(value === null);
	  },
	  serialize: function serialize(value) {
	    return value ? '' : undefined;
	  }
	});
	
	var number = exports.number = create({
	  default: 0,
	  coerce: alwaysUndefinedIfNotANumberOrNumber,
	  deserialize: alwaysUndefinedIfNotANumberOrNumber,
	  serialize: alwaysUndefinedIfNotANumberOrNumber
	});
	
	var string = exports.string = create({
	  coerce: alwaysUndefinedIfEmptyOrString,
	  deserialize: alwaysUndefinedIfEmptyOrString,
	  serialize: alwaysUndefinedIfEmptyOrString
	});

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var assign = Object.assign;
	exports.default = assign ? assign.bind(Object) : function (obj) {
	  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    args[_key - 1] = arguments[_key];
	  }
	
	  args.forEach(function (arg) {
	    return Object.keys(arg).forEach(function (name) {
	      return obj[name] = arg[name];
	    });
	  });
	  return obj;
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (val) {
	  return typeof val === 'undefined' || val === null;
	};

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var created = exports.created = '____created';
	var events = exports.events = '____events';
	var name = exports.name = '____name';
	var props = exports.props = '____props';
	var renderer = exports.renderer = '____renderer';
	var rendererDebounced = exports.rendererDebounced = '____rendererDebounced';
	var shadowRoot = exports.shadowRoot = '____shadowRoot';

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.text = exports.elementVoid = exports.elementOpenStart = exports.elementOpen = exports.elementOpenEnd = exports.elementClose = exports.attr = undefined;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	exports.element = element;
	
	var _incrementalDom = __webpack_require__(6);
	
	var _symbols = __webpack_require__(4);
	
	var skateSymbols = _interopRequireWildcard(_symbols);
	
	var _support = __webpack_require__(7);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var fallbackToV0 = !_support.shadowDomV1 && _support.shadowDomV0;
	var applyDefault = _incrementalDom.attributes[_incrementalDom.symbols.default];
	
	// Attributes that are not handled by Incremental DOM.
	_incrementalDom.attributes.key = _incrementalDom.attributes.skip = _incrementalDom.attributes.statics = function () {};
	
	// Attributes that *must* be set via a property on all elements.
	_incrementalDom.attributes.checked = _incrementalDom.attributes.className = _incrementalDom.attributes.disabled = _incrementalDom.attributes.value = _incrementalDom.applyProp;
	
	// Default attribute applicator.
	_incrementalDom.attributes[_incrementalDom.symbols.default] = function (elem, name, value) {
	  // Boolean false values should not set attributes at all.
	  if (value === false) {
	    return;
	  }
	
	  // If the skip attribute was specified, skip
	  if (name === 'skip' && value) {
	    return (0, _incrementalDom.skip)();
	  }
	
	  // Custom element properties should be set as properties.
	  var props = elem.constructor.props;
	  if (props && name in props) {
	    return (0, _incrementalDom.applyProp)(elem, name, value);
	  }
	
	  // Handle built-in and custom events.
	  if (name.indexOf('on') === 0) {
	    return name in elem ? (0, _incrementalDom.applyProp)(elem, name, value) : applyEvent(elem, name.substring(2), name, value);
	  }
	
	  // Set the select attribute instead of name if it was a <slot> translated to
	  // a <content> for v0.
	  if (name === 'name' && elem.tagName === 'CONTENT') {
	    name = 'select';
	    value = '[slot="' + value + '"]';
	  }
	
	  // Fallback to default IncrementalDOM behaviour.
	  applyDefault(elem, name, value);
	};
	
	// Adds or removes an event listener for an element.
	function applyEvent(elem, ename, name, value) {
	  var events = elem.__events;
	
	  if (!events) {
	    events = elem.__events = {};
	  }
	
	  var eFunc = events[ename];
	
	  // Remove old listener so they don't double up.
	  if (eFunc) {
	    elem.removeEventListener(ename, eFunc);
	  }
	
	  // Bind new listener.
	  if (value) {
	    elem.addEventListener(ename, events[ename] = value);
	  }
	}
	
	// Returns the tag name of the element if a custom element constructor was
	// provided instead of a string.
	function decideIfConstructorOrNot(tname) {
	  return typeof tname === 'function' ? tname[skateSymbols.name] : tname;
	}
	
	// Returns the correct tag name so we can use <content> instead of <slot> if we
	// need to use Shadow DOM V0.
	function decideIfContentTagOrNot(tname) {
	  return tname === 'slot' && fallbackToV0 ? 'content' : tname;
	}
	
	// Patch elementOpen() so that anything that compiles down to Incremental DOM
	// gets the special behaviour.
	function newElementOpen() {
	  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	    args[_key] = arguments[_key];
	  }
	
	  args[0] = decideIfConstructorOrNot(decideIfContentTagOrNot(args[0]));
	  return _incrementalDom.elementOpen.apply(null, args);
	}
	
	// Patch elementOpenStart() for the same reason we patched elementOpen().
	function newElementOpenStart() {
	  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	    args[_key2] = arguments[_key2];
	  }
	
	  args[0] = decideIfConstructorOrNot(decideIfContentTagOrNot(args[0]));
	  return _incrementalDom.elementOpenStart.apply(null, args);
	}
	
	// Patch elementVoid() for the same reason we patched elementOpen().
	function newElementVoid() {
	  for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
	    args[_key3] = arguments[_key3];
	  }
	
	  args[0] = decideIfConstructorOrNot(decideIfContentTagOrNot(args[0]));
	  return _incrementalDom.elementVoid.apply(null, args);
	}
	
	// Convenience function for declaring an Incremental DOM element using
	// hyperscript-style syntax.
	function element(tname, attrs, chren) {
	  var atype = typeof attrs === 'undefined' ? 'undefined' : _typeof(attrs);
	
	  if (atype === 'function') {
	    chren = attrs;
	  }
	
	  if (atype !== 'object') {
	    attrs = {};
	  }
	
	  // We open the element so we can set attrs after.
	  newElementOpenStart(tname, attrs.key, attrs.statics);
	
	  // Delete so special attrs don't actually get set.
	  delete attrs.key;
	  delete attrs.statics;
	
	  // Set attributes.
	  Object.keys(attrs).forEach(function (name) {
	    return (0, _incrementalDom.attr)(name, attrs[name]);
	  });
	
	  // Close before we render the descendant tree.
	  (0, _incrementalDom.elementOpenEnd)();
	
	  var ctype = typeof chren === 'undefined' ? 'undefined' : _typeof(chren);
	  if (ctype === 'function') {
	    chren();
	  } else if (ctype === 'string' || ctype === 'number') {
	    (0, _incrementalDom.text)(chren);
	  }
	
	  return (0, _incrementalDom.elementClose)(tname);
	}
	
	// We don't have to do anything special for the text function; it's just a
	// straight export from Incremental DOM.
	exports.attr = _incrementalDom.attr;
	exports.elementClose = _incrementalDom.elementClose;
	exports.elementOpenEnd = _incrementalDom.elementOpenEnd;
	exports.elementOpen = newElementOpen;
	exports.elementOpenStart = newElementOpenStart;
	exports.elementVoid = newElementVoid;
	exports.text = _incrementalDom.text;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * @license
	 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS-IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	
	'use strict';
	
	/**
	 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS-IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	
	/**
	 * A cached reference to the hasOwnProperty function.
	 */
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	
	/**
	 * A cached reference to the create function.
	 */
	var create = Object.create;
	
	/**
	 * Used to prevent property collisions between our "map" and its prototype.
	 * @param {!Object<string, *>} map The map to check.
	 * @param {string} property The property to check.
	 * @return {boolean} Whether map has property.
	 */
	var has = function has(map, property) {
	  return hasOwnProperty.call(map, property);
	};
	
	/**
	 * Creates an map object without a prototype.
	 * @return {!Object}
	 */
	var createMap = function createMap() {
	  return create(null);
	};
	
	/**
	 * Keeps track of information needed to perform diffs for a given DOM node.
	 * @param {!string} nodeName
	 * @param {?string=} key
	 * @constructor
	 */
	function NodeData(nodeName, key) {
	  /**
	   * The attributes and their values.
	   * @const {!Object<string, *>}
	   */
	  this.attrs = createMap();
	
	  /**
	   * An array of attribute name/value pairs, used for quickly diffing the
	   * incomming attributes to see if the DOM node's attributes need to be
	   * updated.
	   * @const {Array<*>}
	   */
	  this.attrsArr = [];
	
	  /**
	   * The incoming attributes for this Node, before they are updated.
	   * @const {!Object<string, *>}
	   */
	  this.newAttrs = createMap();
	
	  /**
	   * The key used to identify this node, used to preserve DOM nodes when they
	   * move within their parent.
	   * @const
	   */
	  this.key = key;
	
	  /**
	   * Keeps track of children within this node by their key.
	   * {?Object<string, !Element>}
	   */
	  this.keyMap = null;
	
	  /**
	   * Whether or not the keyMap is currently valid.
	   * {boolean}
	   */
	  this.keyMapValid = true;
	
	  /**
	   * The node name for this node.
	   * @const {string}
	   */
	  this.nodeName = nodeName;
	
	  /**
	   * @type {?string}
	   */
	  this.text = null;
	}
	
	/**
	 * Initializes a NodeData object for a Node.
	 *
	 * @param {Node} node The node to initialize data for.
	 * @param {string} nodeName The node name of node.
	 * @param {?string=} key The key that identifies the node.
	 * @return {!NodeData} The newly initialized data object
	 */
	var initData = function initData(node, nodeName, key) {
	  var data = new NodeData(nodeName, key);
	  node['__incrementalDOMData'] = data;
	  return data;
	};
	
	/**
	 * Retrieves the NodeData object for a Node, creating it if necessary.
	 *
	 * @param {Node} node The node to retrieve the data for.
	 * @return {!NodeData} The NodeData for this Node.
	 */
	var getData = function getData(node) {
	  var data = node['__incrementalDOMData'];
	
	  if (!data) {
	    var nodeName = node.nodeName.toLowerCase();
	    var key = null;
	
	    if (node instanceof Element) {
	      key = node.getAttribute('key');
	    }
	
	    data = initData(node, nodeName, key);
	  }
	
	  return data;
	};
	
	/**
	 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS-IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	
	/** @const */
	var symbols = {
	  default: '__default',
	
	  placeholder: '__placeholder'
	};
	
	/**
	 * @param {string} name
	 * @return {string|undefined} The namespace to use for the attribute.
	 */
	var getNamespace = function getNamespace(name) {
	  if (name.lastIndexOf('xml:', 0) === 0) {
	    return 'http://www.w3.org/XML/1998/namespace';
	  }
	
	  if (name.lastIndexOf('xlink:', 0) === 0) {
	    return 'http://www.w3.org/1999/xlink';
	  }
	};
	
	/**
	 * Applies an attribute or property to a given Element. If the value is null
	 * or undefined, it is removed from the Element. Otherwise, the value is set
	 * as an attribute.
	 * @param {!Element} el
	 * @param {string} name The attribute's name.
	 * @param {?(boolean|number|string)=} value The attribute's value.
	 */
	var applyAttr = function applyAttr(el, name, value) {
	  if (value == null) {
	    el.removeAttribute(name);
	  } else {
	    var attrNS = getNamespace(name);
	    if (attrNS) {
	      el.setAttributeNS(attrNS, name, value);
	    } else {
	      el.setAttribute(name, value);
	    }
	  }
	};
	
	/**
	 * Applies a property to a given Element.
	 * @param {!Element} el
	 * @param {string} name The property's name.
	 * @param {*} value The property's value.
	 */
	var applyProp = function applyProp(el, name, value) {
	  el[name] = value;
	};
	
	/**
	 * Applies a style to an Element. No vendor prefix expansion is done for
	 * property names/values.
	 * @param {!Element} el
	 * @param {string} name The attribute's name.
	 * @param {*} style The style to set. Either a string of css or an object
	 *     containing property-value pairs.
	 */
	var applyStyle = function applyStyle(el, name, style) {
	  if (typeof style === 'string') {
	    el.style.cssText = style;
	  } else {
	    el.style.cssText = '';
	    var elStyle = el.style;
	    var obj = /** @type {!Object<string,string>} */style;
	
	    for (var prop in obj) {
	      if (has(obj, prop)) {
	        elStyle[prop] = obj[prop];
	      }
	    }
	  }
	};
	
	/**
	 * Updates a single attribute on an Element.
	 * @param {!Element} el
	 * @param {string} name The attribute's name.
	 * @param {*} value The attribute's value. If the value is an object or
	 *     function it is set on the Element, otherwise, it is set as an HTML
	 *     attribute.
	 */
	var applyAttributeTyped = function applyAttributeTyped(el, name, value) {
	  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
	
	  if (type === 'object' || type === 'function') {
	    applyProp(el, name, value);
	  } else {
	    applyAttr(el, name, /** @type {?(boolean|number|string)} */value);
	  }
	};
	
	/**
	 * Calls the appropriate attribute mutator for this attribute.
	 * @param {!Element} el
	 * @param {string} name The attribute's name.
	 * @param {*} value The attribute's value.
	 */
	var updateAttribute = function updateAttribute(el, name, value) {
	  var data = getData(el);
	  var attrs = data.attrs;
	
	  if (attrs[name] === value) {
	    return;
	  }
	
	  var mutator = attributes[name] || attributes[symbols.default];
	  mutator(el, name, value);
	
	  attrs[name] = value;
	};
	
	/**
	 * A publicly mutable object to provide custom mutators for attributes.
	 * @const {!Object<string, function(!Element, string, *)>}
	 */
	var attributes = createMap();
	
	// Special generic mutator that's called for any attribute that does not
	// have a specific mutator.
	attributes[symbols.default] = applyAttributeTyped;
	
	attributes[symbols.placeholder] = function () {};
	
	attributes['style'] = applyStyle;
	
	/**
	 * Gets the namespace to create an element (of a given tag) in.
	 * @param {string} tag The tag to get the namespace for.
	 * @param {?Node} parent
	 * @return {?string} The namespace to create the tag in.
	 */
	var getNamespaceForTag = function getNamespaceForTag(tag, parent) {
	  if (tag === 'svg') {
	    return 'http://www.w3.org/2000/svg';
	  }
	
	  if (getData(parent).nodeName === 'foreignObject') {
	    return null;
	  }
	
	  return parent.namespaceURI;
	};
	
	/**
	 * Creates an Element.
	 * @param {Document} doc The document with which to create the Element.
	 * @param {?Node} parent
	 * @param {string} tag The tag for the Element.
	 * @param {?string=} key A key to identify the Element.
	 * @param {?Array<*>=} statics An array of attribute name/value pairs of the
	 *     static attributes for the Element.
	 * @return {!Element}
	 */
	var createElement = function createElement(doc, parent, tag, key, statics) {
	  var namespace = getNamespaceForTag(tag, parent);
	  var el = undefined;
	
	  if (namespace) {
	    el = doc.createElementNS(namespace, tag);
	  } else {
	    el = doc.createElement(tag);
	  }
	
	  initData(el, tag, key);
	
	  if (statics) {
	    for (var i = 0; i < statics.length; i += 2) {
	      updateAttribute(el, /** @type {!string}*/statics[i], statics[i + 1]);
	    }
	  }
	
	  return el;
	};
	
	/**
	 * Creates a Text Node.
	 * @param {Document} doc The document with which to create the Element.
	 * @return {!Text}
	 */
	var createText = function createText(doc) {
	  var node = doc.createTextNode('');
	  initData(node, '#text', null);
	  return node;
	};
	
	/**
	 * Creates a mapping that can be used to look up children using a key.
	 * @param {?Node} el
	 * @return {!Object<string, !Element>} A mapping of keys to the children of the
	 *     Element.
	 */
	var createKeyMap = function createKeyMap(el) {
	  var map = createMap();
	  var child = el.firstElementChild;
	
	  while (child) {
	    var key = getData(child).key;
	
	    if (key) {
	      map[key] = child;
	    }
	
	    child = child.nextElementSibling;
	  }
	
	  return map;
	};
	
	/**
	 * Retrieves the mapping of key to child node for a given Element, creating it
	 * if necessary.
	 * @param {?Node} el
	 * @return {!Object<string, !Node>} A mapping of keys to child Elements
	 */
	var getKeyMap = function getKeyMap(el) {
	  var data = getData(el);
	
	  if (!data.keyMap) {
	    data.keyMap = createKeyMap(el);
	  }
	
	  return data.keyMap;
	};
	
	/**
	 * Retrieves a child from the parent with the given key.
	 * @param {?Node} parent
	 * @param {?string=} key
	 * @return {?Node} The child corresponding to the key.
	 */
	var getChild = function getChild(parent, key) {
	  return key ? getKeyMap(parent)[key] : null;
	};
	
	/**
	 * Registers an element as being a child. The parent will keep track of the
	 * child using the key. The child can be retrieved using the same key using
	 * getKeyMap. The provided key should be unique within the parent Element.
	 * @param {?Node} parent The parent of child.
	 * @param {string} key A key to identify the child with.
	 * @param {!Node} child The child to register.
	 */
	var registerChild = function registerChild(parent, key, child) {
	  getKeyMap(parent)[key] = child;
	};
	
	/**
	 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS-IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	
	/** @const */
	var notifications = {
	  /**
	   * Called after patch has compleated with any Nodes that have been created
	   * and added to the DOM.
	   * @type {?function(Array<!Node>)}
	   */
	  nodesCreated: null,
	
	  /**
	   * Called after patch has compleated with any Nodes that have been removed
	   * from the DOM.
	   * Note it's an applications responsibility to handle any childNodes.
	   * @type {?function(Array<!Node>)}
	   */
	  nodesDeleted: null
	};
	
	/**
	 * Keeps track of the state of a patch.
	 * @constructor
	 */
	function Context() {
	  /**
	   * @type {(Array<!Node>|undefined)}
	   */
	  this.created = notifications.nodesCreated && [];
	
	  /**
	   * @type {(Array<!Node>|undefined)}
	   */
	  this.deleted = notifications.nodesDeleted && [];
	}
	
	/**
	 * @param {!Node} node
	 */
	Context.prototype.markCreated = function (node) {
	  if (this.created) {
	    this.created.push(node);
	  }
	};
	
	/**
	 * @param {!Node} node
	 */
	Context.prototype.markDeleted = function (node) {
	  if (this.deleted) {
	    this.deleted.push(node);
	  }
	};
	
	/**
	 * Notifies about nodes that were created during the patch opearation.
	 */
	Context.prototype.notifyChanges = function () {
	  if (this.created && this.created.length > 0) {
	    notifications.nodesCreated(this.created);
	  }
	
	  if (this.deleted && this.deleted.length > 0) {
	    notifications.nodesDeleted(this.deleted);
	  }
	};
	
	/**
	* Makes sure that keyed Element matches the tag name provided.
	* @param {!string} nodeName The nodeName of the node that is being matched.
	* @param {string=} tag The tag name of the Element.
	* @param {?string=} key The key of the Element.
	*/
	var assertKeyedTagMatches = function assertKeyedTagMatches(nodeName, tag, key) {
	  if (nodeName !== tag) {
	    throw new Error('Was expecting node with key "' + key + '" to be a ' + tag + ', not a ' + nodeName + '.');
	  }
	};
	
	/** @type {?Context} */
	var context = null;
	
	/** @type {?Node} */
	var currentNode = null;
	
	/** @type {?Node} */
	var currentParent = null;
	
	/** @type {?Element|?DocumentFragment} */
	var root = null;
	
	/** @type {?Document} */
	var doc = null;
	
	/**
	 * Returns a patcher function that sets up and restores a patch context,
	 * running the run function with the provided data.
	 * @param {function((!Element|!DocumentFragment),!function(T),T=)} run
	 * @return {function((!Element|!DocumentFragment),!function(T),T=)}
	 * @template T
	 */
	var patchFactory = function patchFactory(run) {
	  /**
	   * TODO(moz): These annotations won't be necessary once we switch to Closure
	   * Compiler's new type inference. Remove these once the switch is done.
	   *
	   * @param {(!Element|!DocumentFragment)} node
	   * @param {!function(T)} fn
	   * @param {T=} data
	   * @template T
	   */
	  var f = function f(node, fn, data) {
	    var prevContext = context;
	    var prevRoot = root;
	    var prevDoc = doc;
	    var prevCurrentNode = currentNode;
	    var prevCurrentParent = currentParent;
	    var previousInAttributes = false;
	    var previousInSkip = false;
	
	    context = new Context();
	    root = node;
	    doc = node.ownerDocument;
	    currentParent = node.parentNode;
	
	    if (false) {}
	
	    run(node, fn, data);
	
	    if (false) {}
	
	    context.notifyChanges();
	
	    context = prevContext;
	    root = prevRoot;
	    doc = prevDoc;
	    currentNode = prevCurrentNode;
	    currentParent = prevCurrentParent;
	  };
	  return f;
	};
	
	/**
	 * Patches the document starting at node with the provided function. This
	 * function may be called during an existing patch operation.
	 * @param {!Element|!DocumentFragment} node The Element or Document
	 *     to patch.
	 * @param {!function(T)} fn A function containing elementOpen/elementClose/etc.
	 *     calls that describe the DOM.
	 * @param {T=} data An argument passed to fn to represent DOM state.
	 * @template T
	 */
	var patchInner = patchFactory(function (node, fn, data) {
	  currentNode = node;
	
	  enterNode();
	  fn(data);
	  exitNode();
	
	  if (false) {}
	});
	
	/**
	 * Patches an Element with the the provided function. Exactly one top level
	 * element call should be made corresponding to `node`.
	 * @param {!Element} node The Element where the patch should start.
	 * @param {!function(T)} fn A function containing elementOpen/elementClose/etc.
	 *     calls that describe the DOM. This should have at most one top level
	 *     element call.
	 * @param {T=} data An argument passed to fn to represent DOM state.
	 * @template T
	 */
	var patchOuter = patchFactory(function (node, fn, data) {
	  currentNode = /** @type {!Element} */{ nextSibling: node };
	
	  fn(data);
	
	  if (false) {}
	});
	
	/**
	 * Checks whether or not the current node matches the specified nodeName and
	 * key.
	 *
	 * @param {?string} nodeName The nodeName for this node.
	 * @param {?string=} key An optional key that identifies a node.
	 * @return {boolean} True if the node matches, false otherwise.
	 */
	var matches = function matches(nodeName, key) {
	  var data = getData(currentNode);
	
	  // Key check is done using double equals as we want to treat a null key the
	  // same as undefined. This should be okay as the only values allowed are
	  // strings, null and undefined so the == semantics are not too weird.
	  return nodeName === data.nodeName && key == data.key;
	};
	
	/**
	 * Aligns the virtual Element definition with the actual DOM, moving the
	 * corresponding DOM node to the correct location or creating it if necessary.
	 * @param {string} nodeName For an Element, this should be a valid tag string.
	 *     For a Text, this should be #text.
	 * @param {?string=} key The key used to identify this element.
	 * @param {?Array<*>=} statics For an Element, this should be an array of
	 *     name-value pairs.
	 */
	var alignWithDOM = function alignWithDOM(nodeName, key, statics) {
	  if (currentNode && matches(nodeName, key)) {
	    return;
	  }
	
	  var node = undefined;
	
	  // Check to see if the node has moved within the parent.
	  if (key) {
	    node = getChild(currentParent, key);
	    if (node && 'production' !== 'production') {
	      assertKeyedTagMatches(getData(node).nodeName, nodeName, key);
	    }
	  }
	
	  // Create the node if it doesn't exist.
	  if (!node) {
	    if (nodeName === '#text') {
	      node = createText(doc);
	    } else {
	      node = createElement(doc, currentParent, nodeName, key, statics);
	    }
	
	    if (key) {
	      registerChild(currentParent, key, node);
	    }
	
	    context.markCreated(node);
	  }
	
	  // If the node has a key, remove it from the DOM to prevent a large number
	  // of re-orders in the case that it moved far or was completely removed.
	  // Since we hold on to a reference through the keyMap, we can always add it
	  // back.
	  if (currentNode && getData(currentNode).key) {
	    currentParent.replaceChild(node, currentNode);
	    getData(currentParent).keyMapValid = false;
	  } else {
	    currentParent.insertBefore(node, currentNode);
	  }
	
	  currentNode = node;
	};
	
	/**
	 * Clears out any unvisited Nodes, as the corresponding virtual element
	 * functions were never called for them.
	 */
	var clearUnvisitedDOM = function clearUnvisitedDOM() {
	  var node = currentParent;
	  var data = getData(node);
	  var keyMap = data.keyMap;
	  var keyMapValid = data.keyMapValid;
	  var child = node.lastChild;
	  var key = undefined;
	
	  if (child === currentNode && keyMapValid) {
	    return;
	  }
	
	  if (data.attrs[symbols.placeholder] && node !== root) {
	    if (false) {}
	    return;
	  }
	
	  while (child !== currentNode) {
	    node.removeChild(child);
	    context.markDeleted( /** @type {!Node}*/child);
	
	    key = getData(child).key;
	    if (key) {
	      delete keyMap[key];
	    }
	    child = node.lastChild;
	  }
	
	  // Clean the keyMap, removing any unusued keys.
	  if (!keyMapValid) {
	    for (key in keyMap) {
	      child = keyMap[key];
	      if (child.parentNode !== node) {
	        context.markDeleted(child);
	        delete keyMap[key];
	      }
	    }
	
	    data.keyMapValid = true;
	  }
	};
	
	/**
	 * Changes to the first child of the current node.
	 */
	var enterNode = function enterNode() {
	  currentParent = currentNode;
	  currentNode = null;
	};
	
	/**
	 * Changes to the next sibling of the current node.
	 */
	var nextNode = function nextNode() {
	  if (currentNode) {
	    currentNode = currentNode.nextSibling;
	  } else {
	    currentNode = currentParent.firstChild;
	  }
	};
	
	/**
	 * Changes to the parent of the current node, removing any unvisited children.
	 */
	var exitNode = function exitNode() {
	  clearUnvisitedDOM();
	
	  currentNode = currentParent;
	  currentParent = currentParent.parentNode;
	};
	
	/**
	 * Makes sure that the current node is an Element with a matching tagName and
	 * key.
	 *
	 * @param {string} tag The element's tag.
	 * @param {?string=} key The key used to identify this element. This can be an
	 *     empty string, but performance may be better if a unique value is used
	 *     when iterating over an array of items.
	 * @param {?Array<*>=} statics An array of attribute name/value pairs of the
	 *     static attributes for the Element. These will only be set once when the
	 *     Element is created.
	 * @return {!Element} The corresponding Element.
	 */
	var coreElementOpen = function coreElementOpen(tag, key, statics) {
	  nextNode();
	  alignWithDOM(tag, key, statics);
	  enterNode();
	  return (/** @type {!Element} */currentParent
	  );
	};
	
	/**
	 * Closes the currently open Element, removing any unvisited children if
	 * necessary.
	 *
	 * @return {!Element} The corresponding Element.
	 */
	var coreElementClose = function coreElementClose() {
	  if (false) {}
	
	  exitNode();
	  return (/** @type {!Element} */currentNode
	  );
	};
	
	/**
	 * Makes sure the current node is a Text node and creates a Text node if it is
	 * not.
	 *
	 * @return {!Text} The corresponding Text Node.
	 */
	var coreText = function coreText() {
	  nextNode();
	  alignWithDOM('#text', null, null);
	  return (/** @type {!Text} */currentNode
	  );
	};
	
	/**
	 * Gets the current Element being patched.
	 * @return {!Element}
	 */
	var currentElement = function currentElement() {
	  if (false) {}
	  return (/** @type {!Element} */currentParent
	  );
	};
	
	/**
	 * Skips the children in a subtree, allowing an Element to be closed without
	 * clearing out the children.
	 */
	var skip = function skip() {
	  if (false) {}
	  currentNode = currentParent.lastChild;
	};
	
	/**
	 * The offset in the virtual element declaration where the attributes are
	 * specified.
	 * @const
	 */
	var ATTRIBUTES_OFFSET = 3;
	
	/**
	 * Builds an array of arguments for use with elementOpenStart, attr and
	 * elementOpenEnd.
	 * @const {Array<*>}
	 */
	var argsBuilder = [];
	
	/**
	 * @param {string} tag The element's tag.
	 * @param {?string=} key The key used to identify this element. This can be an
	 *     empty string, but performance may be better if a unique value is used
	 *     when iterating over an array of items.
	 * @param {?Array<*>=} statics An array of attribute name/value pairs of the
	 *     static attributes for the Element. These will only be set once when the
	 *     Element is created.
	 * @param {...*} const_args Attribute name/value pairs of the dynamic attributes
	 *     for the Element.
	 * @return {!Element} The corresponding Element.
	 */
	var elementOpen = function elementOpen(tag, key, statics, const_args) {
	  if (false) {}
	
	  var node = coreElementOpen(tag, key, statics);
	  var data = getData(node);
	
	  /*
	   * Checks to see if one or more attributes have changed for a given Element.
	   * When no attributes have changed, this is much faster than checking each
	   * individual argument. When attributes have changed, the overhead of this is
	   * minimal.
	   */
	  var attrsArr = data.attrsArr;
	  var newAttrs = data.newAttrs;
	  var attrsChanged = false;
	  var i = ATTRIBUTES_OFFSET;
	  var j = 0;
	
	  for (; i < arguments.length; i += 1, j += 1) {
	    if (attrsArr[j] !== arguments[i]) {
	      attrsChanged = true;
	      break;
	    }
	  }
	
	  for (; i < arguments.length; i += 1, j += 1) {
	    attrsArr[j] = arguments[i];
	  }
	
	  if (j < attrsArr.length) {
	    attrsChanged = true;
	    attrsArr.length = j;
	  }
	
	  /*
	   * Actually perform the attribute update.
	   */
	  if (attrsChanged) {
	    for (i = ATTRIBUTES_OFFSET; i < arguments.length; i += 2) {
	      newAttrs[arguments[i]] = arguments[i + 1];
	    }
	
	    for (var _attr in newAttrs) {
	      updateAttribute(node, _attr, newAttrs[_attr]);
	      newAttrs[_attr] = undefined;
	    }
	  }
	
	  return node;
	};
	
	/**
	 * Declares a virtual Element at the current location in the document. This
	 * corresponds to an opening tag and a elementClose tag is required. This is
	 * like elementOpen, but the attributes are defined using the attr function
	 * rather than being passed as arguments. Must be folllowed by 0 or more calls
	 * to attr, then a call to elementOpenEnd.
	 * @param {string} tag The element's tag.
	 * @param {?string=} key The key used to identify this element. This can be an
	 *     empty string, but performance may be better if a unique value is used
	 *     when iterating over an array of items.
	 * @param {?Array<*>=} statics An array of attribute name/value pairs of the
	 *     static attributes for the Element. These will only be set once when the
	 *     Element is created.
	 */
	var elementOpenStart = function elementOpenStart(tag, key, statics) {
	  if (false) {}
	
	  argsBuilder[0] = tag;
	  argsBuilder[1] = key;
	  argsBuilder[2] = statics;
	};
	
	/***
	 * Defines a virtual attribute at this point of the DOM. This is only valid
	 * when called between elementOpenStart and elementOpenEnd.
	 *
	 * @param {string} name
	 * @param {*} value
	 */
	var attr = function attr(name, value) {
	  if (false) {}
	
	  argsBuilder.push(name, value);
	};
	
	/**
	 * Closes an open tag started with elementOpenStart.
	 * @return {!Element} The corresponding Element.
	 */
	var elementOpenEnd = function elementOpenEnd() {
	  if (false) {}
	
	  var node = elementOpen.apply(null, argsBuilder);
	  argsBuilder.length = 0;
	  return node;
	};
	
	/**
	 * Closes an open virtual Element.
	 *
	 * @param {string} tag The element's tag.
	 * @return {!Element} The corresponding Element.
	 */
	var elementClose = function elementClose(tag) {
	  if (false) {}
	
	  var node = coreElementClose();
	
	  if (false) {}
	
	  return node;
	};
	
	/**
	 * Declares a virtual Element at the current location in the document that has
	 * no children.
	 * @param {string} tag The element's tag.
	 * @param {?string=} key The key used to identify this element. This can be an
	 *     empty string, but performance may be better if a unique value is used
	 *     when iterating over an array of items.
	 * @param {?Array<*>=} statics An array of attribute name/value pairs of the
	 *     static attributes for the Element. These will only be set once when the
	 *     Element is created.
	 * @param {...*} const_args Attribute name/value pairs of the dynamic attributes
	 *     for the Element.
	 * @return {!Element} The corresponding Element.
	 */
	var elementVoid = function elementVoid(tag, key, statics, const_args) {
	  elementOpen.apply(null, arguments);
	  return elementClose(tag);
	};
	
	/**
	 * Declares a virtual Element at the current location in the document that is a
	 * placeholder element. Children of this Element can be manually managed and
	 * will not be cleared by the library.
	 *
	 * A key must be specified to make sure that this node is correctly preserved
	 * across all conditionals.
	 *
	 * @param {string} tag The element's tag.
	 * @param {string} key The key used to identify this element.
	 * @param {?Array<*>=} statics An array of attribute name/value pairs of the
	 *     static attributes for the Element. These will only be set once when the
	 *     Element is created.
	 * @param {...*} const_args Attribute name/value pairs of the dynamic attributes
	 *     for the Element.
	 * @return {!Element} The corresponding Element.
	 */
	var elementPlaceholder = function elementPlaceholder(tag, key, statics, const_args) {
	  if (false) {}
	
	  elementOpen.apply(null, arguments);
	  skip();
	  return elementClose(tag);
	};
	
	/**
	 * Declares a virtual Text at this point in the document.
	 *
	 * @param {string|number|boolean} value The value of the Text.
	 * @param {...(function((string|number|boolean)):string)} const_args
	 *     Functions to format the value which are called only when the value has
	 *     changed.
	 * @return {!Text} The corresponding text node.
	 */
	var text = function text(value, const_args) {
	  if (false) {}
	
	  var node = coreText();
	  var data = getData(node);
	
	  if (data.text !== value) {
	    data.text = /** @type {string} */value;
	
	    var formatted = value;
	    for (var i = 1; i < arguments.length; i += 1) {
	      /*
	       * Call the formatter function directly to prevent leaking arguments.
	       * https://github.com/google/incremental-dom/pull/204#issuecomment-178223574
	       */
	      var fn = arguments[i];
	      formatted = fn(formatted);
	    }
	
	    node.data = formatted;
	  }
	
	  return node;
	};
	
	exports.patch = patchInner;
	exports.patchInner = patchInner;
	exports.patchOuter = patchOuter;
	exports.currentElement = currentElement;
	exports.skip = skip;
	exports.elementVoid = elementVoid;
	exports.elementOpenStart = elementOpenStart;
	exports.elementOpenEnd = elementOpenEnd;
	exports.elementOpen = elementOpen;
	exports.elementClose = elementClose;
	exports.elementPlaceholder = elementPlaceholder;
	exports.text = text;
	exports.attr = attr;
	exports.symbols = symbols;
	exports.attributes = attributes;
	exports.applyAttr = applyAttr;
	exports.applyProp = applyProp;
	exports.notifications = notifications;
	
	//# sourceMappingURL=incremental-dom-cjs.js.map

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var div = document.createElement('div');
	var customElementsV0 = exports.customElementsV0 = !!document.registerElement;
	var customElementsV1 = exports.customElementsV1 = !!window.customElements;
	var shadowDomV0 = exports.shadowDomV0 = !!div.createShadowRoot;
	var shadowDomV1 = exports.shadowDomV1 = !!div.attachShadow;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _symbols = __webpack_require__(4);
	
	var symbols = _interopRequireWildcard(_symbols);
	
	var _data = __webpack_require__(9);
	
	var _data2 = _interopRequireDefault(_data);
	
	var _getOwnPropertyDescriptors = __webpack_require__(10);
	
	var _getOwnPropertyDescriptors2 = _interopRequireDefault(_getOwnPropertyDescriptors);
	
	var _support = __webpack_require__(7);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Component = function (_HTMLElement) {
	  _inherits(Component, _HTMLElement);
	
	  function Component() {
	    _classCallCheck(this, Component);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Component).call(this));
	
	    _this.createdCallback();
	    return _this;
	  }
	
	  _createClass(Component, [{
	    key: 'connectedCallback',
	    value: function connectedCallback() {
	      var cb = this.constructor.attached;
	      cb && cb(this);
	    }
	  }, {
	    key: 'disconnectedCallback',
	    value: function disconnectedCallback() {
	      var cb = this.constructor.detached;
	      cb && cb(this);
	    }
	  }, {
	    key: 'attributeChangedCallback',
	    value: function attributeChangedCallback(name, oldValue, newValue) {
	      var _constructor = this.constructor;
	      var attributeChanged = _constructor.attributeChanged;
	      var observedAttributes = _constructor.observedAttributes;
	
	      var propertyName = (0, _data2.default)(this, 'attributeLinks')[name];
	
	      // In V0 we have to ensure the attribute is being observed.
	      if (_support.customElementsV0 && observedAttributes.indexOf(name) === -1) {
	        return;
	      }
	
	      if (propertyName) {
	        var propData = (0, _data2.default)(this, 'api/property/' + propertyName);
	
	        // This ensures a property set doesn't cause the attribute changed
	        // handler to run again once we set this flag. This only ever has a
	        // chance to run when you set an attribute, it then sets a property and
	        // then that causes the attribute to be set again.
	        if (propData.syncingAttribute) {
	          propData.syncingAttribute = false;
	          return;
	        }
	
	        // Sync up the property.
	        var propOpts = this.constructor.props[propertyName];
	        propData.settingAttribute = true;
	        this[propertyName] = newValue !== null && propOpts.deserialize ? propOpts.deserialize(newValue) : newValue;
	      }
	
	      if (attributeChanged) {
	        attributeChanged(this, { name: name, newValue: newValue, oldValue: oldValue });
	      }
	    }
	  }, {
	    key: 'createdCallback',
	    value: function createdCallback() {
	      var _this2 = this;
	
	      var elemData = (0, _data2.default)(this);
	      var readyCallbacks = elemData.readyCallbacks;
	      var Ctor = this.constructor;
	      var definedAttribute = Ctor.definedAttribute;
	      var events = Ctor.events;
	      var created = Ctor.created;
	      var observedAttributes = Ctor.observedAttributes;
	      var props = Ctor.props;
	      var ready = Ctor.ready;
	      var renderedAttribute = Ctor.renderedAttribute;
	
	      var renderer = Ctor[symbols.renderer];
	
	      // TODO: This prevents an element from being initialised multiple times. For
	      // some reason this is happening in the event tests. It's possibly creating
	      // elements in a way that the causes the custom element v1 polyfill to call
	      // the constructor twice.
	      if (this[symbols.created]) return;
	      this[symbols.created] = true;
	
	      if (props) {
	        Ctor[symbols.props](this);
	      }
	
	      if (events) {
	        Ctor[symbols.events](this);
	      }
	
	      if (created) {
	        created(this);
	      }
	
	      if (renderer && !this.hasAttribute(renderedAttribute)) {
	        renderer(this);
	      }
	
	      if (ready) {
	        ready(this);
	      }
	
	      if (!this.hasAttribute(definedAttribute)) {
	        this.setAttribute(definedAttribute, '');
	      }
	
	      if (readyCallbacks) {
	        readyCallbacks.forEach(function (cb) {
	          return cb(_this2);
	        });
	        delete elemData.readyCallbacks;
	      }
	
	      // In v0 we must ensure the attributeChangedCallback is called for attrs
	      // that aren't linked to props so that the callback behaves the same no
	      // matter if v0 or v1 is being used.
	      if (_support.customElementsV0) {
	        observedAttributes.forEach(function (name) {
	          var propertyName = (0, _data2.default)(_this2, 'attributeLinks')[name];
	          if (!propertyName) {
	            _this2.attributeChangedCallback(name, null, _this2.getAttribute(name));
	          }
	        });
	      }
	    }
	  }, {
	    key: 'attachedCallback',
	    value: function attachedCallback() {
	      this.connectedCallback();
	    }
	  }, {
	    key: 'detachedCallback',
	    value: function detachedCallback() {
	      this.disconnectedCallback();
	    }
	  }], [{
	    key: 'extend',
	    value: function extend() {
	      var definition = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	      var Base = arguments.length <= 1 || arguments[1] === undefined ? this : arguments[1];
	
	      // Create class for the user.
	
	      var Ctor = function (_Base) {
	        _inherits(Ctor, _Base);
	
	        function Ctor() {
	          _classCallCheck(this, Ctor);
	
	          return _possibleConstructorReturn(this, Object.getPrototypeOf(Ctor).apply(this, arguments));
	        }
	
	        return Ctor;
	      }(Base);
	
	      // For inheriting from the object literal.
	
	
	      var opts = (0, _getOwnPropertyDescriptors2.default)(definition);
	      var prot = (0, _getOwnPropertyDescriptors2.default)(definition.prototype);
	
	      // Prototype is non configurable (but is writable) s
	      delete opts.prototype;
	
	      // Pass on static and instance members from the definition.
	      Object.defineProperties(Ctor, opts);
	      Object.defineProperties(Ctor.prototype, prot);
	
	      return Ctor;
	    }
	  }, {
	    key: 'definedAttribute',
	    get: function get() {
	      return 'defined';
	    }
	  }, {
	    key: 'events',
	    get: function get() {
	      return {};
	    }
	  }, {
	    key: 'observedAttributes',
	    get: function get() {
	      return [];
	    }
	  }, {
	    key: 'props',
	    get: function get() {
	      return {};
	    }
	  }, {
	    key: 'renderedAttribute',
	    get: function get() {
	      return 'rendered';
	    }
	  }]);
	
	  return Component;
	}(HTMLElement);
	
	exports.default = Component;

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (element) {
	  var namespace = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
	
	  var data = element.__SKATE_DATA || (element.__SKATE_DATA = {});
	  return namespace && (data[namespace] || (data[namespace] = {})) || data;
	};

/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (obj) {
	  return Object.getOwnPropertyNames(obj || {}).reduce(function (prev, curr) {
	    prev[curr] = Object.getOwnPropertyDescriptor(obj, curr);
	    return prev;
	  }, {});
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	exports.default = function (name, Ctor) {
	  Ctor = createConstructor(name, Ctor);
	  formatLinkedAttributes(Ctor);
	
	  Ctor[symbols.events] = (0, _events2.default)(Ctor);
	  Ctor[symbols.props] = createInitProps(Ctor);
	  Ctor[symbols.renderer] = (0, _render2.default)(Ctor);
	
	  if (_support.customElementsV0) {
	    return document.registerElement(name, Ctor);
	  } else if (_support.customElementsV1) {
	    window.customElements.define(name, Ctor, { extends: Ctor.extends });
	    return Ctor;
	  } else {
	    throw new Error('Skate requires native custom element support or a polyfill.');
	  }
	};
	
	var _symbols = __webpack_require__(4);
	
	var symbols = _interopRequireWildcard(_symbols);
	
	var _support = __webpack_require__(7);
	
	var _component = __webpack_require__(8);
	
	var _component2 = _interopRequireDefault(_component);
	
	var _events = __webpack_require__(12);
	
	var _events2 = _interopRequireDefault(_events);
	
	var _render = __webpack_require__(14);
	
	var _render2 = _interopRequireDefault(_render);
	
	var _dashCase = __webpack_require__(15);
	
	var _dashCase2 = _interopRequireDefault(_dashCase);
	
	var _propsInit = __webpack_require__(16);
	
	var _propsInit2 = _interopRequireDefault(_propsInit);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	// Ensures that definitions passed as part of the constructor are functions
	// that return property definitions used on the element.
	function ensurePropertyFunctions(Ctor) {
	  var props = Ctor.props;
	  var names = Object.keys(props || {});
	  return names.reduce(function (descriptors, descriptorName) {
	    descriptors[descriptorName] = props[descriptorName];
	    if (typeof descriptors[descriptorName] !== 'function') {
	      descriptors[descriptorName] = (0, _propsInit2.default)(descriptors[descriptorName]);
	    }
	    return descriptors;
	  }, {});
	}
	
	// Ensures the property definitions are transformed to objects that can be used
	// to create properties on the element.
	function ensurePropertyDefinitions(Ctor) {
	  var props = ensurePropertyFunctions(Ctor);
	  return Object.keys(props).reduce(function (descriptors, descriptorName) {
	    descriptors[descriptorName] = props[descriptorName](descriptorName);
	    return descriptors;
	  }, {});
	}
	
	// Makes a function / constructor for the custom element that automates the
	// boilerplate of ensuring the parent constructor is called first and ensures
	// that the element is returned at the end.
	function createConstructor(name, Ctor) {
	  if ((typeof Ctor === 'undefined' ? 'undefined' : _typeof(Ctor)) === 'object') {
	    Ctor = _component2.default.extend(Ctor);
	  }
	
	  // Internal data.
	  Ctor[symbols.name] = name;
	
	  return Ctor;
	}
	
	// Ensures linked properties that have linked attributes are pre-formatted to
	// the attribute name in which they are linked.
	function formatLinkedAttributes(Ctor) {
	  var observedAttributes = Ctor.observedAttributes;
	  var props = Ctor.props;
	
	
	  if (!props) {
	    return;
	  }
	
	  Object.keys(props).forEach(function (name) {
	    var prop = props[name];
	    var attr = prop.attribute;
	    if (attr) {
	      // Ensure the property is updated.
	      var linkedAttr = prop.attribute = attr === true ? (0, _dashCase2.default)(name) : attr;
	
	      // Automatically observe the attribute since they're linked from the
	      // attributeChangedCallback.
	      if (observedAttributes.indexOf(linkedAttr) === -1) {
	        observedAttributes.push(linkedAttr);
	      }
	    }
	  });
	
	  // Merge observed attributes.
	  Object.defineProperty(Ctor, 'observedAttributes', {
	    get: function get() {
	      return observedAttributes;
	    }
	  });
	}
	
	function createInitProps(Ctor) {
	  var props = ensurePropertyDefinitions(Ctor);
	
	  return function (elem) {
	    if (!props) {
	      return;
	    }
	
	    Object.keys(props).forEach(function (name) {
	      var prop = props[name];
	      prop.created(elem);
	
	      // https://bugs.webkit.org/show_bug.cgi?id=49739
	      //
	      // When Webkit fixes that bug so that native property accessors can be
	      // retrieved, we can move defining the property to the prototype and away
	      // from having to do if for every instance as all other browsers support
	      // this.
	      Object.defineProperty(elem, name, prop);
	    });
	  };
	}

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = events;
	
	var _matchesSelector = __webpack_require__(13);
	
	var _matchesSelector2 = _interopRequireDefault(_matchesSelector);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function readonly(obj, prop, val) {
	  Object.defineProperty(obj, prop, {
	    configurable: true,
	    get: function get() {
	      return val;
	    }
	  });
	}
	
	function parseEvent(e) {
	  var indexOfSpace = e.indexOf(' ');
	  var hasSpace = indexOfSpace > 0;
	  var name = hasSpace ? e.substring(0, indexOfSpace) : e;
	  var selector = hasSpace ? e.substring(indexOfSpace + 1) : '';
	  return {
	    name: name,
	    selector: selector
	  };
	}
	
	function makeDelegateHandler(elem, handler, parsed) {
	  return function (e) {
	    var current = e.path ? e.path[0] : e.target;
	    var selector = parsed.selector;
	    while (current && current !== elem.parentNode) {
	      if ((0, _matchesSelector2.default)(current, selector)) {
	        readonly(e, 'currentTarget', current);
	        readonly(e, 'delegateTarget', elem);
	        return handler(elem, e);
	      }
	      current = current.parentNode;
	    }
	  };
	}
	
	function makeNormalHandler(elem, handler) {
	  return function (e) {
	    readonly(e, 'delegateTarget', elem);
	    handler(elem, e);
	  };
	}
	
	function bindEvent(elem, event, handler) {
	  var parsed = parseEvent(event);
	  var name = parsed.name;
	  var selector = parsed.selector;
	
	  var capture = selector && (name === 'blur' || name === 'focus');
	  handler = selector ? makeDelegateHandler(elem, handler, parsed) : makeNormalHandler(elem, handler);
	  elem.addEventListener(name, handler, capture);
	}
	
	function events(opts) {
	  var events = opts.events || {};
	  return function (elem) {
	    for (var name in events) {
	      bindEvent(elem, name, events[name]);
	    }
	  };
	}

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (element, selector) {
	  if (hasNativeMatchesSelectorDetattachedBug) {
	    var clone = element.cloneNode();
	    document.createElement('div').appendChild(clone);
	    return nativeMatchesSelector.call(clone, selector);
	  }
	  return nativeMatchesSelector.call(element, selector);
	};
	
	var elProto = window.HTMLElement.prototype;
	var nativeMatchesSelector = elProto.matches || elProto.msMatchesSelector || elProto.webkitMatchesSelector || elProto.mozMatchesSelector || elProto.oMatchesSelector;
	
	// Only IE9 has this msMatchesSelector bug, but best to detect it.
	var hasNativeMatchesSelectorDetattachedBug = !nativeMatchesSelector.call(document.createElement('div'), 'div');

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (Ctor) {
	  var render = Ctor.render;
	
	
	  return function (elem) {
	    if (!render) {
	      return;
	    }
	
	    if (!elem[_symbols.shadowRoot]) {
	      var sr = void 0;
	
	      if (_support.shadowDomV1) {
	        sr = elem.attachShadow({ mode: 'open' });
	      } else if (_support.shadowDomV0) {
	        sr = elem.createShadowRoot();
	      } else {
	        sr = elem;
	      }
	
	      elem[_symbols.shadowRoot] = sr;
	    }
	
	    (0, _incrementalDom.patchInner)(elem[_symbols.shadowRoot], render, elem);
	  };
	};
	
	var _incrementalDom = __webpack_require__(6);
	
	var _symbols = __webpack_require__(4);
	
	var _support = __webpack_require__(7);

/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (str) {
	  return str.split(/([A-Z])/).reduce(function (one, two, idx) {
	    var dash = !one || idx % 2 === 0 ? '' : '-';
	    return '' + one + dash + two.toLowerCase();
	  });
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (opts) {
	  opts = opts || {};
	
	  if (typeof opts === 'function') {
	    opts = { coerce: opts };
	  }
	
	  return function (name) {
	    return createNativePropertyDefinition(name, (0, _assign2.default)({
	      default: null,
	      deserialize: function deserialize(value) {
	        return value;
	      },
	      serialize: function serialize(value) {
	        return value;
	      }
	    }, opts));
	  };
	};
	
	var _symbols = __webpack_require__(4);
	
	var symbols = _interopRequireWildcard(_symbols);
	
	var _assign = __webpack_require__(2);
	
	var _assign2 = _interopRequireDefault(_assign);
	
	var _data = __webpack_require__(9);
	
	var _data2 = _interopRequireDefault(_data);
	
	var _debounce = __webpack_require__(17);
	
	var _debounce2 = _interopRequireDefault(_debounce);
	
	var _emit = __webpack_require__(18);
	
	var _emit2 = _interopRequireDefault(_emit);
	
	var _empty = __webpack_require__(3);
	
	var _empty2 = _interopRequireDefault(_empty);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function getDefaultValue(elem, name, opts) {
	  return typeof opts.default === 'function' ? opts.default(elem, { name: name }) : opts.default;
	}
	
	function getInitialValue(elem, name, opts) {
	  return typeof opts.initial === 'function' ? opts.initial(elem, { name: name }) : opts.initial;
	}
	
	function createNativePropertyDefinition(name, opts) {
	  var prop = {
	    configurable: true,
	    enumerable: true
	  };
	
	  prop.created = function (elem) {
	    var propData = (0, _data2.default)(elem, 'api/property/' + name);
	    var attributeName = opts.attribute;
	    var initialValue = elem[name];
	    var shouldSyncAttribute = false;
	
	    // Store property to attribute link information.
	    (0, _data2.default)(elem, 'attributeLinks')[attributeName] = name;
	    (0, _data2.default)(elem, 'propertyLinks')[name] = attributeName;
	
	    // Set up initial value if it wasn't specified.
	    if ((0, _empty2.default)(initialValue)) {
	      if (attributeName && elem.hasAttribute(attributeName)) {
	        initialValue = opts.deserialize(elem.getAttribute(attributeName));
	      } else if ('initial' in opts) {
	        initialValue = getInitialValue(elem, name, opts);
	        shouldSyncAttribute = true;
	      } else if ('default' in opts) {
	        initialValue = getDefaultValue(elem, name, opts);
	      }
	    }
	
	    if (shouldSyncAttribute) {
	      prop.set.call(elem, initialValue);
	    } else {
	      propData.internalValue = opts.coerce ? opts.coerce(initialValue) : initialValue;
	    }
	  };
	
	  prop.get = function () {
	    var propData = (0, _data2.default)(this, 'api/property/' + name);
	    var internalValue = propData.internalValue;
	
	    if (typeof opts.get === 'function') {
	      return opts.get(this, { name: name, internalValue: internalValue });
	    }
	    return internalValue;
	  };
	
	  prop.render = function () {
	    var shouldUpdate = opts.render;
	    if (typeof shouldUpdate === 'undefined') {
	      return function (elem, data) {
	        return data.newValue !== data.oldValue;
	      };
	    }
	    if (typeof shouldUpdate === 'function') {
	      return shouldUpdate;
	    }
	    return function () {
	      return !!shouldUpdate;
	    };
	  }();
	
	  prop.set = function (newValue) {
	    var propData = (0, _data2.default)(this, 'api/property/' + name);
	    var oldValue = propData.oldValue;
	
	    var shouldRemoveAttribute = false;
	
	    if ((0, _empty2.default)(oldValue)) {
	      oldValue = null;
	    }
	
	    if ((0, _empty2.default)(newValue)) {
	      newValue = getDefaultValue(this, name, opts);
	      shouldRemoveAttribute = true;
	    }
	
	    if (typeof opts.coerce === 'function') {
	      newValue = opts.coerce(newValue);
	    }
	
	    var propertyHasChanged = newValue !== oldValue;
	    if (propertyHasChanged && opts.event) {
	      var canceled = !(0, _emit2.default)(this, String(opts.event), {
	        bubbles: false,
	        detail: { name: name, oldValue: oldValue, newValue: newValue }
	      });
	
	      if (canceled) {
	        return;
	      }
	    }
	
	    propData.internalValue = newValue;
	
	    var changeData = { name: name, newValue: newValue, oldValue: oldValue };
	
	    if (typeof opts.set === 'function') {
	      opts.set(this, changeData);
	    }
	
	    // Re-render on property updates if the should-update check passes.
	    if (prop.render(this, changeData)) {
	      var deb = this[symbols.rendererDebounced] || (this[symbols.rendererDebounced] = (0, _debounce2.default)(this.constructor[symbols.renderer]));
	      deb(this);
	    }
	
	    propData.oldValue = newValue;
	
	    // Link up the attribute.
	    var attributeName = (0, _data2.default)(this, 'propertyLinks')[name];
	    if (attributeName && !propData.settingAttribute) {
	      var serializedValue = opts.serialize(newValue);
	      propData.syncingAttribute = true;
	      if (shouldRemoveAttribute || (0, _empty2.default)(serializedValue)) {
	        this.removeAttribute(attributeName);
	      } else {
	        this.setAttribute(attributeName, serializedValue);
	      }
	    }
	
	    // Allow the attribute to be linked again.
	    propData.settingAttribute = false;
	  };
	
	  return prop;
	}

/***/ },
/* 17 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (fn) {
	  var called = false;
	
	  return function () {
	    var _this = this;
	
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    if (!called) {
	      called = true;
	      raf(function () {
	        called = false;
	        fn.apply(_this, args);
	      });
	    }
	  };
	};
	
	var raf = window.requestAnimationFrame || setTimeout;

/***/ },
/* 18 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (elem, name) {
	  var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	
	  /* jshint expr: true */
	  opts.bubbles === undefined && (opts.bubbles = true);
	  opts.cancelable === undefined && (opts.cancelable = true);
	  return elem.disabled ? true : elem.dispatchEvent(createCustomEvent(name, opts));
	};
	
	var CustomEvent = function (CustomEvent) {
	  if (CustomEvent) {
	    try {
	      new CustomEvent();
	    } catch (e) {
	      return undefined;
	    }
	  }
	  return CustomEvent;
	}(window.CustomEvent);
	
	function createCustomEvent(name) {
	  var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	  if (CustomEvent) {
	    return new CustomEvent(name, opts);
	  }
	  var e = document.createEvent('CustomEvent');
	  e.initCustomEvent(name, opts.bubbles, opts.cancelable, opts.detail);
	  return e;
	}

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (elem, target) {
	  return function (e) {
	    var value = getValue(e.target);
	    var localTarget = target || e.target.name || 'value';
	
	    if (localTarget.indexOf('.') > -1) {
	      var parts = localTarget.split('.');
	      var firstPart = parts[0];
	      var propName = parts.pop();
	      var obj = parts.reduce(function (prev, curr) {
	        return prev && prev[curr];
	      }, elem);
	
	      obj[propName || e.target.name] = value;
	      (0, _state4.default)(elem, _defineProperty({}, firstPart, elem[firstPart]));
	    } else {
	      (0, _state4.default)(elem, _defineProperty({}, localTarget, value));
	    }
	  };
	};
	
	var _state3 = __webpack_require__(20);
	
	var _state4 = _interopRequireDefault(_state3);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	function getValue(elem) {
	  var type = elem.type;
	  if (type === 'checkbox' || type === 'radio') {
	    return elem.checked ? elem.value || true : false;
	  }
	  return elem.value;
	}

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (elem, newState) {
	  return typeof newState === 'undefined' ? get(elem) : set(elem, newState);
	};
	
	var _symbols = __webpack_require__(4);
	
	var _assign = __webpack_require__(2);
	
	var _assign2 = _interopRequireDefault(_assign);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function get(elem) {
	  var props = elem.constructor.props;
	  var state = {};
	  for (var key in props) {
	    var val = elem[key];
	    if (typeof val !== 'undefined') {
	      state[key] = val;
	    }
	  }
	  return state;
	}
	
	function set(elem, newState) {
	  (0, _assign2.default)(elem, newState);
	  if (elem.constructor.render) {
	    elem.constructor[_symbols.renderer](elem);
	  }
	}

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (elem, done) {
	  var info = (0, _data2.default)(elem);
	  if (elem.hasAttribute(elem.constructor.definedAttribute)) {
	    done(elem);
	  } else if (info.readyCallbacks) {
	    info.readyCallbacks.push(done);
	  } else {
	    info.readyCallbacks = [done];
	  }
	};
	
	var _data = __webpack_require__(9);
	
	var _data2 = _interopRequireDefault(_data);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }
/******/ ])
});
;
//# sourceMappingURL=skate-1.0.0-beta.7.js.map
