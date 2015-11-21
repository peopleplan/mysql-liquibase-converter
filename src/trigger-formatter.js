import SqlFormatter from './sql-formatter';

class TriggerFormatter extends SqlFormatter {
    constructor(author) {
        super(author, 'source');
        this.changesetProperties['endDelimiter'] = '//';
        this.changesetProperties['runOnChange'] = 'true';
    }

    format (readerResult) {
        let output = '';

        output += this.getPrefix();
        output += '\n\n';
        output += this.getChangesetComment();
        output += '\n';
        output += `DROP TRIGGER IF EXISTS \`${readerResult.name}\`;`;
        output += '\n//\n\n';
        output += this.formatContent(readerResult.match);
        output += '\n//\n';

        return output;
    }
}

export default TriggerFormatter;
