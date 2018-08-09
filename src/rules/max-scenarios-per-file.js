var rule = 'max-scenarios-per-file';

function maxScenariosPerFile(feature, _, config) {
  var errors = [];
  var count = 0;
  var maxScenarios = config;

  if (feature.children) {
    count = count + feature.children.length;

    feature.children.forEach(function (scenario) {
      if (scenario.examples) {
        count = count - 1;
        count = count + scenario.examples.length;
      }
    });
  }

  if (count > maxScenarios) {
    errors.push({
      message: 'Number of scenarios exceeds maximum: ' + count + '/' + maxScenarios,
      rule,
      line: 0,
    });
  }

  return errors;
}

module.exports = {
  name: rule,
  run: maxScenariosPerFile,
  availableConfigs: 10,
};
