var ruleTestBase = require('../rule-test-base');
var rule = require('../../../dist/rules/no-files-without-scenarios.js');
var runTest = ruleTestBase.createRuleTest(rule, 'Feature file does not have any Scenarios');

describe('No Files Without Scenarios Rule', function() {
  it('doesn\'t raise errors when there is a scenario in a file', function() {
    return runTest('no-files-without-scenarios/FeatureWithScenario.feature', {}, []);
  });

  it('doesn\'t raise errors when there is a scenario in a rule in a file', function() {
    return runTest('no-files-without-scenarios/FeatureWithRuleAndScenario.feature', {}, []);
  });

  it('doesn\'t raise errors when there is a scenario outline in a file', function() {
    return runTest('no-files-without-scenarios/FeatureWithScenarioOutline.feature', {}, []);
  });

  it('doesn\'t raise errors when there is a scenario outline in a rule in a file', function() {
    return runTest('no-files-without-scenarios/FeatureWithRuleAndScenarioOutline.feature', {}, []);
  });

  it('raises an error an error for features without scenarios and scenario outlines', function() {
    return runTest('no-files-without-scenarios/Violations.feature', {}, [
      { messageElements: {}, line: 1 }
    ]);
  });

  it('raises an error an error for features with rules without scenarios', function() {
    return runTest('no-files-without-scenarios/ViolationsWithRule.feature', {}, [
      { messageElements: {}, line: 1 }
    ]);
  });
});
