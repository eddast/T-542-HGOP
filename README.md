# T-542-HGOP: Hagnýt Gæðastjórnun og Prófanir
Course repository for the Quality Assurance Course at Reykjavík University fall 2018 owned by Edda Steinunn Rúnarsdóttir, kt. 241095-2909. The repository contains all code and files as well as commit history relevant created throughout the three week period of the course. Any details that need to be documented or further clarified and/or explained for assignments delivered are attempted to be listed in the following file. 

## Overview
- [Week One](#w1)
  * [The Running Instance of the API](#w1-running-instance)
  * [Implementation Details Explained](#w1-implementation-details)
  
- [Week Two](#w2)
  * [The Running Jenkins Instance](#w2-jenkins-instance)
  * [The Running Instance of the API](#w2-running-instance)
  
  - [Week Three](#w3)
  * [The Running Jenkins Instance](#w3-jenkins-instance)
  * [The Running Instance of the Lucky21 Game](#w3-running-instance)
  * [The DataDog Dashboard](#w3-datadog-dashboard)

<a name="w1"></a>
## Week One
At the due date for application in the first week (30.11.2018) the following is an overview of the folder structure and files that are up on the master branch (as per instructions, deviations are marked with '*' and explained under "Implementation Details Explained" section).

```bash
├── itemrepository
│   ├── app.js
│   ├── database.js
│   ├── Dockerfile
│   └── package.json
├── assignments
│   ├── day01
│   │   └── answers.md
│   └── day02
│       └── answers.md
├── scripts
│   ├── initialize_game_api_instance.sh
│   ├── verify_environment.sh
│   ├── utils.sh*
│   └── deploy.sh
├── docker-compose.yml
├── infrastructure.tf
└── README.md
└── aboutme.md
```
<a name="w1-running-instance"></a>
### The Running Instance of the API

**UPDATE 04.12.2018 at 21:28**: Instance terminated as per assignment description to week 2 day 3.

The running instance of the API is up at the public IP address **52.91.240.77**. This means that the following terminal command (or navigating to 52.91.240.77:3000/status in browser):
```bash
$ curl 52.91.240.77:3000/status
```
Interacts with my running build instance of my API hosted by AWS cloud services of the application delivered for week one, and yields the following output:

```bash
The API is running!
```
Which verifies that my application instance is up and running.

<a name="w1-implementation-details"></a>
### Implementation Details Explained
Several minor details deviate from the original assignment descriptions for the assigments given in week one in some manner or other which are listed here to provide explaination the purpose of those deviations and their reasoning.

<a name="w1-implementation-details-verify-utils"></a>
#### The Verify Script and the Addition of utils.sh* Script

In addition to verifying presence of necessary dependencies of the environment of whoever executes the script, the verify script also offers the user to install the dependency if it is missing and can be installed. This feature was consulted with lab instructors which approved of having the functionality for ease of installing dependencies despite it not being a requirement for the script.

As per this addition to the verify script, so that the code would not become overly cluttered and illegible, a set of functions were defined in a separate script within the script directory named **utils.sh*** which is a script containing helper functionality to aid installation and checking of presence of dependencies. The verify script uses functionality from the util script to function. This deviation of having said util.sh script in addition to the files that should be delivered for the product for week one was consulted with lab instructors as well which approved.

<a name="w1-implementation-details-await-postgres"></a>
#### Awaiting postgres container startup in database.js file
For day two when working with docker compose, some problems related to concurrency arose due to "depends_on" keyword not always functioning as should (i.e. it should ensure that postgres container runs then the client). Adding a timeout function around client.connect() function in the file database.js so that it awaits postgres connection before being called solved the problem, see below snippet of code:

```javascript
setTimeout(() =>
    client.connect((err) => {
        if (err) console.log('failed to connect to postgres!');
        else {
            console.log('successfully connected to postgres!');
            /* snipped */
        }
    }), 2000);
```

 This was consulted with lab instructor (Hrafn Orri Hrafnkelsson) who ensured that having this workaround in the code was OK and to keep the time-out function in the code as is.

<a name="w2"></a>
## Week Two
At the due date for application in the second week (7.12.2018) the following is an overview of the folder structure and files that are up on the master branch (deviations are marked with '*' and explained below).

```bash
├── game-api
│   ├── .eslintrc.json
│   ├── app.js
│   ├── server.js
│   ├── config.js
│   ├── random.js
│   ├── random.unit-test.js
│   ├── deck.js
│   ├── deck.unit-test.js
│   ├── dealer.js
│   ├── dealer.unit-test.js
│   ├── lucky21.js
│   ├── lucky21.unit-test.js
│   ├── inject.js
│   ├── context.js
│   ├── database.js
│   ├── Dockerfile
│   ├── package.json
│   ├── .dockerignore*
│   ├── jest.config.js*
│   └── package-lock.json*
├── assignments
│   ├── day01
│   │   └── answers.md
│   └── day02
│       └── answers.md
├── scripts
│   ├── initialize_game_api_instance.sh
│   ├── verify_environment.sh
│   ├── docker_compose_up.sh
│   ├── docker_build.sh
│   ├── docker_push.sh
│   ├── sync_session.sh
│   ├── deploy.sh
│   └── utils.sh*
├── docker-compose.yml
├── infrastructure.tf
├── Jenkinsfile
├── aboutme.md
└── README.md
```

The **_package-lock.json_** file although not specified in assignment description is present in my version control system because it is intended to checked into source control for dependency installation efficiency purposes and other tracability reasons. This was consulted with lab instructor which said this was a correct assumption. The **_jest.config.js_** file is present although not specified in assignment description for the purpose of seperating unit test configuration from package.json file for better extensibility on test configuration. This was consulted with lab instructor which said this was OK. The **_.dockerignore_** file is present although not specified in assignment description to manage which files are not ignored, i.e. not copied into the docker image when executing the COPY command in the Dockerfile that copies necessary files to artifact repository when building docker images. Finally, refer to section [The Verify Script and the Addition of utils.sh* Script](#w1-verify-utils) section for explaination on why **_utils.sh_** script file is present although not specified in assignment description.

<a name="w2-jenkins-instance"></a>
### The Running Jenkins Instance
The URL to my running Jenkins Instance which currently manages and audits the deployment pipeline of this repository is http://ec2-54-159-65-134.compute-1.amazonaws.com:8080/. The URL to the main pipeline of this repository and project in the Jenkins Dashboard is http://ec2-54-159-65-134.compute-1.amazonaws.com:8080/job/HGOP-2018-pipeline/ and the URL to the deployment job in the Jenkins Dashboard is http://ec2-54-159-65-134.compute-1.amazonaws.com:8080/job/gameAPI-deployment/.

Note that these links are not accessible without having been authorized to the Jenkins Dashboard and for that you need to have a username and password to the Jenkins instance. _Lab instructors should were been provided with their user names and passwords to access this Jenkins instance through submission comment when this repository URL was handed in to Canvas_.

**NOTE:** If you are relevant to the management of the course T-542-HGOP and you require a user access to the Jenkins instance as well for grading purposes or otherwise, please specify your reasons and contact the author of this repository via email: eddasr15@ru.is to request a user to the Jenkins instance.

<a name="w2-running-instance"></a>
### The Running Instance of the API

The running instance of the API is up at a public IP address that can be found in the **console output of the latest build of the Jenkins deploy job, which can be viewed from the Jenkins Dashboard** at URL http://ec2-54-159-65-134.compute-1.amazonaws.com:8080/job/gameAPI-deployment/{latest-job-ID}/console (where the latest-job-ID denotes the ID number of the latest deployment job). Again, to view this you need to have a username and password to the Jenkins Dashboard. An example output from the console is for example the following:

```bash
........
Apply complete! Resources: 2 added, 0 changed, 0 destroyed.[0m
[0m[1m[32m
Outputs:

public_ip = 35.173.179.24[0m
+ terraform output public_ip
+ echo Game API running at  + 35.173.179.24
Game API running at  + 35.173.179.24
........
```

In this case, as per the output the public ip address of the running GameAPI instance is 35.173.179.24 (this of course is not the case anymore as when any changes are pushed into the current git repository, a new instance is formed with new public IP). This public IP can then be used to interface with my running instance of the GameAPI.

To verify my application instance is up and running, one can perform the following bash commands to query the API and get HTTP responses based on the current functionality implementation of the Lucky21 game (where the publicIP denotes the current public ip of the running GameAPI instance):

```bash
$ curl <publicIP>:3000/status
$ curl <publicIP>:3000/state
$ curl -X POST <publicIP>:3000/start
$ curl -X POST <publicIP>:3000/stats
$ curl -X POST <publicIP>:3000/start
$ curl -X POST <publicIP>:3000/guess21OrUnder
$ curl -X POST <publicIP>:3000/guessOver21
```

<a name="w3"></a>
## Week Three
At the final due date for application (14.12.2018), the following is an overview of the folder structure and files that are up on the master branch (deviations are marked with '*' and explained below).

```bash
├── game-api
│   ├── migrations
│   │   ├── 20181210194527-GameResultTable.js
│   │   └── 20181210200523-GameResultTableAddInsertDate.js
│   ├── .eslintrc.json
│   ├── app.js
│   ├── server.js
│   ├── server.lib-test.js
│   ├── server.api-test.js
│   ├── server.capacity-test.js
│   ├── config.js
│   ├── random.js
│   ├── random.unit-test.js
│   ├── deck.js
│   ├── deck.unit-test.js
│   ├── dealer.js
│   ├── dealer.unit-test.js
│   ├── lucky21.js
│   ├── lucky21.unit-test.js
│   ├── inject.js
│   ├── context.js
│   ├── database.js
│   ├── database.json
│   ├── Dockerfile
│   ├── package.json
│   ├── .dockerignore*
│   ├── package-lock.json*
│   ├── hotshots.js*
│   ├── jest.api.config.js*
│   ├── jest.unit.config.js*
│   ├── jest.capacity.config.js*
│   ├── database.unit-test.js*
├── game-client
│   │   ├── App.js
│   │   └── utils.js
│   ├── Dockerfile
│   └── index.js
│   └── (more files)
├── assignments
│   ├── day01
│   │   └── answers.md
│   ├── day02
│   │   └── answers.md
│   └── day11
│       └── answers.md
├── scripts
│   ├── initialize_game_api_instance.sh
│   ├── verify_environment.sh
│   ├── docker_compose_up.sh
│   ├── docker_build.sh
│   ├── docker_push.sh
│   ├── sync_session.sh
│   ├── deploy.sh
│   └── utils.sh*
├── DataDogDashboard.png
├── docker-compose.yml
├── infrastructure.tf
├── Jenkinsfile
├── aboutme.md
└── README.md
```

For explanation on the presence of **_package-lock.json_** and **_.dockerignore_** files, refer to section [Week Two](#w2) and for explanation **_utils.sh_** script file under scripts, refer to section [The Verify Script and the Addition of utils.sh* Script](#w1-verify-utils).

The test configuration files **_jest.unit.config.js_** (was renamed from jest.config.js to jest.unit.config.js from week 2), **_jest.api.config.js_** and **_jest.capacity.config.js_** are present although not specified in assignment description for the purpose of seperating test configurations from package.json file for better extensibility on test configuration. This was consulted with lab instructor which said this was OK.

The unit test file **_database.unit-test.js_** is present although not specified in assignment description as a personal unit test practise, it merely initializes dummy context, tests for correct callback values and is kept in repository for for the sake of a tad better code coverage for the Jenkins code coverage report for the test stage.

the **_hotshot.js_** file is present although not specified in assignment description for the purpose of code consistency as other iniitialization modules that use the dependency injection method used throughout the project (e.g. injecting context) are generally initialized in their own file. It's purpose is simply to initialize a hotshot client.

<a name="w3-jenkins-instance"></a>
### The Running Jenkins Instance
The main URL to my running Jenkins Instance which currently manages and audits the deployment pipeline of this repository is http://ec2-54-159-65-134.compute-1.amazonaws.com:8080/. The following are relevant URLs to all jobs within the Jenkins dashboard:

* The main pipeline of repository and project: http://ec2-54-159-65-134.compute-1.amazonaws.com:8080/job/HGOP-2018-pipeline/
* API test job of pipeline: http://ec2-54-159-65-134.compute-1.amazonaws.com:8080/job/gameAPI-api-test/
* Capacity test job of pipeline: http://ec2-54-159-65-134.compute-1.amazonaws.com:8080/job/gameAPI-capacity-test/
* Deployment job of pipeline: http://ec2-54-159-65-134.compute-1.amazonaws.com:8080/job/gameAPI-deployment/

Note that these links are not accessible without having been authorized to the Jenkins Dashboard and for that you need to have a username and password to the Jenkins instance. _Lab instructors should were been provided with their user names and passwords to access this Jenkins instance through submission comment when this repository URL was handed in to Canvas_.

**NOTE:** If you are relevant to the management of the course T-542-HGOP and you require a user access to the Jenkins instance as well for grading purposes or otherwise, please specify your reasons and contact the author of this repository via email: eddasr15@ru.is to request a user to the Jenkins instance.

<a name="w3-running-instance"></a>
### The Running Instance of the Lucky21 Game
The running instance of the API is up at a public IP address that can be found in the **console output of the latest build of the Jenkins deploy job, which can be viewed from the Jenkins Dashboard** at URL http://ec2-54-159-65-134.compute-1.amazonaws.com:8080/job/gameAPI-deployment/{latest-job-ID}/console (where the latest-job-ID denotes the ID number of the latest deployment job). Again, to view this you need to have a username and password to the Jenkins Dashboard. An example output from the console is for example the following:

```bash
........
Apply complete! Resources: 2 added, 0 changed, 0 destroyed.[0m
[0m[1m[32m
Outputs:

public_ip = 35.173.179.24[0m
+ terraform output public_ip
+ echo Game API running at  + 35.173.179.24
Game API running at  + 35.173.179.24
........
```

In this case, as per the output the public ip address of the running GameAPI instance is 35.173.179.24 (this of course is not the case anymore as when any changes are pushed into the current git repository, a new instance is formed with new public IP). This public IP can then be used to access with my running instance of the Lucky21 game.

To verify my application instance is up and running, one can for example navigate to the public IP address and to port 4000, http://<publicIP>:4000/ and enjoy a game of Lucky21 (where the publicIP denotes the current public ip of the running instance) or query the game API on port 3000 with same routes as mentioned in  [Week Two](#w2) section's [The Running Instance of the API](#w2-running-instance).

<a name="w3-datadog-dashboard"></a>
### The DataDog Dashboard
The URL to the DataDog dashboard of the project is: https://p.datadoghq.com/sb/ac5becabc-abef54a9c80d6516c7ce6ba0efdc7c1a. The DataDog Dashboard of this project is a screenboard and shows statistics and monitoring results of the following metrics:

* Games started in production
* Running Production containers
* Memory Usage
*  CPU Usage
* Cache usage in production
* Games won in production
* Games lost in production

Following is a screenshot of the DataDog monitoring dashboard of this project:
https://github.com/eddast/T-542-HGOP/blob/master/DataDogDashboard.png "DataDog Dashboard for T-542-HGOP by @eddast"


