import program from 'commander';
import packageInfo from '../package.json'
import Converter from './converter';
import Reader from './reader';
import SqlFormatter from './sql-formatter';
import TableFormatter from './table-formatter';
import TriggerFormatter from './trigger-formatter';
import fs from 'fs';

let file;
let outputDirectory;

program
    .version(packageInfo.version)
    .usage('[options] <sqlFile> [outputLocation]')
    .arguments('<sqlFile> [outputLocation]')
    .option('-d, --includeData', 'include table data', false)
    .option('-k, --tempKeys', 'disable and re-enable foreign keys, helps order of execution issues', false)
    .option('-a, --author <name>', 'changeset author, defaults to `converter`', 'converter')
    .option('-c, --changesetId <id>', 'changeset id, defaults to `baseline`', 'baseline')
    .action((sqlFile, outputLocation) => {
        outputDirectory = outputLocation;
        file = sqlFile;
    });

program.parse(process.argv);

outputDirectory = outputDirectory || './output';

if (!file) {
   console.error('no sqlFile provided');
   process.exit(1);
}

let reader = new Reader({
    includeData: program.includeData
});
let formatters = new SqlFormatter(program.author, program.changesetId);
let converter = new Converter({
    tempKeys: program.tempKeys
}, reader, formatters);

formatters['table'] = new TableFormatter(program.author, program.changesetId);
formatters['trigger'] = new TriggerFormatter(program.author);

let contents = fs.readFileSync(file, 'utf8');
converter.createFiles(contents, outputDirectory);
