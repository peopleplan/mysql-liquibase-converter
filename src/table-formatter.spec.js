import chai from 'chai'
import TableFormatter from './table-formatter';

chai.should();

describe('Table Formatter', () => {
    let formatter;

    beforeEach(() => {
        formatter = new TableFormatter();
    });

    describe('create table', () => {
        it('should format create table statement and drop `AUTO_INCREMENT` attribute', () => {
            const match = 'create table if not exists `my_table` () AUTO_INCREMENT = 123 ;';
            let result = formatter.format({ match });

            result.should.equal(`--liquibase formatted sql\n\n--changeset converter:baseline dbms:mysql\ncreate table if not exists \`my_table\` () ;\n`);
        });
    });
});
