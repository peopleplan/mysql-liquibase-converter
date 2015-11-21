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

    -h, --help              output usage information
    -V, --version           output the version number
    -d, --includeData       include table data
    -k, --tempKeys          disable and re-enable foreign keys, helps order of execution issues
    -a, --author <name>     changeset author, defaults to `converter`
    -c, --changesetId <id>  changeset id, defaults to `baseline`
```

## Output conventions

The following describes the output and folder conventions for the liquibase converter.

```
root/
    migrations/                 # root folder for migrating stateful database objects
        <changesetId>/          # all scripts related to a particular changeset are grouped under here
            tables/             # table DDL scripts used for migrations go here include create/alter statements
            data/               # insert/update/delete scripts to migrate seed/reference data goes here
            support/            # supporting scripts go here, example includes scripts to disable/enable foreign keys
    source/                     # root folder for non-stateful source code
        triggers/               # source for triggers defined here
        storedprocedures/       # stored procedures here (not implemented)
        views/                  # views defined here (not impelement)
    changelog.json              # liquibase changelog file decribes the scripts and their order of execution
```
