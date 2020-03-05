# Plugin for Miro - howfastyouaregoing - jira-miro integration

This plugin allows to transition Jira issues in Jira when moving them on Miro Board.
![Graph](docs/cardtransition.gif)
### Current prerequisites
* you need to have jira cards plugin installed as this plugin is created in a way to extend its capabilities

## Installation
[CLICK HERE](https://miro.com/oauth/authorize/?response_type=token&client_id=3074457346801799399&redirect_uri=https://miro.com) to install plugin in Miro.

## How it works

A video showcasing how to setup sample board & use this plugin:
 * https://www.youtube.com/watch?v=UM-8ejbJKBA 

## Why

It was really cool to use Miro as a Kanban board, especially with people working from home. 
To use it fully the best idea is to use Jira cards to be able to keep there larger chunks of infromation
and use jira to track progress/metrics. The only issue was it was still required to go Jira to change status of an issue when moving
card to a different column in Miro. With this plugin it is no longer required.

## Use case

* To use Miro as a kanban board without need to go to Jira to change issues statuses.

## Known issues & upcoming features
There are some ideas for features, some known issues

#### Features
* remodel the way transition fields are created. This will be changed to drag&drop 
which will create a sample objects. This turns out to be more natural for the users.
* less user intrusive handling of authorization to Atlassian. Idea is to enforce atlassian authentication only when: 
  * moving cards
  * trying to modify the board 
* support multiple jira clouds at once
* creating a link between issues creates actual linkage in Jira. Depending on an arrow can indicate dependencies
* adding support for cards rotation to trigger some change in jira - for instance to mark a ticket as blocked in jira for tracking/metrics purposes
* built in support for jira cards without requirement to use miro jira integration plugin
  * click on story and click a button to automatically add all stories of given epic or all sub-tasks of given story to the right of current card
  * click to add all linked issues to selected card
  * search window which will show only the issues that are not added to current board [not greying them out as in current jira miro integration]
  * instant access to metrics for project
  * instant access to issue data in a preview window
    * ability to transition issue directly from preview view

#### Issues
* code needs to be rewritten. Current PoC is finished, now the code needs cleanup
