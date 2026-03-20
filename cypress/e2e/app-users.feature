Feature: App Users API
  As an API consumer
  I want app-user management and session helpers to match the OpenAPI spec
  So that magic-link and owner flows can be validated

  Scenario: GET login endpoint returns method not allowed hint
    When I send a GET request to "/api/app-users/login" expecting method not allowed
    Then the response status should be 405

  Scenario: Verify token rejects invalid token
    When I send a POST request to "/api/app-users/verify" with JSON body:
      """
      {"token":"invalid-token-for-cypress"}
      """
    Then the response status should be 400
