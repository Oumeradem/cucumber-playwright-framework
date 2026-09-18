Feature: ZincBank Homepage Navigation
  As a ZincBank visitor
  I want to see the primary navigation tabs on the homepage
  So that I can quickly reach the Personal, Business, Cards, and Company sections

  Background:
    Given I open the ZincBank homepage

  @smoke @critical
  Scenario: Homepage shows the four primary navigation tabs
    Then the primary navigation shows the tabs "Personal", "Business", "Cards", and "Company"

  @smoke
  Scenario Outline: Each tab navigates to its target section
    When I click the "<tab>" tab
    Then the page scrolls to the "<target>" section

    Examples:
      | tab      | target        |
      | Personal | #features     |
      | Business | #features     |
      | Cards    | #feature-card |
      | Company  | #footer       |
