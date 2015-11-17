import fd from 'filendir';
import path from 'path';

class Converter {
    static folderTypeMap = {
        'table': 'tables',
        'pre': 'support',
        'post': 'support'
    }

    constructor (options, reader, formatters) {
        this.options = options;
        this.reader = reader;
        this.formatters = formatters;
    }

    toGraph (input) {
        let results = this.reader.parse(input);

        let items = results.map((r) => {
            return {
                type: r.type,
                name: r.name,
                content: (this.formatters[r.type] || this.formatters).format(r)
            }
        });

        if (this.options.tempKeys) {
            items.unshift({
                type: 'pre',
                name: 'pre_execution',
                content: 'SET FOREIGN_KEY_CHECKS=0;'
            });

            items.push({
                type: 'post',
                name: 'post_execution',
                content: 'SET FOREIGN_KEY_CHECKS=1;'
            });
        }

        return items;
    }

    createFiles (input, outputLocation) {
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
                    file: relativePath,
                    relativeToChangelogFile: true
                }
            });
        });

        fd.writeFileSync(
            path.join(outputLocation, 'changelog.json'),
            JSON.stringify(json, null, 2)
        );
    }

    getFilePath (type, name) {
        let folderType = Converter.folderTypeMap[type] || 'data';
        return `migrations/baseline/${folderType}/${name}.sql`;
    }
}

export default Converter;
