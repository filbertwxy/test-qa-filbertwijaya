Feature: Authentication API
  As an API consumer
  I want register, login, logout, and redirect flows to match the spec
  So that auth demos and tokens behave predictably

  Scenario: Register with valid credentials returns a token
    When I send a POST request to "/api/register" with JSON body:
      """
      {"email": "eve.holt@reqres.in", "password": "pistol"}
      """
    Then the response status should be 200
    And the response body should have property "token"
    And the response body property "token" should be a non-empty string

  Scenario: Register fails when password is missing
    When I send a POST request to "/api/register" with JSON body:
      """
      {"email":"sydney@fife"}
      """
    Then the response status should be 400
    And the response body should indicate an error

  Scenario: Login with valid credentials returns a token
    When I send a POST request to "/api/login" with JSON body:
      """
      {"email": "eve.holt@reqres.in", "password": "cityslicka"}
      """
    Then the response status should be 200
    And the response body should have property "token"

  Scenario: Login fails with missing password
    When I send a POST request to "/api/login" with JSON body:
      """
      {"email":"peter@klaven"}
      """
    Then the response status should be 400
    And the response body should indicate an error

  Scenario: Logout returns success payload
    When I send a POST request to "/api/logout" with empty body
    Then the response status should be 200
    And the response body should be an object

  Scenario: Redirect helper returns 302 when url query is provided
    When I send a POST request to "/api/redirect" without following redirects with query "url=https%3A%2F%2Freqres.in%2F"
    Then the response status should be one of 302 or 403
    And if the response was a redirect the location header should be present
