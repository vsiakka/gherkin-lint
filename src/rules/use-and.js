const gherkinUtils = require('./utils/gherkin.js');

const rule = 'use-and';

function run(feature) {
  if (!feature) {
    return [];
  }

  let errors = [];
  
  feature.children.forEach(child => {
    const node = child.rule || child.background || child.scenario;
    let previousKeyword = undefined;
    if (node.steps) {
      node.steps.forEach(step => {
        const keyword = gherkinUtils.getLanguageInsitiveKeyword(step, feature.language);

        if (keyword === 'and') {
          return;
        }
        if (keyword === previousKeyword) {
          errors.push(createError(step));
        }

        previousKeyword = keyword;
      });
    }
  });
  return errors;
}

function createError(step) {
  return {
    message: 'Step "' + step.keyword + step.text + '" should use And instead of ' + step.keyword,
    rule   : rule,
    line   : step.location.line
  };
}

module.exports = {
  name: rule,
  run: run
};
