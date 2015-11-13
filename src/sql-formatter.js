import FormatterBase from './formatter-base';

class SqlFormatter extends FormatterBase {
    format (readerResult) {
        let output = '';

        output += this.getPrefix();
        output += '\n\n';
        output += '--changeset converter:baseline dbms:mysql\n';
        output += this.formatContent(readerResult.match);
        output += '\n';

        return output;
    }

    formatContent (content) {
        return content;
    }
}

export default SqlFormatter;
