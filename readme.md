# MySql to Liquibase Converter

The MySql to Liquibase Converter is intended to split up the contents of a single MySql `sql` file into a series of smaller files that are easier to maintain and version independently.

## Installation

There are two ways to install this package.

### Option 1

Install directly from github.

```
npm install peopleplan/mysql-liquibase-converter -g
```

### Option 2

Clone the repository and install it locally.

```
npm install . -g
```

## Usage

```
mysqlbase <sqlFile> [output]
```
