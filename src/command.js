import program from 'commander';
import packageInfo from '../package.json'
import Converter from './converter';
import Reader from './reader';
import SqlFormatter from './sql-formatter';
import fs from 'fs';

let reader = new Reader();;
let formatters = new SqlFormatter();;
let converter = new Converter(reader, formatters);;

formatters['table'] = new SqlFormatter();

let file;
let outputDirectory;

program
    .version(packageInfo.version)
    .arguments('<sqlFile> [output]')
    .action((sqlFile, output) => {
        outputDirectory = output;
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
