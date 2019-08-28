Feature: Facilities management

  Scenario: Content on the services-categories page
    Given user is on page /frameworks/type/on-going/services-categories
    Then the service displays the following page content
      | Heading | What services do you need?  |
      | submit  | Continue                    |
    And have radio buttons
      | Energy and utilities              | /frameworks/type/on-going/services-categories/energy        |
      | Facilities management and estates | /frameworks/type/on-going/services-categories/facilities    |
      | Financial                         | /frameworks/type/on-going/services-categories/financial     |
      | ICT                               | /frameworks/type/on-going/services-categories/ict           |
      | Legal                             | /frameworks/type/on-going/services-categories/legal         |
      | Professional                      | /frameworks/type/on-going/services-categories/professional  |
      | Recruitment and HR                | /frameworks/type/on-going/services-categories/recruitment   |

  Scenario: Content on the fm-categories page
    Given user is on page /frameworks/type/on-going/services-categories/facilities/fm-categories
    Then the service displays the following page content
      | Heading | What services are you looking for in facilities management and estates?  |
      | submit  | Continue |
    And have radio buttons
      | Catering                          | /frameworks/type/on-going/services-categories/facilities/fm-categories/catering           |
      | Cleaning                          | /frameworks/type/on-going/services-categories/facilities/fm-categories/support            |
      | Construction consultancy          | /frameworks/type/on-going/services-categories/facilities/fm-categories/construction       |
      | Grounds maintenance               | /frameworks/type/on-going/services-categories/facilities/fm-categories/grounds            |
      | Maintenance                       | /frameworks/type/on-going/services-categories/facilities/fm-categories/maintenance        |
      | Removal and relocation            | /frameworks/type/on-going/services-categories/facilities/fm-categories/removal-relocation |
      | Security                          | /frameworks/type/on-going/services-categories/facilities/fm-categories/security           |
      | Total facilities management   | /frameworks/type/on-going/services-categories/facilities/fm-categories/wfm                    |
      | Waste                             | /frameworks/type/on-going/services-categories/facilities/fm-categories/waste              |