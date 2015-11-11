import chai from 'chai'
import Reader from './reader';

chai.should();

describe('Reader', () => {
    let reader;

    beforeEach(() => {
        reader = new Reader();
    });

    describe('create table', () => {
        it('should read single line create table statement', () => {
            let result = reader.parse('create table if not exists `my_table` ();');

            result.length.should.equal(1);
            result[0].type.should.equal('table');
            result[0].name.should.equal('my_table');
            result[0].match.should.equal('create table if not exists `my_table` ();');
        });

        it('should read single line create table statement without exists', () => {
            let result = reader.parse('create table `my_table` ();');

            result.length.should.equal(1);
            result[0].type.should.equal('table');
            result[0].name.should.equal('my_table');
            result[0].match.should.equal('create table `my_table` ();');
        });

        it('should read create table statement without back ticks', () => {
            let result = reader.parse('create table if not exists my_table ();');

            result.length.should.equal(1);
            result[0].type.should.equal('table');
            result[0].name.should.equal('my_table');
            result[0].match.should.equal('create table if not exists my_table ();');
        });

        it('should read multi line create table statement', () => {
            let result = reader.parse('create table if not exists `my_table` (\n);');

            result.length.should.equal(1);
            result[0].type.should.equal('table');
            result[0].name.should.equal('my_table');
            result[0].match.should.equal('create table if not exists `my_table` (\n);');
        });

        it('should read multi line create table statement with trailing whitespace', () => {
            let result = reader.parse('create table if not exists `my_table` (\n);  \n');

            result.length.should.equal(1);
            result[0].type.should.equal('table');
            result[0].name.should.equal('my_table');
            result[0].match.should.equal('create table if not exists `my_table` (\n);');
        });

        it('should read multiple create table statements', () => {
            let result = reader.parse('create table if not exists `table1` ();\n\ncreate table if not exists `table2` ();');

            result.length.should.equal(2);

            result[0].type.should.equal('table');
            result[0].name.should.equal('table1');
            result[0].match.should.equal('create table if not exists `table1` ();');

            result[1].type.should.equal('table');
            result[1].name.should.equal('table2');
            result[1].match.should.equal('create table if not exists `table2` ();');
        });
    });

    describe('insert into table', () => {
        it('should read single line insert statement', () => {
            let result = reader.parse('INSERT INTO `my_table` (`key`, `value`) VALUES (\'my_key\', 1);');

            result.length.should.equal(1);
            result[0].type.should.equal('insert');
            result[0].name.should.equal('my_table');
        });

        it('should read multi line insert statement with multiple rows', () => {
            let result = reader.parse('INSERT INTO `my_table` (`key`, `value`) VALUES\n(\'my_key\', 1),\n;(\'my_key_2\', 2)');

            result.length.should.equal(1);
            result[0].type.should.equal('insert');
            result[0].name.should.equal('my_table');
        });

        it('should read single line insert statement that contains `;` as part of the values', () => {
            let result = reader.parse('INSERT INTO `my_table` (`key`, `value`) VALUES (\'my;key\', 1);');

            result.length.should.equal(1);
            result[0].type.should.equal('insert');
            result[0].name.should.equal('my_table');
            result[0].match.should.equal('INSERT INTO `my_table` (`key`, `value`) VALUES (\'my;key\', 1);');
        });

        it('should read multiple single line insert statements', () => {
            let result = reader.parse('INSERT INTO `my_table` (`key`, `value`) VALUES (\'my_key\', 1);\nINSERT INTO `my_table` (`key`, `value`) VALUES (\'my_key\', 2);');

            result.length.should.equal(2);

            result[0].type.should.equal('insert');
            result[0].name.should.equal('my_table');
            result[0].match.should.equal('INSERT INTO `my_table` (`key`, `value`) VALUES (\'my_key\', 1);');

            result[1].type.should.equal('insert');
            result[1].name.should.equal('my_table');
            result[1].match.should.equal('INSERT INTO `my_table` (`key`, `value`) VALUES (\'my_key\', 2);');
        });

        it('should read multiple single line insert statements with trailing whitespace', () => {
            let result = reader.parse('INSERT INTO `my_table` (`key`, `value`) VALUES (\'my_key\', 1);\t\n\nINSERT INTO `my_table` (`key`, `value`) VALUES (\'my_key\', 2);\t\n');

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
