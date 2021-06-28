Feature: Test for the keywords-in-logical-order rule

  Scenario: A scenario for keywords-in-logical-order rule
    Then first then within scenario, which is fine
    When a succeeding when step, which is bad
    Given a succeeding given step, also bad

  Scenario: Another scenario for keywords-in-logical-order rule
    When a succeeding when step, which is okay
    Given a succeeding given step, also bad

  Rule: Scenarios in a rule should be checked, too
    Scenario: Bad scenario in a Rule for keywords-in-logical-order rule
      When a succeeding when step, which is okay
      Given a succeeding given step, also bad
