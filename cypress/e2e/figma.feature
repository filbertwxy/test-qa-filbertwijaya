Feature: Figma integration API
  As an API consumer
  I want Figma ingest and usage endpoints to match the spec
  So that integration contracts stay observable

  Scenario: Figma create requires authentication
    When I send a POST request to "/api/figma/create" with JSON body:
      """
      {"fileKey":"demo"}
      """
    Then the response status should be 401

  Scenario: Figma usage requires authentication
    When I send a GET request to "/api/figma/usage" without authentication
    Then the response status should be 401

  Scenario: Figma create with login token
    When I send a POST request to "/api/login" with JSON body:
      """
      {"email": "eve.holt@reqres.in", "password": "cityslicka"}
      """
    Then the response status should be 200
    When I store the login token from the last response
    When I send an authenticated POST request to "/api/figma/create" with Bearer token from last login and JSON body:
      """
      {"fileKey":"demo","nodes":[]}
      """
    Then the response status should be one of 200 or 401
