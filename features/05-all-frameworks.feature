Feature: All frameworks page
  Scenario: Content on the frameworks page
    Given user is on page /framework
    Then the service displays the following page content
      | Heading | All frameworks |
    And have links
      | Books and related materials         | /framework#books        |
      | Facilities management and estates   | /framework#fm           |
      | ICT                                 | /framework#ict          |
      | Legal                               | /framework#legal        |
      | Professional                        | /framework#professional |
      | Energy and utilities                | /framework#energy       |
      | Financial                           | /framework#financial    |
      | Recruitment and HR                  | /framework#hr           |
      | Find a framework                    | /benefits               |

  Scenario: Framework page linked from list page
    Given user is on page /framework/books
    Then the service displays the following page content
      | Heading | Books and related materials |
    And have links
      | Visit the ESPO website                          | https://www.espo.org/Pages/Books-for-schools-framework-376E-guide |
      | Buy books and related materials for your school | /guidance/books                                                   |
      | How to use the ESPO framework                   | /how-to-use-espo-framework                                        |
    