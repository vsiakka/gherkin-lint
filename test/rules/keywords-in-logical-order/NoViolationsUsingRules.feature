Feature: Feature with no keywords-in-logical-order violations, with file that uses gherkin rules

Rule: This is a rule

Background:
  Given step4
  And step5
  And step6
  When step7
  And step8
  And step9
  Then step10
  And step11
  And step12

Scenario: This is a Scenario
  Given step15
  And step16
  And step17
  When step18
  And step19
  And step20
  Then step21
  And step22
  And step23

Scenario Outline: This is a Scenario Outline
  Given step26
  And step27
  And step28
  When step29
  And step30
  And step31
  Then step32
  And step33
  And step34
Examples:
  | foo |
  | bar |
