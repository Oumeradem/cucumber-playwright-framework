Feature: ZincBank Primary Navigation
  As a signed-in ZincBank customer
  I want the primary navigation header to show the main sections of the app
  So that I can see where I can navigate

  Background:
    Given I open the ZincBank application
    When I sign in with my ZincBank credentials
    Then I am signed in and land on the ZincBank dashboard

  @smoke @critical
  Scenario: Primary navigation shows all required items after sign-in
    Then the header navigation shows all required items

  @regression
  Scenario Outline: Each required navigation item is visible
    Then the header navigation shows the item "<item>"

    Examples:
      | item       |
      | ZincBank   |
      | Dashboard  |
      | Accounts   |
      | Move money |
      | Transactions |
      | Cards      |
      | Profile    |
      | Sign out   |
