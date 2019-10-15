# Privacy Policy - Howfastyouaregoing Jira-Miro integration plugin
This plugin allows making changes to your Jira project based on actions performed in Miro.

**How does this plugin access your Atlassian account?**

This plugin acts as a gateway between Miro and your Atlassian. It does not store any data itself apart from basic information that most websites collect. The plugin uses common internet technologies, such as cookies and web server logs. 

The information collected about all users of this plugin include:
1. the visitor’s browser type
2. referring site
3. the date and time of each visitor request
4. potentially personally-identifying information like Internet Protocol (IP) addresses is also collect
5. information about features usage

**What is processed on plugin backend servers?**

Other data provided by the user that is processed on the plugin servers includes only authentication/authorization tokens to Atlassian only in order to be able to call Atlassian API from the frontend while using Miro.

This will not be required once it will be possible to authenticate to Atlassian with frontend only.

**What is stored on plugin servers?**

This plugin does not store any data from Jira nor Miro on its servers. 

Everything apart from previously mentioned tokens is either stored or processed inside the user web browser. 
Plugin, in order to work correctly, requires to store some of the data pulled from Atlassian on Miro board like information about transitions.

**Why does this plugin need to access my Jira?**

This plugin needs to search for information about projects available transitions. In order to do that it queries the data about your projects and issues from Jira. All these operations are performed inside your browser and are not stored or processed on plugin servers.
Later on based on information about these transitions this addon can query Jira API to transition tickets.

**Source code**

Source code of this plugin is open and is available at https://github.com/Kaszaq/jiramiroplugin

**DISCLAIMER**

This project is still in testing phase. Precautions are made and I code it with due diligence, however until this plugin is stabilized and well tested you use it at your own risk.
