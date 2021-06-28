var ruleTestBase = require('../rule-test-base');
var rule = require('../../../dist/rules/keywords-in-logical-order.js');
var runTest = ruleTestBase.createRuleTest(rule,
  'Step "<%= keyword %> <%= text %>" should not appear after step using keyword <%= priorKeyword %>');

describe('Keywords in logical order', function() {
  it('doesn\'t raise errors when there are no violations, for file not using gherkin rules', function() {
    return runTest('keywords-in-logical-order/NoViolations.feature', {}, []);
  });

  it('doesn\'t raise errors when there are no violations, for file that uses gherkin rules', function() {
    return runTest('keywords-in-logical-order/NoViolationsUsingRules.feature', {}, []);
  });

  let expectedViolations = [
    {
      messageElements: { keyword: 'When', text: 'step2', priorKeyword: 'then'},
      line: 7
    },
    {
      messageElements: { keyword: 'Given', text: 'step3', priorKeyword: 'then'},
      line: 8
    },
    {
      messageElements: { keyword: 'Given', text: 'step12', priorKeyword: 'when'},
      line: 12
    },
    {
      messageElements: { keyword: 'Given', text: 'step22', priorKeyword: 'then'},
      line: 16
    },
    {
      messageElements: { keyword: 'When', text: 'step32', priorKeyword: 'then'},
      line: 20
    },
    {
      messageElements: { keyword: 'When', text: 'step54', priorKeyword: 'then'},
      line: 26
    },
    {
      messageElements: { keyword: 'When', text: 'step42', priorKeyword: 'then'},
      line: 30
    },
    {
      messageElements: { keyword: 'Given', text: 'step43', priorKeyword: 'then'},
      line: 31
    },
  ];

  it('raises errors when there are violations, for file not using gherkin rules', function() {
    return runTest('keywords-in-logical-order/Violations.feature', {}, expectedViolations);
  });

  it('raises errors when there are violations, for file that uses gherkin rules', function() {
    return runTest('keywords-in-logical-order/ViolationsUsingRules.feature', {}, expectedViolations);
  });
});
