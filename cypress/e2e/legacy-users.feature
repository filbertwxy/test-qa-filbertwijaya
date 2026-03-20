Feature: Legacy Users API
  As an API consumer
  I want the legacy /api/users endpoints to behave per the ReqRes OpenAPI spec
  So that user listing and CRUD demos remain stable

  Scenario: List users with default pagination
    When I send a GET request to "/api/users?page=1"
    Then the response status should be 200
    And the legacy user list response shape should be valid

  Scenario: List users with page and per_page query parameters
    When I send a GET request to "/api/users?page=1&per_page=3"
    Then the response status should be 200
    And the legacy user list response shape should be valid

  Scenario: Get a single user by id
    When I send a GET request to "/api/users/2"
    Then the response status should be 200
    And the legacy single user response shape should be valid

  Scenario: Create user returns created resource metadata
    When I send a POST request to "/api/users" with JSON body:
      """
      {"name":"morpheus","job":"leader"}
      """
    Then the response status should be 201
    And the response body should have property "name"
    And the response body should have property "job"

  Scenario: Update user with PUT
    When I send a PUT request to "/api/users/2" with JSON body:
      """
      {"name":"morpheus","job":"zion resident"}
      """
    Then the response status should be 200
    And the response body should have property "updatedAt"

  Scenario: Partially update user with PATCH
    When I send a PATCH request to "/api/users/2" with JSON body:
      """
      {"name":"morpheus","job":"zion resident"}
      """
    Then the response status should be 200
    And the response body should have property "updatedAt"

  Scenario: Delete user returns no content
    When I send a DELETE request to "/api/users/2"
    Then the response status should be 204
