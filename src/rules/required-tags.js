const _ = require('lodash');
const gherkinUtils = require('./utils/gherkin.js');

const rule = 'required-tags';
const availableConfigs = {
  tags: [],
  ignoreUntagged: true
};


function checkTagExists(requiredTag, ignoreUntagged, scenarioTags, scenarioType, scenarioLine) {
  const result = (ignoreUntagged && scenarioTags.length == 0)
    || scenarioTags.some((tagObj) => RegExp(requiredTag).test(tagObj.name));
  if (!result) {
    return {
      message: `No tag found matching ${requiredTag} for ${scenarioType}`,
      rule,
      line: scenarioLine
    };
  }
  return result;
}

function run(feature, unused, config) {
  if (!feature) {
    return [];
  }

  const mergedConfig = _.merge({}, availableConfigs, config);

  let errors = [];
  feature.children.forEach((child) => {
    if (child.scenario) {
      const type = gherkinUtils.getNodeType(child.scenario, feature.language);
      const line = child.scenario.location.line;

      // Check each Scenario for the required tags
      const requiredTagErrors = mergedConfig.tags
        .map((requiredTag) => checkTagExists(requiredTag, mergedConfig.ignoreUntagged, child.scenario.tags || [], type, line))
        .filter((item) =>
          typeof item === 'object' && item.message
        );

      // Update errors
      errors = errors.concat(requiredTagErrors);
    }
  });
  
  return errors;
}

module.exports = {
  name: rule,
  run: run,
  availableConfigs: availableConfigs
};
