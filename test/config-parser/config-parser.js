var expect = require('chai').expect;
require('mocha-sinon');

var configParser;

describe('Configuration parser', function() {
  beforeEach(function() {
    configParser = require('../../dist/config-parser.js');
    this.sinon.stub(console, 'error');
    this.sinon.stub(process, 'exit');
  });

  afterEach(function() {
    configParser = undefined;
    console.error.restore(); // eslint-disable-line no-console
    process.exit.restore();
  });

  describe('early exits with a non 0 exit code when', function() {
    it('the specified config file doesn\'t exit', function() {
      var configFilePath = './non/existing/path';
      configParser.getConfiguration(configFilePath);

      var consoleErrorArgs = console.error.args.map(function (args) { // eslint-disable-line no-console
        return args[0];
      });
      expect(consoleErrorArgs[0]).to.include('Could not find specified config file "' + configFilePath + '"');
      expect(process.exit.args[0][0]).to.equal(1);
    });

    it('no config file has been specified and default config file doesn\'t exist', function() {
      var configFilePath = './non/existing/path';
      configParser.defaultConfigFileName = configFilePath;
      configParser.getConfiguration();

      var consoleErrorArgs = console.error.args.map(function (args) { // eslint-disable-line no-console
        return args[0];
      });

      expect(consoleErrorArgs[0]).to.include('Could not find default config file');
      expect(process.exit.args[0][0]).to.equal(1);
    });

    it('a bad configuration file is used', function() {
      var configFilePath = 'test/config-parser/bad_config.gherkinrc';
      configParser.getConfiguration(configFilePath);

      var consoleErrorArgs = console.error.args.map(function (args) { // eslint-disable-line no-console
        return args[0];
      });

      expect(consoleErrorArgs[0]).to.include('Error(s) in configuration file:');
      expect(process.exit.args[0][0]).to.equal(1);
    });
  });

  describe('doesn\'t exit with exit code 1 when', function() {
    it('a good configuration file is used', function() {
      var configFilePath = 'test/config-parser/good_config.gherkinrc';
      var parsedConfig = configParser.getConfiguration(configFilePath);
      expect(process.exit.neverCalledWith(1));
      expect(parsedConfig).to.deep.eq({'no-files-without-scenarios': 'off'});
    });

    it('a good configuration file is used that includes comments', function() {
      var configFilePath = 'test/config-parser/good_config_with_comments.gherkinrc';
      var parsedConfig = configParser.getConfiguration(configFilePath);
      expect(process.exit.neverCalledWith(1));
      expect(parsedConfig).to.deep.eq({'no-files-without-scenarios': 'off'});
    });

    it('the default configuration file is found', function() {
      var defaultConfigFilePath = 'test/config-parser/stub_default.gherkinrc';
      configParser.defaultConfigFileName = defaultConfigFilePath;
      configParser.getConfiguration();
      expect(process.exit.neverCalledWith(1));
    });
  });

  describe('handles additionalRulesDirs configuration correctly by', function() {
    it('resolving paths relative to the configuration file', function() {
      var path = require('path');

      var configFileDir = 'test/config-parser/';
      var configFilePath = path.resolve(configFileDir, 'good_config_with_rulesdirs.gherkinrc');
      var parsedConfig = configParser.getConfiguration(configFilePath);

      var expectedPaths = [
        path.resolve(configFileDir, 'rulesdir'),
        path.resolve(configFileDir, 'rules'),
        path.resolve(configFileDir, 'gherkin/rules'),
      ];

      expect(process.exit.neverCalledWith(1));
      expect(parsedConfig).to.deep.eq({'additionalRulesDirs': expectedPaths});
    });

    it('using specified additionalRulesDirs instead of configuration', function() {
      var path = require('path');

      var configFileDir = 'test/config-parser/';
      var configFilePath = path.resolve(configFileDir, 'good_config_with_rulesdirs.gherkinrc');
      var parsedConfig = configParser.getConfiguration(configFilePath, []);

      var expectedPaths = [];

      expect(process.exit.neverCalledWith(1));
      expect(parsedConfig).to.deep.eq({'additionalRulesDirs': expectedPaths});
    });

    it('not modifying supplied additionalRulesDirs', function() {
      var path = require('path');

      var configFileDir = 'test/config-parser/';
      var configFilePath = path.resolve(configFileDir, 'good_config_with_rulesdirs.gherkinrc');
      var parsedConfig = configParser.getConfiguration(configFilePath, ['example/rules/dir']);

      var expectedPaths = ['example/rules/dir'];

      expect(process.exit.neverCalledWith(1));
      expect(parsedConfig).to.deep.eq({'additionalRulesDirs': expectedPaths});
    });
  });
});
