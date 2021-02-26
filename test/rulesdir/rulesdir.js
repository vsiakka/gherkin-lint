var path = require('path');
var expect = require('chai').expect;
var linter = require('../../dist/linter');
var configParser = require('../../dist/config-parser');

var featureFile = path.join(__dirname, 'simple.features');
var expectedResult = [
  {
    errors: [
      { // This one is to make sure we don't accidentally regress and always load the default rules
        line: 1,
        message: 'Wrong indentation for "Feature", expected indentation level of 0, but got 4',
        rule: 'indentation'
      },
      {
        line: 109,
        message: 'Another custom-list error',
        rule: 'another-custom-list'
      },
      {
        line: 123,
        message: 'Custom error',
        rule: 'custom'
      },
      {
        line: 456,
        message: 'Another custom error',
        rule: 'another-custom'
      }
    ],
    filePath: featureFile
  }
];

describe('rulesdir CLI option', function() {
  it('loads additional rules from specified directories', function() {
    var additionalRulesDirs = [
      path.join(__dirname, 'rules'), // absolute path
      path.join('test', 'rulesdir', 'other_rules') // relative path from root
    ];
    var config = configParser.getConfiguration(path.join(__dirname, '.gherkin-lintrc'), additionalRulesDirs);
    return linter.lint([ featureFile ], config)
      .then((results) => {
        expect(results).to.deep.equal(expectedResult);
      });
  });
});

describe('rulesdir .gherkin-lintrc config option', function() {
  it('loads additional rules from specified directories', function() {
    var config = configParser.getConfiguration(path.join(__dirname, '.gherkin-lintrc-rulesdir'));
    return linter.lint([ featureFile ], config)
      .then((results) => {
        expect(results).to.deep.equal(expectedResult);
      });
  });
});

describe('rulesdir CLI option overrides .gherkin-lintrc config option', function() {
  it('loads additional rules from specified directories', function() {
    var additionalRulesDirs = [
      path.join(__dirname, 'rules'), // absolute path
      path.join('test', 'rulesdir', 'other_rules') // relative path from root
    ];
    var config = configParser.getConfiguration(path.join(__dirname, '.gherkin-lintrc-invalid-rulesdir'), additionalRulesDirs);
    return linter.lint([ featureFile ], config)
      .then((results) => {
        expect(results).to.deep.equal(expectedResult);
      });
  });
});
