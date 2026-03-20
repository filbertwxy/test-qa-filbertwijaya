Feature: List users
  As an API consumer
  I want GET /api/users to return a paginated user list
  So the public users endpoint matches the ReqRes spec

  Scenario: Get users collection
    When I send a GET request to "/api/users"
    Then the response status should be 200
    And the users list response should be valid
