'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _filendir = require('filendir');

var _filendir2 = _interopRequireDefault(_filendir);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Converter = (function () {
    function Converter(reader, formatters) {
        _classCallCheck(this, Converter);

        this.reader = reader;
        this.formatters = formatters;
    }

    _createClass(Converter, [{
        key: 'toGraph',
        value: function toGraph(input) {
            var _this = this;

            var results = this.reader.parse(input);

            return results.map(function (r) {
                return {
                    type: r.type,
                    name: r.name,
                    content: (_this.formatters[r.type] || _this.formatters).format(r)
                };
            });
        }
    }, {
        key: 'createFiles',
        value: function createFiles(input, outputLocation) {
            var _this2 = this;

            var graph = this.toGraph(input);
            var json = {
                databaseChangeLog: []
            };

            graph.forEach(function (g) {
                var relativePath = _this2.getFilePath(g.type, g.name);

                _filendir2.default.writeFileSync(_path2.default.join(outputLocation, relativePath), g.content);

                json.databaseChangeLog.push({
                    include: {
                        file: relativePath
                    }
                });
            });

            _filendir2.default.writeFileSync(_path2.default.join(outputLocation, 'changelog.json'), JSON.stringify(json, null, 2));
        }
    }, {
        key: 'getFilePath',
        value: function getFilePath(type, name) {
            var folderType = type === 'table' ? 'tables' : 'data';
            return 'migrations/baseline/' + folderType + '/' + name + '.sql';
        }
    }]);

    return Converter;
})();

exports.default = Converter;