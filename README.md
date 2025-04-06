# poke

Accessibility tool for dicating Pokemon gameplay using mouse only input.

Still an early work in progress, I have no experience with assistive tools like this so I'm learning as I go.

## Core Requirements

- Provide button-based menus for common gameplay elements.
- Dynamic sub-menu generation using user input Decklists.
- Make inout region compact to reduce range of required mouse movement.

## Extra Features

- PWA-enabled for offline use.
- Utilize Browser LocalStorage to persist user input.
- Automatic pagination to keep menu lists from growing vertically.

## Areas for Improvement

- Figure out a better pattern for Output messages or indicating current/recent selections.
- Make sizing + positioning configurable.
- Add a freetext input to the menu.
- Make core menu configuration dynamic via user input, possibly with some yaml based tree structure.
- Allow for further customization of menu options (font color, background color, etc)?
- Improve deck handling for auto-formatting off common deck sites, improved error handling, etc.
