class Reader {
    static expressions = [
        { type: 'table', pattern: /\s*create\s+table\s+(if\s+not\s+exists\s+)?`?([^\s`]+)`?[\s\S]*?;/gmi }
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
                        name: match[2]
                    });
                }
            });

        return matches;
    }
}

export default Reader;
