class Reader {
    static expressions = [
        { type: 'table', pattern: [ /\bcreate\s+table\s+(if\s+not\s+exists\s+)?`?([^\s`]+)`?/gi, /;(?=[ \t]*$)/mi ], nameIndex: 2 },
        { type: 'insert', pattern: [ /\binsert\s+into\s*`?([^\s`]+)`?/gi, /;(?=[ \t]*$)/mi ], nameIndex: 1 }
    ];

    parse (input) {
        let matches = [];
        Reader.expressions
            .forEach((exp) => {
                var startMatch;

                exp.pattern[0].lastIndex = 0;
                exp.pattern[1].lastIndex = 0;

                while (startMatch = exp.pattern[0].exec(input)) {
                    var startIndex = startMatch.index;
                    var endIndex = input.length;
                    var endMatch = exp.pattern[1].exec(input.substring(startIndex + startMatch[0].length));

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

        return matches.sort((a, b) => a.index - b.index);
    }
}

export default Reader;
