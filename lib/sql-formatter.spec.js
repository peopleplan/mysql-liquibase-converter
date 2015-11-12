'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _sqlFormatter = require('./sql-formatter');

var _sqlFormatter2 = _interopRequireDefault(_sqlFormatter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.should();

describe('Basic SQL Formatter', function () {
    var formatter = undefined;

    beforeEach(function () {
        formatter = new _sqlFormatter2.default();
    });

    describe('create table', function () {
        it('should format create table statement', function () {
            var match = 'create table if not exists `my_table` ();';
            var result = formatter.format({ match: match });

            result.should.equal('--liquibase formatted sql\n\n--changeset converter:baseline dbms:mysql\n' + match + '\n');
        });
    });

    describe('insert into', function () {
        it('should format insert into statement', function () {
            var match = 'INSERT INTO `my_table` (`key`, `value`) VALUES (\'my_key\', 1);';
            var result = formatter.format({ match: match });

            result.should.equal('--liquibase formatted sql\n\n--changeset converter:baseline dbms:mysql\n' + match + '\n');
        });
    });
});