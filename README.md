# Gherkin lint
[![Travis](https://travis-ci.com/vsiakka/gherkin-lint.svg?branch=master)](https://travis-ci.com/github/vsiakka/gherkin-lint/branches)
[![Coverage Status](https://coveralls.io/repos/github/vsiakka/gherkin-lint/badge.svg?branch=master)](https://coveralls.io/github/vsiakka/gherkin-lint?branch=master)
[![David](https://img.shields.io/david/vsiakka/gherkin-lint.svg?maxAge=2592000)](https://david-dm.org/vsiakka/gherkin-lint)
[![David](https://img.shields.io/david/dev/vsiakka/gherkin-lint.svg?maxAge=2592000)](https://david-dm.org/vsiakka/gherkin-lint#info=devDependencies&view=table)
[![npm](https://img.shields.io/npm/v/gherkin-lint.svg?maxAge=2592000)](https://www.npmjs.com/package/gherkin-lint)

Uses [Gherkin](https://github.com/cucumber/gherkin-javascript) to parse feature files and runs linting against the default rules, and the optional rules you specified in your `.gherkin-lintrc` file.

## Installation
```
npm install gherkin-lint
```

## Demo
To see the output for all the errors that the linter can detect run:
```
git clone https://github.com/vsiakka/gherkin-lint.git
npm run demo
```
Or check this:
![console](https://i.imgur.com/Qfp1FQR.png)


## Available rules


| Name                                        | Functionality                                                                            |
|---------------------------------------------|------------------------------------------------------------------------------------------|
| `no-tags-on-backgrounds` *                  | Disallows tags on Background                                                             |
| `one-feature-per-file` *                    | Disallows multiple Feature definitions in the same file                                  |
| `up-to-one-background-per-file` *           | Disallows multiple Background definition in the same file                                |
| `no-multiline-steps` *                      | Disallows mutiline Steps                                                                 || &nbsp;                                      |                                                                                          |
| [`allowed-tags`](#allowed-tags)             | Just the listed tags are allowed                                                         |
| [`file-name`](#file-name)                   | Restrict feature file names to a commmon style                                           |
| [`indentation`](#indentation)               | Allows the user to specify indentation rules                                             |
| [`max-scenarios-per-file`](#max-scenarios-per-file)| Allows the user to specify the max number of scenarios per feature file           |
| [`name-length`](#name-length)               | Allows restricting length of Feature/Scenario/Step names                                 |
| [`new-line-at-eof`](#new-line-at-eof)       | Disallows/enforces new line at EOF                                                       |
| `no-background-only-scenario`               | Disallows background when there is just one scenario                                     |
| `no-dupe-feature-names`                     | Disallows duplicate Feature names                                                        |
| [`no-dupe-scenario-names`](#no-dupe-scenario-names)| Disallows duplicate Scenario names                                                |
| `no-duplicate-tags`                         | Disallows duplicate tags on the same Feature or Scenario                                 |
| `no-empty-background`                       | Disallows features with backgrounds without steps                                        |
| `no-empty-file`                             | Disallows empty feature files                                                            |
| `no-examples-in-scenarios`                  | Disallow the use of "Examples" in Scenarios, only allowed in Scenario Outlines           |
| `no-files-without-scenarios`                | Disallows files with no scenarios                                                        |
| `no-homogenous-tags`                        | Disallows tags present on every Scenario in a Feature, rather than on the Feature itself |
| `no-multiple-empty-lines`                   | Disallows multiple empty lines                                                           |
| `no-partially-commented-tag-lines`          | Disallows partially commented tag lines                                                  |
| [`no-restricted-patterns`](#no-restricted-patterns)        | A list of patterns to disallow globally, or specifically in features, backgrounds, scenarios, or scenario outlines                                 |
| [`no-restricted-tags`](#no-restricted-tags) | Disallow use of particular @tags                                                         |
| `no-scenario-outlines-without-examples`     | Disallows scenario outlines without examples                                             |
| `no-superfluous-tags`                       | Disallows tags present on a Feature and a Scenario in that Feature                       |
| `no-trailing-spaces`                        | Disallows trailing spaces                                                                |
| `no-unnamed-features`                       | Disallows empty Feature name                                                             |
| `no-unnamed-scenarios`                      | Disallows empty Scenario name                                                            |
| `no-unused-variables`                       | Disallows unused variables in scenario outlines                                          |
| `one-space-between-tags`                    | Tags on the same line must be separated by a single space                                |
| [`required-tags`](#required-tags)           | Require tags/patterns of tags on Scenarios                                               |
| [`scenario-size`](#scenario-size)           | Allows restricting the maximum number of steps in a scenario, scenario outline and background |
| `use-and`                                   | Disallows repeated step names requiring use of And instead                               |
| `keywords-in-logical-order`                 | Requires that Given, When and Then appear in logical sequence                            |
| `only-one-when`                             | Requires that there is at most one When step for each scenario                           |

\* These rules cannot be turned off because they detect undocumented cucumber functionality that causes the [gherkin](https://github.com/cucumber/gherkin-javascript) parser to crash.

## Rule Configuration
The not-configurable rules are turned on by default and cannot be turned off. Configurable rules can be customized using a [file](#configuration-file).

The configurable rules are off by default. To turn them on, you will need to create a json file, where you specify the name of each rule and its desired state (which can be "on" or "off"). Eg:
```
{
  "no-unnamed-features": "on"
}
```
will turn on the `no-unnamed-features` rule.

### allowed-tags

`allowed-tags` should be configured with the list of allowed tags and patterns:

```
{
  "allowed-tags": ["on", {"tags": ["@watch", "@wip"], "patterns": ["^@todo$"]}]
}
```

Any tag not included in this list won't be allowed.

### file-name

`file-name` is configured with a style to enforce. The default is `PascalCase`:

```json
{
  "file-name": ["on", {"style": "PascalCase"}]
}
```

The list of supported styles is:

- `PascalCase` - first letter of each word capitalized (no spaces) e.g. "MyFancyFeature.feature"
- `Title Case` - first letter of each word capitalized (with spaces) e.g. "My Fancy Feature.feature"
- `camelCase` - first letter of each word capitalized, except first e.g. "myFancyFeature.feature"
- `kebab-case` - all lowercase, hyphen-delimited e.g. "my-fancy-feature.feature"
- `snake_case` - all lowercase, underscore-delimited e.g. "my_fancy_feature.feature"

### no-restricted-patterns

`no-restricted-patterns` is a list of exact or partial patterns whose matches are dissallowed in feature name and description, and in background, scenario and scenario outline name, description and steps.
All patterns are treated as case insensitive.
The rule can be configured like this:
```
{
  "no-restricted-patterns": ["on", {
    "Global": [
      "^globally restricted pattern"
    ],
    "Feature": [
      "poor description",
      "validate",
      "verify"
    ],
    "Background": [
      "show last response",
      "a debugging step"
    ],
    "Scenario": [
      "show last response",
      "a debugging step"
    ]
  }]
}
```

Notes:
- Step keywords `Given`, `When`, `Then` and `And` should not be included in the patterns.
- Description violations always get reported in the Feature/Scenario/etc definition line. This is due to the parsed gherkin tree not having information about which line the description appears.

### indentation

`indentation` can be configured in a more granular level and uses following rules by default:
- Expected indentation for Feature, Background, Scenario, Examples heading: 0 spaces
- Expected indentation for Steps and each example: 2 spaces

You can override the defaults for `indentation` like this:
```
{
  "indentation" : [
    "on", {
      "Feature": 0,
      "Background": 0,
      "Scenario": 0,
      "Step": 2,
      "Examples": 0,
      "example": 2,
      "given": 2,
      "when": 2,
      "then": 2,
      "and": 2,
      "but": 2,
      "feature tag": 0,
      "scenario tag": 0
    }
  ]
}
```
There is no need to override all the defaults, as is done above, instead they can be overriden only where required.  `Step` will be used as a fallback if the keyword of the step, eg. 'given', is not specified.  If `feature tag` is not set then `Feature` is used as a fallback, and if `scenario tag` is not set then `Scenario` is used as a fallback.

This feature is able to handle all localizations of the gherkin steps.


### max-scenarios-per-file
The `max-scenarios-per-file` supports some configuration options:

- `maxScenarios` (number) the maximum scenarios per file after which the rule fails - defaults to `10`
- `countOutlineExamples` (boolean) whether to count every example row for a Scenario Outline, as opposed to just 1 for the whole block - defaults to `true`

The configuration looks like this (showing the defaults):
```
{
  "max-scenarios-per-file": ["on", {"maxScenarios": 10, "countOutlineExamples": true}]
}
```


### name-length

`name-length` can be configured separately for Feature, Scenario and Step names.
The default is 70 characters for each of these:

```
{
  "name-length" : ["on", { "Feature": 70, "Scenario": 70, "Step": 70 }]
}
```


### new-line-at-eof

`new-line-at-eof` can be configured to enforce or disallow new lines at EOF.
- To enforce new lines at EOF:
```
{
  "new-line-at-eof": ["on", "yes"]
}
```
- To disallow new lines at EOF:
```
{
  "new-line-at-eof": ["on", "no"]
}
```


### no-dupe-scenario-names

`no-dupe-scenario-names` can be configured to search for duplicates in each individual feature or amongst all feature files.
To enable searching for duplicates in each individual feature (same scenario name in different features won't raise an error) you need to configure the rule like this:

```
{
  "no-dupe-scenario-names": ["on", "in-feature"]
}
```

The default case is testing against all the features (same scenario name in different features will raise an error). To get that behavor use the following configuration:

```
{
  "no-dupe-scenario-names": "on"
}
```

or

```
{
  "no-dupe-scenario-names": ["on", "anywhere"]
}
```


### no-restricted-tags
`no-restricted-tags` should be configured with the list of restricted tags and patterns:
```
{
  "no-restricted-tags": ["on", {"tags": ["@watch", "@wip"], "patterns": ["^@todo$"]}]
}
```


### required-tags

`required-tags` supports some configuration options:

- `tags` (array) the array of tag patterns that must match at least one tag - defaults to `[]`
- `ignoreUntagged` (boolean) whether to ignore scenarios that have no tag - defaults to `true`

```
{
  "required-tags": ["on", {"tags": ["^@issue:[1-9]\\d*$"], "ignoreUntagged": false}]
}
```


### scenario-size

`scenario-size` lets you specify a maximum step length for scenarios and backgrounds. The `Scenario` configuration applies to both scenarios and scenario outlines:
```
{
  "scenario-size": ["on", { "steps-length": { "Background": 15, "Scenario": 15 }}]
}
```

## Configuration File
The default name for the configuration file is `.gherkin-lintrc` and it's expected to be in your working directory.

The file contents must be valid JSON, though it does allow comments.

If you are using a file with a different name or a file in a different folder, you will need to specify the `-c` or `--config` option and pass in the relative path to your configuration file. Eg: `gherkin-lint -c path/to/configuration/file.extention`

You can find an example configuration file, that turns on all of the rules in the root of this repo (.gherkin-lintrc).

## Ignoring Feature Files
There are 2 ways you can specify files that the linter should ignore:
1. Add a `.gherkin-lintignore` file in your working directory and specify one glob pattern per file line
1. Use the command line option`-i` or `--ignore`,  pass in a comma separated list of glob patterns. If specified, the command line option will override the `.gherkin-lintignore` file.


## Custom rules
You can specify one more more custom rules directories by using the `-r` or `--rulesdir` command line option. Rules in the given directories will be available additionally to the default rules.

Example:
```
gherkin-lint --rulesdir "/path/to/my/rulesdir" --rulesdir "from/cwd/rulesdir"
```

Paths can either be absolute or relative to the current working directory.
Have a look at the `src/rules/` directory for examples; The `no-empty-file` rule is a good example to start with.
