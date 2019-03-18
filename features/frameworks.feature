Feature: App is running
  Scenario: Content on the buying/services page
    Given user is on page /frameworks/type
    Then the service displays the following page content
      | Heading | What are you buying?  |
#      | submit  | Continue |
#    And have radio buttons
#      | Goods    | /frameworks/type/buying   |
#      | Services | /frameworks/type/on-going |
#
#  Scenario: Content on the buying what page
#    Given user is on page /frameworks/type/buying/what
#    Then the service displays the following page content
#      | Heading | What goods do you need? |
#    And have radio buttons
#      | Books and related materials | /frameworks/type/buying/what/books-media |
#      | Furniture                   | /frameworks/type/buying/what/furniture   |
#      | ICT                         | /frameworks/type/buying/what/ict         |
#
#  Scenario: Content on the books and related materials page
#    Given user is on page /frameworks/type/buying/what/books-media/class-library
#    Then the service displays the following page content
#      | Heading | What goods are you looking for in books and related materials? |
#    And have radio buttons
#      | Classroom supplies | /frameworks/type/buying/what/books-media/class-library/classroom |
#      | Library supplies   | /frameworks/type/buying/what/books-media/class-library/library   |
#
#  Scenario: Content on the classroom/books page
#    Given user is on page /frameworks/type/buying/what/books-media/class-library/classroom/books
#    Then the service displays the following page content
#      | Heading        | Books and related materials                                                                                 |
#      | Recommendation | Based on your answers, we think you should use the Eastern Shires Purchasing Organisation (ESPO) framework. |
#    And have links
#      | Visit the ESPO website                                                  | https://www.espo.org/Pages/Books-for-schools-framework-376E-guide |
#      | Start again                                                             | /frameworks                                                       |
#      | Buying for schools guidance                                             | https://www.gov.uk/guidance/buying-for-schools                    |
#      | Buying for schools: templates and forms                                 | https://www.gov.uk/government/collections/buying-for-schools      |
#      | Change What are you buying?                                             | /frameworks/type                                                  |
#      | Change What goods do you need?                                          | /frameworks/type/buying/what                                      |
#      | Change What goods are you looking for in books and related materials?   | /frameworks/type/buying/what/books-media/class-library            |