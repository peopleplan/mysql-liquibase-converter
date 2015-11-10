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
        });

        it('should read single line create table statement without exists', () => {
            let result = reader.parse('create table `my_table` ();');

            result.length.should.equal(1);
            result[0].type.should.equal('table');
            result[0].name.should.equal('my_table');
        });

        it('should read create table statement without back ticks', () => {
            let result = reader.parse('create table if not exists my_table ();');

            result.length.should.equal(1);
            result[0].type.should.equal('table');
            result[0].name.should.equal('my_table');
        });

        it('should read multi line create table statement', () => {
            let result = reader.parse('create table if not exists `my_table` (\n);');

            result.length.should.equal(1);
            result[0].type.should.equal('table');
            result[0].name.should.equal('my_table');
        });

        it('should read multiple create table statements', () => {
            let result = reader.parse('create table if not exists `table1` ();\ncreate table if not exists `table2` ();');

            result.length.should.equal(2);

            result[0].type.should.equal('table');
            result[0].name.should.equal('table1');

            result[1].type.should.equal('table');
            result[1].name.should.equal('table2');
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

        // don't know how to handle this yet. might be more trouble than it is worth.
        // the primary focus for this initially will be the creation of tables
        it.skip('should read single line insert statement that contains `;` as part of the values', () => {
            let result = reader.parse('INSERT INTO `my_table` (`key`, `value`) VALUES (\'my;key\', 1);');

            result.length.should.equal(1);
            result[0].type.should.equal('insert');
            result[0].name.should.equal('my_table');
            result[0].match.should.equal('INSERT INTO `my_table` (`key`, `value`) VALUES (\'my;key\', 1);');
        });

        it('should read  multiple single line insert statements', () => {
            let result = reader.parse('INSERT INTO `my_table` (`key`, `value`) VALUES (\'my_key\', 1);\nINSERT INTO `my_table` (`key`, `value`) VALUES (\'my_key\', 2);');

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
