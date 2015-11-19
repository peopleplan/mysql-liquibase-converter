import fd from 'filendir';
import path from 'path';

class Converter {
    static defaultFolder = 'migrations/baseline/data';
    static folderTypeMap = {
        'table': 'migrations/baseline/tables',
        'pre': 'migrations/baseline/support',
        'post': 'migrations/baseline/support',
        'trigger': 'source/triggers'
    };

    constructor (options, reader, formatters) {
        this.options = options;
        this.reader = reader;
        this.formatters = formatters;
    }

    toGraph (input) {
        let results = this.reader.parse(input);

        if (this.options.tempKeys) {
            results.unshift({
                type: 'pre',
                name: 'pre_execution',
                match: 'SET FOREIGN_KEY_CHECKS=0;'
            });

            results.push({
                type: 'post',
                name: 'post_execution',
                match: 'SET FOREIGN_KEY_CHECKS=1;'
            });
        }

        let items = results.map((r) => {
            return {
                type: r.type,
                name: r.name,
                content: (this.formatters[r.type] || this.formatters).format(r)
            }
        });

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
        let folderType = Converter.folderTypeMap[type] || Converter.defaultFolder;
        return `${folderType}/${name}.sql`;
    }
}

export default Converter;
