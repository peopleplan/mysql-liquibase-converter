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
});
