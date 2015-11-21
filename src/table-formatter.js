import SqlFormatter from './sql-formatter';

class TableFormatter extends SqlFormatter {
    constructor (author, changesetId) {
        super(author, changesetId)
    }

    formatContent (content) {
        return content.replace(/\bAUTO_INCREMENT\s*=\s*\d+\s*(?=;\s*$)/gmi, '');
    }
}

export default TableFormatter;
