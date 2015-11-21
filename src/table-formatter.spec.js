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

        it('should format create table statement and drop `AUTO_INCREMENT` attribute with specific author and changesetId', () => {
            formatter = new TableFormatter('me', 'v1.0');
            const match = 'create table if not exists `my_table` () AUTO_INCREMENT = 123 ;';
            let result = formatter.format({ match });

            result.should.equal(`--liquibase formatted sql\n\n--changeset me:v1.0 dbms:mysql\ncreate table if not exists \`my_table\` () ;\n`);
        });
    });
});
