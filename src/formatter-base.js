class FormatterBase {
    author = 'converter';
    changesetId = 'baseline';
    changesetProperties = {
        'dbms': 'mysql'
    };

    constructor(author, changesetId) {
        if (author) this.author = author;
        if (changesetId) this.changesetId = changesetId;
    }

    getPrefix () {
        return '--liquibase formatted sql';
    }

    getChangesetComment() {
        let args = Object.getOwnPropertyNames(this.changesetProperties).map((p) => `${p}:${this.changesetProperties[p]}`);
        args.unshift(`--changeset ${this.author}:${this.changesetId}`);
        return args.join(' ');
    }
}

export default FormatterBase;
