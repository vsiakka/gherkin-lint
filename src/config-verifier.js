const rules = require('./rules.js');

function verifyConfigurationFile(config, additionalRulesDirs) {
  let errors = [];
  if (config.rules) {
    let ruleConfig = config.rules;
    for (let rule in ruleConfig) {
      if (!rules.doesRuleExist(rule, additionalRulesDirs)) {
        errors.push('Rule "' + rule + '" does not exist');
      } else {
        verifyRuleConfiguration(rule, ruleConfig[rule], additionalRulesDirs, errors);
      }
    }
  }
  return errors;
}

function verifyRuleConfiguration(rule, ruleConfig, additionalRulesDirs, errors) {
  const enablingSettings = ['on', 'off'];
  const genericErrorMsg = 'Invalid rule configuration for "' + rule + '" - ';

  if (Array.isArray(ruleConfig)) {
    if (!enablingSettings.includes(ruleConfig[0])) {
      errors.push(genericErrorMsg + 'The first part of the config should be "on" or "off"');
    }

    if (ruleConfig.length != 2 ) {
      errors.push(genericErrorMsg + ' The config should only have 2 parts.');
    }

    const ruleObj = rules.getRule(rule, additionalRulesDirs);
    let isValidSubConfig;

    if (typeof(ruleConfig[1]) === 'string') {
      isValidSubConfig = (availableConfigs, subConfig) => ruleObj.availableConfigs.includes(subConfig);
      testSubconfig(genericErrorMsg, rule, ruleConfig[1], isValidSubConfig, additionalRulesDirs, errors);
    } else {
      isValidSubConfig = (availableConfigs, subConfig) => ruleObj.availableConfigs[subConfig] !== undefined;
      for (let subConfig in ruleConfig[1]) {
        testSubconfig(genericErrorMsg, rule, subConfig, isValidSubConfig, additionalRulesDirs, errors);
      }
    }
  } else {
    if (!enablingSettings.includes(ruleConfig)) {
      errors.push(genericErrorMsg + 'The the config should be "on" or "off"');
    }
  }
}

function testSubconfig(genericErrorMsg, rule, subConfig, isValidSubConfig, additionalRulesDirs, errors) {
  const ruleObj = rules.getRule(rule, additionalRulesDirs);
  if (!isValidSubConfig(ruleObj.availableConfigs, subConfig)) {
    errors.push(genericErrorMsg + ' The rule does not have the specified configuration option "' + subConfig + '"');
  }
}

module.exports = verifyConfigurationFile;
