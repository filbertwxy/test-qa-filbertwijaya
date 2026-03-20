Feature: Custom Endpoints API
  As an authenticated integrator
  I want configurable /api/custom/{path} routes
  So that dynamic backend paths can be probed safely

  Scenario Outline: Authenticated custom path requests return a documented outcome
    When I send an authenticated GET request to custom path "<path>"
    Then the response status should be <status>

    Examples:
      | path            | status |
      | nonexistent-xyz | 404    |
