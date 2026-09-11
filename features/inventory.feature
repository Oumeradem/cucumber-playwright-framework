@regression
Feature: Inventory
  As a logged-in customer
  I want to browse and manage products in my cart
  So that I can purchase the items I need

  Background:
    Given I open the application
    When I login with username "standard_user" and password "secret_sauce"
    Then the inventory page is displayed

  @sanity
  Scenario: Add and remove a product from the cart
    When I add the product "Sauce Labs Backpack" to the cart
    Then the cart badge shows 1 items
    When I remove the product "Sauce Labs Backpack" from the cart
    Then the cart badge shows 0 items

  Scenario: Products are sorted by name descending
    When I sort products by name Z to A
    Then the first product shown is "Test.allTheThings() T-Shirt (Red)"
