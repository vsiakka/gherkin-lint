@featuretag
Feature: Feature with all of the required tags present

Background:
  Given I have a Background

@requiredscenariotag @required-scenario-tag @required-scenario-tag-1234
Scenario: This is a Scenario with all of the required tags present
  Then I should not see an error

@requiredscenariotag @required-scenario-tag @required-scenario-tag-5678
Scenario Outline: This is a Scenario Outline with all of the required tags present
  Then I should not see an error

Examples:
  | foo |
  | bar |


Scenario: This is a Scenario with all of the required tags present
  Then I should not see an error

Scenario Outline: This is a Scenario Outline with all of the required tags present
  Then I should not see an error

Examples:
  | foo |
  | bar |