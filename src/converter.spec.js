import chai from 'chai'
import Converter from './converter';
import Reader from './reader';
import SqlFormatter from './sql-formatter';
import TableFormatter from './table-formatter';
import TriggerFormatter from './trigger-formatter';
import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf'

chai.should();

describe('Converter', () => {
    let converter;
    let reader;
    let formatters;

    beforeEach(() => {
        formatters = new SqlFormatter();
        formatters['table'] = new TableFormatter();
        formatters['trigger'] = new TriggerFormatter();

        reader = new Reader({ includeData: true });

        converter = new Converter({}, reader, formatters);
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

        it('should convert single insert into statement to object graph while temporarily disabling foreign keys', () => {
            converter = new Converter({ tempKeys: true }, reader, formatters);
            const input = 'INSERT INTO `my_table` (`key`, `value`) VALUES (\'my_key\', 1);';
            let result = converter.toGraph(input);

            result.length.should.equal(3);

            result[0].type.should.equal('pre');

            result[1].type.should.equal('insert');
            result[1].name.should.equal('my_table');
            result[1].content.should.equal(`--liquibase formatted sql\n\n--changeset converter:baseline dbms:mysql\n${input}\n`);

            result[2].type.should.equal('post');
        });

        it('should convert basic.sql file to object graph', () => {
            const input = fs.readFileSync(path.resolve(__dirname, '../testdata/basic.sql'), 'utf8');
            let result = converter.toGraph(input);

            result.length.should.equal(3);

            result[0].type.should.equal('table');
            result[0].name.should.equal('my_table');

            result[1].type.should.equal('insert');
            result[1].name.should.equal('my_table');

            result[2].type.should.equal('trigger');
            result[2].name.should.equal('my_trigger');
        });
    });

    describe('files', () => {
        beforeEach(() => {
            let author = 'author'
            let changesetId = 'v1.0';
            formatters = new SqlFormatter(author, changesetId);
            formatters['table'] = new TableFormatter(author, changesetId);
            formatters['trigger'] = new TriggerFormatter(author);

            converter = new Converter({}, reader, formatters);

            rimraf.sync(path.resolve(__dirname, '../testdata/temp'));
        });

        it('should create files on disk based on basic.sql file', () => {
            const input = fs.readFileSync(path.resolve(__dirname, '../testdata/basic.sql'), 'utf8');
            let result = converter.createFiles(input, path.resolve(__dirname, '../testdata/temp'));

            // check that files exist and are accessible
            fs.accessSync(path.resolve(__dirname, '../testdata/temp/changelog.json'));
            fs.accessSync(path.resolve(__dirname, '../testdata/temp/migrations/v1.0/tables/my_table.sql'));
            fs.accessSync(path.resolve(__dirname, '../testdata/temp/migrations/v1.0/data/my_table.sql'));
            fs.accessSync(path.resolve(__dirname, '../testdata/temp/source/triggers/my_trigger.sql'));
        });

        it('should create files on disk based on basic.sql file excluding data', () => {
            reader = new Reader({ includingData: false });
            converter = new Converter({}, reader, formatters);
            const input = fs.readFileSync(path.resolve(__dirname, '../testdata/basic.sql'), 'utf8');
            let result = converter.createFiles(input, path.resolve(__dirname, '../testdata/temp'));

            // check that files exist and are accessible
            fs.accessSync(path.resolve(__dirname, '../testdata/temp/changelog.json'));
            fs.accessSync(path.resolve(__dirname, '../testdata/temp/migrations/v1.0/tables/my_table.sql'));
            fs.accessSync(path.resolve(__dirname, '../testdata/temp/source/triggers/my_trigger.sql'));

            (() => fs.accessSync(path.resolve(__dirname, '../testdata/temp/migrations/v1.0/data/my_table.sql')))
                .should.throw();
        });

        it('should create files on disk based on basic.sql file excluding data and temporarily disable foreign keys', () => {
            reader = new Reader({ includingData: false });
            converter = new Converter({ tempKeys: true }, reader, formatters);
            const input = fs.readFileSync(path.resolve(__dirname, '../testdata/basic.sql'), 'utf8');
            let result = converter.createFiles(input, path.resolve(__dirname, '../testdata/temp'));

            // check that files exist and are accessible
            fs.accessSync(path.resolve(__dirname, '../testdata/temp/changelog.json'));
            fs.accessSync(path.resolve(__dirname, '../testdata/temp/migrations/v1.0/tables/my_table.sql'));
            fs.accessSync(path.resolve(__dirname, '../testdata/temp/source/triggers/my_trigger.sql'));

            (() => fs.accessSync(path.resolve(__dirname, '../testdata/temp/migrations/v1.0/data/my_table.sql')))
                .should.throw();

            fs.accessSync(path.resolve(__dirname, '../testdata/temp/migrations/v1.0/support/pre_execution.sql'));
            fs.accessSync(path.resolve(__dirname, '../testdata/temp/migrations/v1.0/support/post_execution.sql'));
        });
    });
});
