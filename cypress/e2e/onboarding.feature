Feature: Onboarding API
  As an authenticated user
  I want onboarding status and completion endpoints
  So that guided setup flows can be validated

  Scenario: Onboarding status without bearer is unauthorized
    When I send a GET request to "/api/onboarding/status" without authentication
    Then the response status should be one of 401 or 403

  Scenario: Complete onboarding requires bearer token
    When I send a POST request to "/api/onboarding/complete" with JSON body:
      """
      {}
      """
    Then the response status should be one of 401 or 403

  Scenario: Skip onboarding requires bearer token
    When I send a POST request to "/api/onboarding/skip" with JSON body:
      """
      {}
      """
    Then the response status should be one of 401 or 403

  Scenario: Onboarding with login token follows API rules
    When I send a POST request to "/api/login" with JSON body:
      """
      {"email": "eve.holt@reqres.in", "password": "cityslicka"}
      """
    Then the response status should be 200
    When I store the login token from the last response
    When I send an authenticated GET request to "/api/onboarding/status" with Bearer token from last login
    Then the response status should be one of 200, 401, or 403
