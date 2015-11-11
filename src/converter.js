import fd from 'filendir';
import path from 'path';

class Converter {
    constructor (reader, formatters) {
        this.reader = reader;
        this.formatters = formatters;
    }

    toGraph (input) {
        let results = this.reader.parse(input);

        return results.map((r) => {
            return {
                type: r.type,
                name: r.name,
                content: (this.formatters[r.type] || this.formatters).format(r)
            }
        });
    }

    createFiles (outputLocation, input) {
        let graph = this.toGraph(input);
        let json = {
            databaseChangeLog: []
        };

        graph.forEach((g) => {
            let relativePath = this.getFilePath(g.type, g.name);

            fd.writeFileSync(
                path.join(outputLocation, relativePath),
                g.content
            );

            json.databaseChangeLog.push({
                include: {
                    file: relativePath
                }
            });
        });

        fd.writeFileSync(
            path.join(outputLocation, 'changelog.json'),
            JSON.stringify(json, null, 2)
        );
    }

    getFilePath (type, name) {
        let folderType = type === 'table' ? 'tables' : 'data';
        return `migrations/baseline/${folderType}/${name}.sql`;
    }
}

export default Converter;
