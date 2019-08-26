# THIS documentation is not yet valid

# Running
Simplest way to run this application is by using docker.

##### Example for Windows
```
docker run --rm -it --name jira-plugin-miro-integration ^
  -e JIRA_URL=https://yourname.atlassian.net ^
  -e JIRA_USERNAME={...} ^
  -e JIRA_PASSWORD={...} ^
  -e PROJECT_ID={...} ^
  -p 8080:8080 ^
  -v %cd%/storage:/storage ^
  kaszaq/jira-plugin-miro-integration
```


## Storage
You need to add volume for directory `/storage`. If you do not set any volume, the projects data will not be persisted and will force you to download it from Jira every time you use this app.

## Configuration parameters
To run application you need to specify some parameters. These can be provided as system properties or enviroment variables.
Following information takes you provide them as enviroment variables to docker image.

### Required parameters
* `JIRA_URL` - url to your jira, for instance to cloud jira it would something like `https://yourname.atlassian.net`
* `JIRA_USERNAME` - username of user to be used
* `JIRA_PASSWORD` - this is either password or [api token](https://confluence.atlassian.com/cloud/api-tokens-938839638.html)
* `PROJECT_ID` - short ID of your project in Jira. Currently this app supports handling only of one jira project

### Optional parameters
* `ENCRYPTION_PASSWORD` - when provided all stored files will be encrypted using this password.

### Other

* `PROXY` - set to "`-Dhttp.proxyHost=proxyaddress.here -Dhttp.proxyPort=80 -Dhttps.proxyHost=proxyaddress.here -Dhttps.proxyPort=443`" if need to use proxy to access jira
