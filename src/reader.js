class Reader {
    static expressions = [
        { type: 'table', pattern: [ /\bcreate\s+table\s+(if\s+not\s+exists\s+)?`?([^\s`]+)`?/gi, /;(?=[ \t]*$)/mi ], nameIndex: 2 },
        { type: 'insert', pattern: [ /\binsert\s+into\s*`?([^\s`]+)`?/gi, /;(?=[ \t]*$)/mi ], nameIndex: 1 }
    ];

    parse (input) {
        let matches = [];
        Reader.expressions
            .forEach((exp) => {
                let startMatch;

                exp.pattern[0].lastIndex = 0;
                exp.pattern[1].lastIndex = 0;

                while (startMatch = exp.pattern[0].exec(input)) {
                    let startIndex = startMatch.index;
                    let endIndex = input.length;
                    let endMatch = exp.pattern[1].exec(input.substring(startIndex + startMatch[0].length));

                    if (endMatch) {
                        endIndex = startIndex + startMatch[0].length + endMatch.index + endMatch[0].length;
                    }

                    matches.push({
                        type: exp.type,
                        index: startIndex,
                        match: input.substring(startIndex, endIndex),
                        name: startMatch[exp.nameIndex]
                    });
                }
            });

        matches.sort((a, b) => a.index - b.index);

        // combine related elements together
        matches = this.combine(matches);

        return matches;
    }

    combine (results) {
        let merged = {};

        results.forEach((r) => {
            let key = `${r.type}:${r.name}`;
            if (key in merged) {
                merged[key].match += '\n\n' + r.match;
            } else {
                merged[key] = r;
            }
        });

        return Object.getOwnPropertyNames(merged).map((name) => merged[name]);
    }
}

export default Reader;
