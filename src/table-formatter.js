import SqlFormatter from './sql-formatter';

class TableFormatter extends SqlFormatter {
    formatContent (content) {
        return content.replace(/\bAUTO_INCREMENT\s*=\s*\d+\s*(?=;\s*$)/gmi, '');
    }
}

export default TableFormatter;
