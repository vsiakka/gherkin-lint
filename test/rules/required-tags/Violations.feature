@featuretag
Feature: Feature with some of the required tags missing

Background:
  Given I have a Background

@requiredscenariotag @required-scenario-tag-ABCD-1234
Scenario: This is a Scenario with some of the required tags missing
  Then I should see an error

@requiredscenariotag @required-scenario-tag-ABCD-1234
@unrequired-tag-on-a-new-line
Scenario Outline: This is a Scenario Outline with some of the required tags missing
  Then I should see an error

Examples:
  | foo |
  | bar |

Scenario: This is a Scenario that has no tag
  Then I should see an error

Scenario Outline: This is a Scenario Outline that has no tag
  Then I should see an error
