function printResults(results) {
  const testCases = results.map(result => ({
    _attributes: {
      name : result.filePath
    },
    error: result.errors.map(error => ({
      _attributes: {
        message: error.message,
        type: 'gherkin-lint-error'
      },
      _cdata: `${result.filePath}:${error.line} (${error.rule}) ${error.message}`        
    }))    
  }));
  const testSuiteReport = {
    _declaration:{
      _attributes: {
        version: '1.0',
        encoding: 'utf-8'
      }
    },
    testsuite : {
      _attributes: {
        name: 'gherkin-lint',
      },
      testcase : testCases
    }
  };
  let convert = require('xml-js');
  const xunitXml = convert.js2xml(testSuiteReport, {compact: true, spaces: 4});
  /*eslint no-console: "off"*/
  console.error(xunitXml);
}

module.exports = {
  printResults: printResults
};
