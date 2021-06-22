var ruleTestBase = require('../rule-test-base');
var rule = require('../../../dist/rules/only-one-when.js');
var runTest = ruleTestBase.createRuleTest(rule,
  'Scenario "<%= scenario %>" contains <%= whenCount %> When statements (max 1)');

describe('Only one When step', function () {
  it('doesn\'t raise errors when there are no violations, for file not using gherkin rules', function () {
    return runTest('only-one-when/NoViolations.feature', {}, []);
  });

  it('doesn\'t raise errors when there are no violations, for file that uses gherkin rules', function () {
    return runTest('only-one-when/NoViolationsUsingRules.feature', {}, []);
  });

  let expectedViolations = [
    {
      messageElements: {scenario: 'When, When', whenCount: 2},
      line: 5
    },
    {
      messageElements: {scenario: 'When, And', whenCount: 2},
      line: 9
    },
    {
      messageElements: {scenario: 'Given, When, And, Then', whenCount: 2},
      line: 13
    },
    {
      messageElements: {scenario: 'Outline Given, When, And, Then', whenCount: 2},
      line: 19
    },
    {
      messageElements: {scenario: 'Given, When, When, And, Then', whenCount: 3},
      line: 28
    },
    {
      messageElements: {scenario: 'Given, When, Then, When, And', whenCount: 3},
      line: 35
    },
  ];

  it('raises errors when there are violations, for file not using gherkin rules', function () {
    return runTest('only-one-when/Violations.feature', {}, expectedViolations);
  });

  it('raises errors when there are violations, for file that uses gherkin rules', function () {
    return runTest('only-one-when/ViolationsUsingRules.feature', {}, expectedViolations);
  });
});
