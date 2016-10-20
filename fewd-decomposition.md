Fewd will consist of:

  1. The command line tool that allows building a task based on the json structure.
  2. The prebuilt commands
    - deploy
    - run
    - init
    - optimize

All are instances of fewd item

FewdRoot
  - Initializes config and sets globals (CLI)
    - command line options
    - tool to use
  - On run it creates a FewdItem child corresponding to the options

  Handler: FewdCommand
