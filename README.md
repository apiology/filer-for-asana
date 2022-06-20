# Filer for Asana

[![CircleCI](https://circleci.com/gh/apiology/filer-for-asana.svg?style=svg)](https://circleci.com/gh/apiology/filer-for-asana)

Quickly creates Asana tasks from the Chrome Omnibox and Alfred workflows.

## Using Chrome Extension

Go to the URL bar ("Chrome Omnibox"), then type 'fa', a space, then
type your task name and hit enter.

You can file into a project by providing it at the end, prededed by a
`#`.  After the project, you can provide a section preceded by a `.`.
To file into a section in 'My Tasks' (your "user task list" in Asana
lingo), just provide a section with no project name.

## Using Alfred Workflow

Similarly, activate Alfred, then type 'fa', a space, then type your
task name and hit enter.  The same search syntax applies.

## Installing Chrome Extension

This isn't in the Chrome App Store - see [DEVELOPMENT.md](./DEVELOPMENT.md) for how to run from a local checkout.

## Installing Alfred workflow

Download and double click the latest release's [.alfredworkflow
file](https://github.com/{{cookiecutter.github_username}}/{{cookiecutter.project_slug}}/releases).

## Chrome Extension Configuration

1. Create a new "Personal access token" in
   [Asana](https://app.asana.com/0/my-apps)
1. Set up options directly
   [here](chrome-extension://TBD/options.html)
   or in Chrome | … | More Tools | Extensions | Filer for Asana |
   Details | Extension options.
1. Paste in your personal access token.
1. Provide the rest of the configuration and hit 'Save'

## Alfred Workflow Configuration

1. Create a new "Personal access token" in
   [Asana](https://app.asana.com/0/my-apps)
1. Alfred | Workflows | Filer for Asana | [≈] icon in upper right
1. Add values to Workflow Environment Variables section
1. Save

## Legal

Not created, maintained, reviewed, approved, or endorsed by Asana, Inc.

## Contributions

This project, as with all others, rests on the shoulders of a broad
ecosystem supported by many volunteers doing thankless work, along
with specific contributors.

In particular I'd like to call out:

* [Audrey Roy Greenfeld](https://github.com/audreyfeldroy) for the
  cookiecutter tool and associated examples, which keep my many
  projects building with shared boilerplate with a minimum of fuss.
* [Sindre Sorhus](https://github.com/sindresorhus) and [Sam
  Verschueren](https://github.com/SamVerschueren) for the alfy tool,
  which provided an easy on-ramp to integrating this project with
  Alfred.
