# MySql to Liquibase Converter

[![Build Status](https://travis-ci.org/peopleplan/mysql-liquibase-converter.svg?branch=master)](https://travis-ci.org/peopleplan/mysql-liquibase-converter)

The MySql to Liquibase Converter is intended to split up the contents of a single MySql `sql` file into a series of smaller files that are easier to maintain and version independently.

## Installation

```
npm install --global mysql-liquibase-converter
```

## Usage

```
  Usage: mysqlbase [options] <sqlFile> [outputLocation]

  Options:

    -h, --help         output usage information
    -V, --version      output the version number
    -d, --includeData  include table data
    -k, --tempKeys     disable and re-enable foreign keys, helps order of execution issues
```
