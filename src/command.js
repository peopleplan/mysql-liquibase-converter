import program from 'commander';
import packageInfo from '../package.json'
import Converter from './converter';
import Reader from './reader';
import SqlFormatter from './sql-formatter';
import TableFormatter from './table-formatter';
import fs from 'fs';

let reader = new Reader();;
let formatters = new SqlFormatter();;
let converter = new Converter(reader, formatters);;

formatters['table'] = new TableFormatter();

let file;
let outputDirectory;

program
    .version(packageInfo.version)
    .usage('<sqlFile> [outputLocation]')
    .arguments('<sqlFile> [outputLocation]')
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

let contents = fs.readFileSync(file, 'utf8');
converter.createFiles(contents, outputDirectory);
