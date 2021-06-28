Feature: Feature with keywords-in-logical-order violations, with file that uses gherkin rules

Rule: This is a rule

Background: All violations
  Then step1
  When step2
  Given step3

Scenario: Given after When
  When step11
  Given step12

Scenario: Given after Then
  Then step21
  Given step22

Scenario: When after Then
  Then step31
  When step32

Scenario: When after Then with Ands
  Then step51
  And step52
  And step53
  When step54

Scenario Outline: All violations
  Then step41
  When step42
  Given step43
Examples:
  | foo |
  | bar |
