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
let formatters = new SqlFormatter();
let converter = new Converter({
    tempKeys: program.tempKeys
}, reader, formatters);

formatters['table'] = new TableFormatter();
formatters['trigger'] = new TriggerFormatter();

let contents = fs.readFileSync(file, 'utf8');
converter.createFiles(contents, outputDirectory);
