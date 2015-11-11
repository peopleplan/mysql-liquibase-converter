import chai from 'chai'
import Converter from './converter';
import Reader from './reader';
import SqlFormatter from './sql-formatter';
import fs from 'fs';
import path from 'path';

chai.should();

describe('Converter', () => {
    let converter;
    let reader;
    let formatters;

    beforeEach(() => {
        formatters = new SqlFormatter();
        formatters['table'] = new SqlFormatter();

        reader = new Reader();

        converter = new Converter(reader, formatters);
    });

    describe('graph', () => {
        it('should convert single create table statement to object graph', () => {
            const input = 'create table if not exists `my_table` ();';
            let result = converter.toGraph(input);

            result.length.should.equal(1);
            result[0].type.should.equal('table');
            result[0].name.should.equal('my_table');
            result[0].content.should.equal(`--liquibase formatted sql\n\n--changeset converter:baseline dbms:mysql\n${input}\n`);
        });

        it('should convert single insert into statement to object graph', () => {
            const input = 'INSERT INTO `my_table` (`key`, `value`) VALUES (\'my_key\', 1);';
            let result = converter.toGraph(input);

            result.length.should.equal(1);
            result[0].type.should.equal('insert');
            result[0].name.should.equal('my_table');
            result[0].content.should.equal(`--liquibase formatted sql\n\n--changeset converter:baseline dbms:mysql\n${input}\n`);
        });

        it('should convert basic.sql file to object graph', () => {
            const input = fs.readFileSync(path.resolve(__dirname, '../testdata/basic.sql'), 'utf8');
            let result = converter.toGraph(input);

            result.length.should.equal(2);

            result[0].type.should.equal('table');
            result[0].name.should.equal('my_table');

            result[1].type.should.equal('insert');
            result[1].name.should.equal('my_table');
        });
    });

    describe('files', () => {
        it('should create files on disk based on basic.sql file', () => {
            const input = fs.readFileSync(path.resolve(__dirname, '../testdata/basic.sql'), 'utf8');
            let result = converter.createFiles(input, path.resolve(__dirname, '../testdata/temp'));

            // check that files exist and are accessible
            fs.accessSync(path.resolve(__dirname, '../testdata/temp/changelog.json'));
            fs.accessSync(path.resolve(__dirname, '../testdata/temp/migrations/baseline/tables/my_table.sql'));
            fs.accessSync(path.resolve(__dirname, '../testdata/temp/migrations/baseline/data/my_table.sql'));
        });
    });
});
