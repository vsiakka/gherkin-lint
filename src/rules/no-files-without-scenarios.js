const rule = 'no-files-without-scenarios';

function filterScenarios(child) {
  if (child.scenario != undefined) return true;

  if (child.rule == undefined) return false;

  return child.rule.children.some(filterScenarios);
}

function run(feature) {
  if (!feature) {
    return [];
  }
  let errors = [];
  if (!feature.children.some(filterScenarios)) {
    errors.push({
      message: 'Feature file does not have any Scenarios',
      rule: rule,
      line: 1
    });
  }
  return errors;
}

module.exports = {
  name: rule,
  run: run
};
