class Reader {
    static blockCommentExpression = {
        type: 'comment',
        pattern: [ /\/\*/, /\*\// ],
        nameIndex: 0
    };

    static tableExpression = {
        type: 'table',
        pattern: [ /\b(create|alter)\s+table\s+(if\s+not\s+exists\s+)?`?([^\s`]+)`?/i, /;(?=[ \t]*$)/mi ],
        nameIndex: 3
    };

    static insertExpression = {
        type: 'insert',
        pattern: [ /\binsert\s+into\s*`?([^\s`]+)`?/i, /;(?=[ \t]*$)/mi ],
        nameIndex: 1
    };

    static createTriggerExpression = {
        type: 'trigger',
        pattern: [ /\bcreate\s+trigger\s+`?([^\s`]+)`?/i, /\bend(?=[ \t]*$)/mi ],
        nameIndex: 1
    };

    constructor ({ includeData } = {}) {
        this.expressions = [ Reader.blockCommentExpression, Reader.tableExpression, Reader.createTriggerExpression ];

        if (includeData) {
            this.expressions.push(Reader.insertExpression);
        }
    }

    parse (input) {
        let matches = [];
        let startMatch;
        let index = 0;

        while (startMatch = this.firstMatch(input, this.expressions, index)) {
            let startIndex = startMatch.match.index + index;
            let endIndex = input.length;
            let endMatch = startMatch.expression.pattern[1].exec(input.substring(startIndex + startMatch.match[0].length));

            if (endMatch) {
                endIndex = startIndex + startMatch.match[0].length + endMatch.index + endMatch[0].length;
            }

            matches.push({
                type: startMatch.expression.type,
                index: startIndex,
                match: input.substring(startIndex, endIndex),
                name: startMatch.match[startMatch.expression.nameIndex]
            });

            index = endIndex;
        }

        // combine related elements together
        matches = this.combine(matches);

        matches.sort((a, b) => a.index - b.index);

        // remove comments
        matches = matches.filter((r) => ['comment'].indexOf(r.type) == -1);

        return matches;
    }

    firstMatch (input, expressions, startIndex) {
        return expressions
            .map((exp) => {
                return {
                    expression: exp,
                    match: exp.pattern[0].exec(input.substring(startIndex))
                }
            })
            .reduce((prev, curr, index, arr) => {
                if (!prev && curr.match) {
                    return curr;
                }

                if (prev && curr.match) {
                    if (curr.match.index < prev.match.index) {
                        return curr;
                    }
                }

                return prev;
            }, null);
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
