Feature: All frameworks page
  Scenario: Content on the frameworks page
    Given user is on page /framework
    Then the service displays the following page content
      | Heading | All frameworks |
    And have links
      | Books and related materials         | /framework#category-books        |
      | Facilities management and estates   | /framework#category-fm           |
      | ICT                                 | /framework#category-ict          |
      | Legal                               | /framework#category-legal        |
      | Professional                        | /framework#category-professional |
      | Energy and utilities                | /framework#category-energy       |
      | Financial                           | /framework#category-financial    |
      | Recruitment and HR                  | /framework#category-hr           |
      | Find a framework                    | /                                |

  Scenario: Framework page linked from list page
    Given user is on page /framework/books
    Then the service displays the following page content
      | Heading | Books and related materials |
    And have links
      | Visit the ESPO website                          | https://www.espo.org/Pages/Books-for-schools-framework-376E-guide |
      | Buy books and related materials for your school | https://www.gov.uk/guidance/buying-for-schools/books-and-educational-resources |
      | How to use the ESPO framework                   | /how-to-use-espo-framework                                        |
    