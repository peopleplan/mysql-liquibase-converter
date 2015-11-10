class Reader {
    static expressions = [
        { type: 'table', pattern: /\bcreate\s+table\s+(if\s+not\s+exists\s+)?`?([^\s`]+)`?[\s\S]*?;/gi, nameIndex: 2 },
        { type: 'insert', pattern: /\binsert\s+into\s*`?([^\s`]+)`?[\s\S]*?;/gi, nameIndex: 1 }
    ];

    parse (input) {
        let matches = [];
        Reader.expressions
            .forEach((exp) => {
                let match;

                exp.pattern.lastIndex = 0;

                while (match = exp.pattern.exec(input)) {
                    matches.push({
                        type: exp.type,
                        index: match.index,
                        match: match[0],
                        name: match[exp.nameIndex]
                    });
                }
            });

        return matches;
    }
}

export default Reader;
