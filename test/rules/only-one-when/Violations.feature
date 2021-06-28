Feature: Feature with only-one-when violations violations
  Using whitespace so that line numbers of errors are the same
  in this file and ViolationsUsingRules.feature

  Scenario: When, When
    When step6
    When step7

  Scenario: When, And
    When step10
    And step11

  Scenario: Given, When, And, Then
    Given step14
    When step15
    And step16
    Then step17

  Scenario Outline: Outline Given, When, And, Then
    Given step20
    When step21
    And step22
    Then step23
    Examples:
      | foo |
      | bar |

  Scenario: Given, When, When, And, Then
    Given step29
    When step30
    When step31
    And step32
    Then step33

  Scenario: Given, When, Then, When, And
    Given step36
    When step37
    Then step38
    When step39
    And step40
