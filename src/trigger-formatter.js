import SqlFormatter from './sql-formatter';

class TriggerFormatter extends SqlFormatter {
    format (readerResult) {
        let output = '';

        output += this.getPrefix();
        output += '\n\n';
        output += '--changeset converter:baseline endDelimiter:// dbms:mysql\n';
        output += `DROP TRIGGER IF EXISTS \`${readerResult.name}\`;`;
        output += '\n//\n\n';
        output += this.formatContent(readerResult.match);
        output += '\n//\n';

        return output;
    }
}

export default TriggerFormatter;
