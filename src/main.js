#!/usr/bin/env node

const program = require('commander');
const linter = require('./linter.js');
const featureFinder = require('./feature-finder.js');
const configParser = require('./config-parser.js');
const logger = require('./logger.js');

function list(val) {
  return val.split(',');
}

function collect(val, memo) {
  memo.push(val);
  return memo;
}

program
  .usage('[options] <feature-files>')
  .option('-f, --format [format]', 'output format. Possible values: json, stylish, xunit. Defaults to stylish')
  .option('-i, --ignore <...>', 'comma seperated list of files/glob patterns that the linter should ignore, overrides ' + featureFinder.defaultIgnoreFileName + ' file', list)
  .option('-c, --config [config]', 'configuration file, defaults to ' + configParser.defaultConfigFileName)
  .option('-r, --rulesdir <...>', 'additional rule directories', collect, [])
  .parse(process.argv);

const additionalRulesDirs = program.rulesdir;
const files = featureFinder.getFeatureFiles(program.args, program.ignore);
const config = configParser.getConfiguration(program.config, additionalRulesDirs);
linter.lint(files, config, additionalRulesDirs)
  .then((results) => {
    printResults(results, program.format);
    process.exit(getExitCode(results));
  });

function getExitCode(results) {
  let exitCode = 0;
  results.forEach(result => {
    if (result.errors.length > 0) {
      exitCode = 1;
    }
  });
  return exitCode;
}

function printResults(results, format) {
  let formatter;
  if (format === 'json') {
    formatter = require('./formatters/json.js');
  } else if (format === 'xunit') {
    formatter = require('./formatters/xunit.js');
  } else if (!format || format === 'stylish') {
    formatter = require('./formatters/stylish.js');
  } else {
    logger.boldError('Unsupported format. The supported formats are json, xunit and stylish.');
    process.exit(1);
  }
  formatter.printResults(results);
}
