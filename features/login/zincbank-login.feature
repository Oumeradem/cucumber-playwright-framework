Feature: ZincBank User Login
  As a ZincBank customer
  I want to sign in with my credentials
  So that I can access my dashboard

  Background:
    Given I open the ZincBank application
    And I am on the ZincBank login page

  @smoke @critical
  Scenario: Successful sign-in with valid credentials
    When I sign in with my ZincBank credentials
    Then I am signed in and land on the ZincBank dashboard

  @regression
  Scenario: Sign-in with invalid credentials shows an error
    When I sign in with email "wronguser@cydeo.io" and password "WrongPassword123"
    Then a login error "Invalid email or password." is displayed
    And I remain on the login page

  @regression
  Scenario Outline: Submitting the form with missing fields shows a validation message
    When I sign in with email "<email>" and password "<password>"
    Then a validation message "Enter your email and password." is displayed
    And I remain on the login page

    Examples:
      | email            | password |
      |                  |          |
      | user@example.com |          |
      |                  | secret   |
