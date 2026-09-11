@smoke
Feature: User Login
  As a customer of Swag Labs
  I want to sign in with my credentials
  So that I can access the inventory

  Background:
    Given I open the application
    And I am on the Login page

  @critical
  Scenario: Successful login with valid credentials
    When I login with username "standard_user" and password "secret_sauce"
    Then the inventory page is displayed

  @sanity
  Scenario Outline: Login with invalid credentials shows a validation error
    When I login with username "<username>" and password "<password>"
    Then a login error message "<error>" should be displayed

    Examples:
      | username         | password    | error                                                        |
      | locked_out_user  | secret_sauce | Sorry, this user has been locked out.                        |
      | standard_user    | wrongpass   | Username and password do not match any user in this service  |
      | error_user       | wrongpass   | Username and password do not match any user in this service  |
