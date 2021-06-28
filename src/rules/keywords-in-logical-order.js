const gherkinUtils = require('./utils/gherkin.js');

const rule = 'keywords-in-logical-order';

function run(feature) {
  if (!feature) {
    return [];
  }

  let errors = [];

  let simpleStepContainers = feature.children
    .filter(child => child.background || child.scenario);

  let ruleStepContainers = feature.children
    .filter(child => child.rule)
    .map(child => child.rule.children)
    // .flat(); NOTE: flat not available until nodejs 11, which this project does not require
    // using reduce() equivalent instead
    // When revisiting wth nodejs 11, consider using flatmap()
    .reduce((flattened, element) => flattened.concat(element), []);

  let allStepContainers = simpleStepContainers.concat(ruleStepContainers);

  allStepContainers.forEach(child => {
    const node = child.background || child.scenario;

    const keywordList = ['given', 'when', 'then'];

    let maxKeywordPosition = undefined;

    node.steps.forEach((step) => {
      const keyword = gherkinUtils.getLanguageInsitiveKeyword(step, feature.language);
      let keywordPosition = keywordList.indexOf(keyword);

      if (keywordPosition === -1) {
        //   not found
        return;
      }

      if (keywordPosition < maxKeywordPosition) {
        let maxKeyword = keywordList[maxKeywordPosition];
        errors.push(createError(step, maxKeyword));
      }

      maxKeywordPosition =
        Math.max(maxKeywordPosition, keywordPosition) || keywordPosition;
    });
  });

  return errors;
}

function createError(step, maxKeyword) {
  return {
    message: `Step "${step.keyword}${step.text}" should not appear after step using keyword ${maxKeyword}`,
    rule: rule,
    line: step.location.line,
  };
}

module.exports = {
  name: rule,
  run: run,
};
