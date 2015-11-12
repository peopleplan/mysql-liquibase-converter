'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _reader = require('./reader');

var _reader2 = _interopRequireDefault(_reader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.should();

describe('Reader', function () {
    var reader = undefined;

    beforeEach(function () {
        reader = new _reader2.default();
    });

    describe('create table', function () {
        it('should read single line create table statement', function () {
            var result = reader.parse('create table if not exists `my_table` ();');

            result.length.should.equal(1);
            result[0].type.should.equal('table');
            result[0].name.should.equal('my_table');
            result[0].match.should.equal('create table if not exists `my_table` ();');
        });

        it('should read single line create table statement without exists', function () {
            var result = reader.parse('create table `my_table` ();');

            result.length.should.equal(1);
            result[0].type.should.equal('table');
            result[0].name.should.equal('my_table');
            result[0].match.should.equal('create table `my_table` ();');
        });

        it('should read create table statement without back ticks', function () {
            var result = reader.parse('create table if not exists my_table ();');

            result.length.should.equal(1);
            result[0].type.should.equal('table');
            result[0].name.should.equal('my_table');
            result[0].match.should.equal('create table if not exists my_table ();');
        });

        it('should read multi line create table statement', function () {
            var result = reader.parse('create table if not exists `my_table` (\n);');

            result.length.should.equal(1);
            result[0].type.should.equal('table');
            result[0].name.should.equal('my_table');
            result[0].match.should.equal('create table if not exists `my_table` (\n);');
        });

        it('should read multi line create table statement with trailing whitespace', function () {
            var result = reader.parse('create table if not exists `my_table` (\n);  \n');

            result.length.should.equal(1);
            result[0].type.should.equal('table');
            result[0].name.should.equal('my_table');
            result[0].match.should.equal('create table if not exists `my_table` (\n);');
        });

        it('should read multiple create table statements', function () {
            var result = reader.parse('create table if not exists `table1` ();\n\ncreate table if not exists `table2` ();');

            result.length.should.equal(2);

            result[0].type.should.equal('table');
            result[0].name.should.equal('table1');
            result[0].match.should.equal('create table if not exists `table1` ();');

            result[1].type.should.equal('table');
            result[1].name.should.equal('table2');
            result[1].match.should.equal('create table if not exists `table2` ();');
        });
    });

    describe('insert into table', function () {
        it('should read single line insert statement', function () {
            var result = reader.parse('INSERT INTO `my_table` (`key`, `value`) VALUES (\'my_key\', 1);');

            result.length.should.equal(1);
            result[0].type.should.equal('insert');
            result[0].name.should.equal('my_table');
        });

        it('should read multi line insert statement with multiple rows', function () {
            var result = reader.parse('INSERT INTO `my_table` (`key`, `value`) VALUES\n(\'my_key\', 1),\n;(\'my_key_2\', 2)');

            result.length.should.equal(1);
            result[0].type.should.equal('insert');
            result[0].name.should.equal('my_table');
        });

        it('should read single line insert statement that contains `;` as part of the values', function () {
            var result = reader.parse('INSERT INTO `my_table` (`key`, `value`) VALUES (\'my;key\', 1);');

            result.length.should.equal(1);
            result[0].type.should.equal('insert');
            result[0].name.should.equal('my_table');
            result[0].match.should.equal('INSERT INTO `my_table` (`key`, `value`) VALUES (\'my;key\', 1);');
        });

        it('should read multiple single line insert statements', function () {
            var result = reader.parse('INSERT INTO `my_table` (`key`, `value`) VALUES (\'my_key\', 1);\nINSERT INTO `my_table` (`key`, `value`) VALUES (\'my_key\', 2);');

            result.length.should.equal(2);

            result[0].type.should.equal('insert');
            result[0].name.should.equal('my_table');
            result[0].match.should.equal('INSERT INTO `my_table` (`key`, `value`) VALUES (\'my_key\', 1);');

            result[1].type.should.equal('insert');
            result[1].name.should.equal('my_table');
            result[1].match.should.equal('INSERT INTO `my_table` (`key`, `value`) VALUES (\'my_key\', 2);');
        });

        it('should read multiple single line insert statements with trailing whitespace', function () {
            var result = reader.parse('INSERT INTO `my_table` (`key`, `value`) VALUES (\'my_key\', 1);\t\n\nINSERT INTO `my_table` (`key`, `value`) VALUES (\'my_key\', 2);\t\n');

            result.length.should.equal(2);

            result[0].type.should.equal('insert');
            result[0].name.should.equal('my_table');
            result[0].match.should.equal('INSERT INTO `my_table` (`key`, `value`) VALUES (\'my_key\', 1);');

            result[1].type.should.equal('insert');
            result[1].name.should.equal('my_table');
            result[1].match.should.equal('INSERT INTO `my_table` (`key`, `value`) VALUES (\'my_key\', 2);');
        });
    });
});