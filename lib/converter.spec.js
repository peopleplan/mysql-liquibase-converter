'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _converter = require('./converter');

var _converter2 = _interopRequireDefault(_converter);

var _reader = require('./reader');

var _reader2 = _interopRequireDefault(_reader);

var _sqlFormatter = require('./sql-formatter');

var _sqlFormatter2 = _interopRequireDefault(_sqlFormatter);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.should();

describe('Converter', function () {
    var converter = undefined;
    var reader = undefined;
    var formatters = undefined;

    beforeEach(function () {
        formatters = new _sqlFormatter2.default();
        formatters['table'] = new _sqlFormatter2.default();

        reader = new _reader2.default();

        converter = new _converter2.default(reader, formatters);
    });

    describe('graph', function () {
        it('should convert single create table statement to object graph', function () {
            var input = 'create table if not exists `my_table` ();';
            var result = converter.toGraph(input);

            result.length.should.equal(1);
            result[0].type.should.equal('table');
            result[0].name.should.equal('my_table');
            result[0].content.should.equal('--liquibase formatted sql\n\n--changeset converter:baseline dbms:mysql\n' + input + '\n');
        });

        it('should convert single insert into statement to object graph', function () {
            var input = 'INSERT INTO `my_table` (`key`, `value`) VALUES (\'my_key\', 1);';
            var result = converter.toGraph(input);

            result.length.should.equal(1);
            result[0].type.should.equal('insert');
            result[0].name.should.equal('my_table');
            result[0].content.should.equal('--liquibase formatted sql\n\n--changeset converter:baseline dbms:mysql\n' + input + '\n');
        });

        it('should convert basic.sql file to object graph', function () {
            var input = _fs2.default.readFileSync(_path2.default.resolve(__dirname, '../testdata/basic.sql'), 'utf8');
            var result = converter.toGraph(input);

            result.length.should.equal(2);

            result[0].type.should.equal('table');
            result[0].name.should.equal('my_table');

            result[1].type.should.equal('insert');
            result[1].name.should.equal('my_table');
        });
    });

    describe('files', function () {
        it('should create files on disk based on basic.sql file', function () {
            var input = _fs2.default.readFileSync(_path2.default.resolve(__dirname, '../testdata/basic.sql'), 'utf8');
            var result = converter.createFiles(input, _path2.default.resolve(__dirname, '../testdata/temp'));

            // check that files exist and are accessible
            _fs2.default.accessSync(_path2.default.resolve(__dirname, '../testdata/temp/changelog.json'));
            _fs2.default.accessSync(_path2.default.resolve(__dirname, '../testdata/temp/migrations/baseline/tables/my_table.sql'));
            _fs2.default.accessSync(_path2.default.resolve(__dirname, '../testdata/temp/migrations/baseline/data/my_table.sql'));
        });
    });
});