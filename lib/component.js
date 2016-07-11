"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ComponentFile = function (_Object) {
  _inherits(ComponentFile, _Object);

  function ComponentFile(file, contents, parent) {
    _classCallCheck(this, ComponentFile);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ComponentFile).call(this));

    _this.file = file;
    _this.contents = contents;
    _this.parent = parent;

    // dependencies referenced with `<link rel="import">`
    // propagated during the load compiler phase
    _this.imports = [];

    // list of component modules defined with `<dom-module>`
    // propagated during the parse compiler phase
    _this.modules = [];
    return _this;
  }

  return ComponentFile;
}(Object);

module.exports = {
  File: ComponentFile
};