import FormatterBase from './formatter-base';

class SqlFormatter extends FormatterBase {
    format (readerResult) {
        let output = '';

        output += this.getPrefix();
        output += '\n\n';
        output += '--changeset converter:baseline dbms:mysql\n';
        output += readerResult.match;
        output += '\n';

        return output;
    }
}

export default SqlFormatter;
