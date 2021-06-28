Feature: Feature with no only-one-then violations, with file that uses gherkin rules

Rule: This is a rule

Background:
  Given step6
  When step7
  Then step8
  And step9
  And step10
  And step11
  And step12

Scenario: This is a Scenario
  Given step15
  And step16
  And step17
  When step18
  Then step19
  And step20
  And step21
  And step22
  And step23

Scenario Outline: This is a Scenario Outline
  Given step26
  And step27
  And step28
  When step29
  Then step30
  And step31
  And step32
  And step33
  And step34
Examples:
  | foo |
  | bar |
