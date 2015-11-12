'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

var _converter = require('./converter');

var _converter2 = _interopRequireDefault(_converter);

var _reader = require('./reader');

var _reader2 = _interopRequireDefault(_reader);

var _sqlFormatter = require('./sql-formatter');

var _sqlFormatter2 = _interopRequireDefault(_sqlFormatter);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reader = new _reader2.default();;
var formatters = new _sqlFormatter2.default();;
var converter = new _converter2.default(reader, formatters);;

formatters['table'] = new _sqlFormatter2.default();

var file = undefined;
var outputDirectory = undefined;

_commander2.default.version(_package2.default.version).arguments('<sqlFile> [output]').action(function (sqlFile, output) {
    outputDirectory = output;
    file = sqlFile;
});

_commander2.default.parse(process.argv);

outputDirectory = outputDirectory || './output';

if (!file) {
    console.error('no sqlFile provided');
    process.exit(1);
}

var contents = _fs2.default.readFileSync(file, 'utf8');
converter.createFiles(contents, outputDirectory);