import chai from 'chai'
import SqlFormatter from './sql-formatter';

chai.should();

describe('Basic SQL Formatter', () => {
    let formatter;

    beforeEach(() => {
        formatter = new SqlFormatter();
    });

    describe('create table', () => {
        it('should format create table statement', () => {
            const match = 'create table if not exists `my_table` ();';
            let result = formatter.format({ match });

            result.should.equal(`--liquibase formatted sql\n\n--changeset converter:baseline dbms:mysql\n${match}\n`);
        });

        it('should format create table statement with specific author and changesetId', () => {
            formatter = new SqlFormatter('me', 'v1.0');
            const match = 'create table if not exists `my_table` ();';
            let result = formatter.format({ match });

            result.should.equal(`--liquibase formatted sql\n\n--changeset me:v1.0 dbms:mysql\n${match}\n`);
        });
    });

    describe('insert into', () => {
        it('should format insert into statement', () => {
            const match = 'INSERT INTO `my_table` (`key`, `value`) VALUES (\'my_key\', 1);';
            let result = formatter.format({ match });

            result.should.equal(`--liquibase formatted sql\n\n--changeset converter:baseline dbms:mysql\n${match}\n`);
        });
    });
});
