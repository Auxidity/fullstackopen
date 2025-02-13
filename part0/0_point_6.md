```mermaid
sequenceDiagram
    participant browser
    participant server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    Note right of browser: The user creates a new note and submits the form. New note is appended to local array and then redrawn immediately before server response.
    activate server
    server-->>browser: JSON response confirming the new note is saved
    deactivate server

    Note left of server: The server sends a confirmation callback for succesfully creating a new note
```

Side note: It is possible that the server doesn't return an OK201 signifying a succesfully created note. This could be due to disconnection during the post operation (or at any point after initially loading the page fully) thus meaning no response, and theoretically you should be able to also get a 4XX - 5XX range error although I didn't go out of my way trying to make that happen. Regardless of any of these outcomes, the spa would still update the local array first and render it despite having no confirmation if it actually ever made it to the server and what the server thinks of the post method used.