import FormatterBase from './formatter-base';

class SqlFormatter extends FormatterBase {
    constructor(author, changesetId) {
        super(author, changesetId);
    }

    format (readerResult) {
        let output = '';

        output += this.getPrefix();
        output += '\n\n';
        output += this.getChangesetComment();
        output += '\n';
        output += this.formatContent(readerResult.match);
        output += '\n';

        return output;
    }

    formatContent (content) {
        return content;
    }
}

export default SqlFormatter;
