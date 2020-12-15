var assert = require('chai').assert;
var verifyConfig = require('../dist/config-verifier.js');

describe('Config Verifier', function() {
  describe('Verification is successful when', function() {
    it('rules are set to "on" or "off"', function() {
      assert.deepEqual(verifyConfig({
        'no-files-without-scenarios' : 'on',
        'no-unnamed-features': 'on',
        'no-unnamed-scenarios': 'on',
        'no-dupe-scenario-names': 'on',
        'no-dupe-feature-names': 'on',
        'no-partially-commented-tag-lines': 'on',
        'indentation': 'on',
        'no-trailing-spaces': 'on',
        'no-multiple-empty-lines': 'off'
      }), []);
    });

    it('a rule config is an array of size 2, with an "on/off" state and another config value', function() {
      assert.deepEqual(verifyConfig({'new-line-at-eof': ['on', 'yes']}), []);
    });

    it('a rule config is an array of size 2, with an "on/off" state and a keyworded array', function() {
      assert.deepEqual(verifyConfig({
        'indentation': ['on', { 'Feature': 1, 'Background': 1, 'Scenario': 1, 'Step': 1, 'given': 1, 'and': 1}]
      }), []);
    });

    it('an additional rule directory is specified', function() {
      assert.deepEqual(verifyConfig({'additionalRulesDirs': ['.rules']}), []);
    });
  });

  describe('Verification fails when', function() {
    it('a non existing rule', function() {
      assert.deepEqual(verifyConfig({'fake-rule': 'on'}), ['Rule "fake-rule" does not exist']);
    });

    it('a non existing rule sub-config', function() {
      assert.deepEqual(verifyConfig({
        'indentation': ['on', { 'featur': 0}],
        'new-line-at-eof': ['on', 'y']
      }), [
        'Invalid rule configuration for "indentation" -  The rule does not have the specified configuration option "featur"',
        'Invalid rule configuration for "new-line-at-eof" -  The rule does not have the specified configuration option "y"'
      ]);
    });

    it('rule config that\'s not properly configured to "on/off"', function() {
      assert.deepEqual(verifyConfig({
        'no-files-without-scenarios': 'o',
        'new-line-at-eof': ['o', 'yes'],
        'indentation': ['o', { 'Feature': 1, 'Background': 1, 'Scenario': 1, 'Step': 1, 'given': 1, 'and': 1}]
      }), [
        'Invalid rule configuration for "no-files-without-scenarios" - The the config should be "on" or "off"',
        'Invalid rule configuration for "new-line-at-eof" - The first part of the config should be "on" or "off"',
        'Invalid rule configuration for "indentation" - The first part of the config should be "on" or "off"']);
    });

    it('an array configuration doesn\'t have exactly 2 parts', function() {
      assert.deepEqual(verifyConfig({'new-line-at-eof': ['on']}), [
        'Invalid rule configuration for "new-line-at-eof" -  The config should only have 2 parts.'
      ]);

      assert.deepEqual(verifyConfig({'new-line-at-eof': ['on', 'yes', 'p3']}), [
        'Invalid rule configuration for "new-line-at-eof" -  The config should only have 2 parts.'
      ]);
    });

    it('an additional rule directory is not an array', function() {
      assert.deepEqual(verifyConfig({'additionalRulesDirs': 'a'}), [
        'Invalid rule configuration for "additionalRulesDirs" - The config should be an Array.'
      ]);
    });
  });
});

