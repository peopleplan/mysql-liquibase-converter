import chai from 'chai'
import Triggerormatter from './trigger-formatter';

chai.should();

describe('Trigger Formatter', () => {
    let formatter;

    beforeEach(() => {
        formatter = new Triggerormatter();
    });

    describe('create table', () => {
        it('should format create trigger statement', () => {
            const createSql = 'CREATE TRIGGER `my_trigger` AFTER DELETE ON `my_table`\nFOR EACH ROW BEGIN\nupdate  `summary` set my_value = my_value - 1 where id = old.my_id;\nEND';
            let result = formatter.format({ match: createSql, name: 'my_trigger' });

            result.should.equal(`--liquibase formatted sql\n\n--changeset converter:baseline endDelimiter:// dbms:mysql\nDROP TRIGGER IF EXISTS \`my_trigger\`;\n//\n\n${createSql}\n//\n`);
        });
    });
});
