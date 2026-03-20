Feature: Legacy Unknown Resources API
  As an API consumer
  I want the legacy /api/unknown endpoints to return the documented resource shapes
  So that color catalog demos work consistently

  Scenario: List unknown resources with pagination
    When I send a GET request to "/api/unknown"
    Then the response status should be 200
    And the legacy unknown list response shape should be valid

  Scenario: List unknown resources with page query
    When I send a GET request to "/api/unknown?page=1&per_page=2"
    Then the response status should be 200
    And the legacy unknown list response shape should be valid

  Scenario: Get single unknown resource by id
    When I send a GET request to "/api/unknown/2"
    Then the response status should be 200
    And the legacy unknown single resource shape should be valid
