Feature: Templates API
  As an API consumer
  I want to list and fetch backend templates
  So that template metadata matches the public specification

  Scenario: List templates
    When I send a GET request to "/templates"
    Then the response status should be 200
    And the templates response should include templates array

  Scenario: List templates with query filters
    When I send a GET request to "/templates?limit=5&offset=0"
    Then the response status should be 200
    And the templates response should include templates array

  Scenario: Get template by id
    When I send a GET request to "/templates/1"
    Then the response status should be 200
    And the template response should include id name and description

  Scenario: Get template returns not found for unknown id
    When I send a GET request to "/templates/999999"
    Then the response status should be 404
    And the response body should indicate an error
