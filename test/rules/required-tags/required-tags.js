var ruleTestBase = require('../rule-test-base');
var rule = require('../../../dist/rules/required-tags.js');
var runTest = ruleTestBase.createRuleTest(rule, 'No tag found matching <%= tags %> for <%= nodeType %>');

describe('Required Tags Rule', function() {
  it('doesn\'t raise errors when there are no violations', function() {
    return runTest('required-tags/NoViolations.feature', {
      'tags': ['@requiredscenariotag', '@required-scenario-tag', '@required-scenario-tag-\\d+']
    }, []);
  });
  it('detects errors for scenarios and scenario outlines', () => {
    return runTest('required-tags/Violations.feature', {
      'tags': ['@requiredscenariotag', '@requiredScenarioTag', '@required-scenario-tag-\\d+']
    }, [{
      messageElements: {tags: '@requiredScenarioTag', nodeType: 'Scenario'},
      line: 8
    }, {
      messageElements: {tags: '@requiredScenarioTag', nodeType: 'Scenario Outline'},
      line: 13
    }, {
      messageElements: {tags: '@required-scenario-tag-\\d+', nodeType: 'Scenario'},
      line: 8
    }, {
      messageElements: {tags: '@required-scenario-tag-\\d+', nodeType: 'Scenario Outline'},
      line: 13
    }]);
  });
  it('detects errors for scenarios and scenario outlines that have no tag', () => {
    return runTest('required-tags/Violations.feature', {
      'tags': ['@requiredscenariotag'],
      'ignoreUntagged': false
    }, [{
      messageElements: {tags: '@requiredscenariotag', nodeType: 'Scenario'},
      line: 20
    }, {
      messageElements: {tags: '@requiredscenariotag', nodeType: 'Scenario Outline'},
      line: 23
    }]);
  });
});
