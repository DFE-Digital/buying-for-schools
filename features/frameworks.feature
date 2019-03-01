Feature: App is running
    This screen allows caseworker to select Tier 2, 4 & 5 application type, which will direct to the right Financial status check form

    Scenario: Open the find a framework page
        When user is on page /frameworks/type
        Then the service displays the following page content
            | Page title  | What is the type of purchase?  |