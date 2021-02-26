const fs = require('fs');
const path = require('path');
const stripJsonComments = require('strip-json-comments');
const verifyConfig = require('./config-verifier.js');
const logger = require('./logger.js');
const defaultConfigFileName = '.gherkin-lintrc';

function getConfiguration(configPath, additionalRulesDirs) {
  if (configPath) {
    if (!fs.existsSync(configPath)) {
      logger.boldError('Could not find specified config file "' + configPath + '"');
      return process.exit(1);
    }
  } else {
    if (!fs.existsSync(defaultConfigFileName)) {
      logger.boldError('Could not find default config file "' + defaultConfigFileName +'" in the working ' +
                      'directory.\nTo use a custom name/path provide the config file using the "-c" arg.');
      return process.exit(1);
    }
    configPath = defaultConfigFileName;
  }
  const config = JSON.parse(stripJsonComments(fs.readFileSync(configPath, {encoding: 'UTF-8'})));

  if (additionalRulesDirs) {
    // Use the supplied additionalRulesDirs instead of the version in configuration.
    config.additionalRulesDirs = additionalRulesDirs;
  } else if (config.additionalRulesDirs) {
    // Map the paths in the additionalRulesDirs configuration relative to the configuration file.
    config.additionalRulesDirs = config.additionalRulesDirs.map(additionalRulesDir => path.resolve(
      path.dirname(configPath),
      additionalRulesDir
    ));
  }

  const errors = verifyConfig(config, config.additionalRulesDirs);

  if (errors.length > 0) {
    logger.boldError('Error(s) in configuration file:');
    errors.forEach(error => {
      logger.error(`- ${error}`);
    });
    process.exit(1);
  }

  return config;
}

module.exports = {
  getConfiguration: getConfiguration,
  defaultConfigFileName: defaultConfigFileName
};
