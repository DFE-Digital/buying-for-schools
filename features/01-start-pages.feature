Feature: Start pages
  Scenario: Content on the start page
    Given user is on page /
    Then the service displays the following page content
      | Heading | Find a DfE approved framework for your school |
    And have links
      | Find a framework | /benefits |

  Scenario: Content on the benefits page
    Given user is on page /benefits
    Then the service displays the following page content
      | Heading | Benefits of using a framework |
    And have links
      | Continue | /selection |

  Scenario: Content on the selection page
    Given user is on page /selection
    Then the service displays the following page content
      | Heading | How frameworks are selected |
    And have links
      | Continue | /service-output |

  Scenario: Content on the service output page
    Given user is on page /service-output
    Then the service displays the following page content
      | Heading | After you’ve used the service |
    And have links
      | Continue | /frameworks |