'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Reader = (function () {
    function Reader() {
        _classCallCheck(this, Reader);
    }

    _createClass(Reader, [{
        key: 'parse',
        value: function parse(input) {
            var matches = [];
            Reader.expressions.forEach(function (exp) {
                var startMatch;

                exp.pattern[0].lastIndex = 0;
                exp.pattern[1].lastIndex = 0;

                while (startMatch = exp.pattern[0].exec(input)) {
                    var startIndex = startMatch.index;
                    var endIndex = input.length;
                    var endMatch = exp.pattern[1].exec(input.substring(startIndex + startMatch[0].length));

                    if (endMatch) {
                        endIndex = startIndex + startMatch[0].length + endMatch.index + endMatch[0].length;
                    }

                    matches.push({
                        type: exp.type,
                        index: startIndex,
                        match: input.substring(startIndex, endIndex),
                        name: startMatch[exp.nameIndex]
                    });
                }
            });

            return matches;
        }
    }]);

    return Reader;
})();

Reader.expressions = [{ type: 'table', pattern: [/\bcreate\s+table\s+(if\s+not\s+exists\s+)?`?([^\s`]+)`?/gi, /;(?=[ \t]*$)/mi], nameIndex: 2 }, { type: 'insert', pattern: [/\binsert\s+into\s*`?([^\s`]+)`?/gi, /;(?=[ \t]*$)/mi], nameIndex: 1 }];
exports.default = Reader;