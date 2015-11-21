import fd from 'filendir';
import path from 'path';

class Converter {
    static defaultFolder = 'migrations/${changesetId}/data';
    static folderTypeMap = {
        'table': 'migrations/${changesetId}/tables',
        'pre': 'migrations/${changesetId}/support',
        'post': 'migrations/${changesetId}/support',
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
                content: (this.formatters[r.type] || this.formatters).format(r),
                formatter: this.formatters[r.type] || this.formatters
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
            let relativePath = this.getFilePath(g.type, g.name, g.formatter);

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

    getFilePath (type, name, formatter) {
        let folder = Converter.folderTypeMap[type] || Converter.defaultFolder;
        folder = folder.replace(/\$\{changesetId\}/gi, formatter.changesetId);

        return `${folder}/${name}.sql`;
    }
}

export default Converter;
