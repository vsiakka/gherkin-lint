const _ = require('lodash');
const Gherkin = require('gherkin').default;
const fs = require('fs');
const rules = require('./rules.js');
const logger = require('./logger.js');

function readAndParseFile(filePath) {
  let feature ='';
  let parsingErrors = [];
  let fileContent = [];

  return new Promise((resolve, reject) => {
    const options = {
      includeGherkinDocument: true,
      includePickles: false,
      includeSource: true,
    };

    const stream = Gherkin.fromPaths([filePath], options);
    
    stream.on('data', envelope => {
      if (envelope.attachment) {
        // An attachment implies that there was a parsing error
        parsingErrors.push(envelope.attachment);
      } else {
        if (envelope.gherkinDocument) {
          feature = envelope.gherkinDocument.feature;
        }
        if (envelope.source) {
          fileContent = envelope.source.data.split(/\r\n|\r|\n/);
        }
      }
    });

    stream.on('error', data => {
      logger.error(`Gherkin emmited an error while parsing ${filePath}: ${data}`);
      let error = {data: data};
      reject(processFatalErrors(error));
    });

    stream.on('end', () => { 
      if (parsingErrors.length) {
        // Process all errors/attachments at once, because a tag on a background will 
        // generate multiple error events, and it would be confusing to print a message for each
        // one of them, when they are all caused by a single cause
        reject(processFatalErrors(parsingErrors));
      } else {
        const file = {
          relativePath: filePath,
          lines: fileContent,
        };
        resolve({feature, file});
      }
    });
  });
}


function lint(files, configuration, additionalRulesDirs) {
  let results = [];

  // Ensure configuration exists.
  configuration = configuration || {};

  if (!additionalRulesDirs && configuration.additionalRulesDirs) {
    // Fallback to config.additionalRulesDirs if additionalRulesDirs was empty.
    additionalRulesDirs = configuration.additionalRulesDirs;
  }

  return Promise.all(files.map((f) => {
    let perFileErrors = [];

    return readAndParseFile(f)
      .then(
        // Handle Promise.resolve 
        ({feature, file}) => {
          perFileErrors = rules.runAllEnabledRules(feature, file, configuration, additionalRulesDirs);
        },
        // Handle Promise.reject 
        (parsingErrors) => {
          perFileErrors = parsingErrors;
        })
      .finally(()=> {
        let fileBlob = {
          filePath: fs.realpathSync(f), 
          errors: _.sortBy(perFileErrors, 'line')
        };

        results.push(fileBlob);
      });
  })).then(() => results);
}

function processFatalErrors(errors) {
  let errorMsgs = [];
  if (errors.length > 1) {
    const result = getFormatedTaggedBackgroundError(errors);
    errors = result.errors;
    errorMsgs = result.errorMsgs;
  }
  errors.forEach(error => {
    errorMsgs.push(getFormattedFatalError(error));
  });
  return errorMsgs;
}

function getFormatedTaggedBackgroundError(errors) {
  const errorMsgs = [];
  let index = 0;
  if (errors[0].data.includes('got \'Background') &&
      errors[1].data.includes('expected: #TagLine, #ScenarioLine, #Comment, #Empty')) {

    errorMsgs.push({
      message: 'Tags on Backgrounds are dissallowed',
      rule: 'no-tags-on-backgrounds',
      line: errors[0].data.match(/\((\d+):.*/)[1]
    });

    index = 2;
    for (let i = 2; i < errors.length; i++) {
      if (errors[i].data.includes('expected: #TagLine, #ScenarioLine, #Comment, #Empty')) {
        index = i + 1;
      } else {
        break;
      }
    }
  }
  return {errors: errors.slice(index), errorMsgs: errorMsgs};
}


/*eslint no-console: "off"*/
function getFormattedFatalError(error) {
  const errorLine = error.data.match(/\((\d+):.*/)[1];
  let errorMsg;
  let rule;
  if (error.data.includes('got \'Background')) {
    errorMsg = 'Multiple "Background" definitions in the same file are disallowed';
    rule = 'up-to-one-background-per-file';
  } else if(error.data.includes('got \'Feature')) {
    errorMsg = 'Multiple "Feature" definitions in the same file are disallowed';
    rule = 'one-feature-per-file';
  } else if (
    error.data.includes('expected: #EOF, #TableRow, #DocStringSeparator, #StepLine, #TagLine, #ScenarioLine, #RuleLine, #Comment, #Empty, got') ||
    error.data.includes('expected: #EOF, #TableRow, #DocStringSeparator, #StepLine, #TagLine, #ExamplesLine, #ScenarioLine, #RuleLine, #Comment, #Empty, got')
  ) {
    errorMsg = 'Steps should begin with "Given", "When", "Then", "And" or "But". Multiline steps are dissallowed';
    rule = 'no-multiline-steps';

  } else {
    errorMsg = error.data;
    rule = 'unexpected-error';
  }
  return {message: errorMsg,
    rule   : rule,
    line   : errorLine};
}

module.exports = {
  lint: lint,
  readAndParseFile: readAndParseFile
};
