Feature: App session routes (/app/*)
  As an app user client
  I want /app scoped routes to enforce session tokens
  So that app-user isolation matches the OpenAPI security model

  Scenario: App profile without bearer is unauthorized
    When I send a GET request to "/app/me" without authentication
    Then the response status should be 401

  Scenario: App collections without bearer is unauthorized
    When I send a GET request to "/app/collections" without authentication
    Then the response status should be 401
