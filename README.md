# T-542-HGOP: Hagnýt Gæðastjórnun og Prófanir
Course repository for the Quality Assurance Course at Reykjavík University fall 2018 owned by Edda Steinunn Rúnarsdóttir, kt. 241095-2909. The repostiory contains all code and files as well as commit history relevant created throughout the three week period of the course. Any details that need to be documented or further clarified and/or explained for assignments delivered are attempted to be listed in the following file. 

## Overview
- [Week One](#w1)
  * [The Running Instance of the API](#w1-running-instance)
  * [Implementation Details Explained](#w1-implementation-details)
  
- [Week Two](#w2)
  * [The Running Instance of the API](#w2-running-instance)
  * [The Running Jenkins Instance](#w2-jenkins-instance)

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

#### The Verify Script and the Addition of utils.sh* Script

In addition to verifying presence of necessary dependencies of the environment of whoever executes the script, the verify script also offers the user to install the dependency if it is missing and can be installed. This feature was consulted with lab instructors which approved of having the functionality for ease of installing dependencies despite it not being a requirement for the script.

As per this addition to the verify script, so that the code would not become overly cluttered and illegible, a set of functions were defined in a separate script within the script directory named **utils.sh*** which is a script containing helper functionality to aid installation and checking of presence of dependencies. The verify script uses functionality from the util script to function. This deviation of having said util.sh script in addition to the files that should be delivered for the product for week one was consulted with lab instructors as well which approved.

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
│   └── package.json
│   └── package-lock.json*
│   └── jest.config.js*
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
│   └── deploy.sh
│   └── utils.sh*
├── docker-compose.yml
├── infrastructure.tf
├── Jenkinsfile
└── aboutme.md
└── README.md
```

The package-lock.json file although not specified in assignment description is present in my version control system because it is intended to checked into source control for dependency installation efficiency purposes and other tracability reasons. This was consulted with lab instructor which said this was a correct assumption. The jest.config.js file is present although not specified in assignment description to have jest test configuration separate from package.json file for possible future extensibility on test configuration.  This was consulted with lab instructor which said this was fine. Finally, refer to section [Implementation Details Explained](#w1-implementation-details) in [Week One](#w1) section for explaination on why utils.sh script file is present although not specified in assignment description.

<a name="w2-running-instance"></a>
### The Running Instance of the API

The running instance of the API is up at the public IP address **TODO**. This means that the following terminal command (or navigating to TODO:3000/status in browser):
```bash
$ curl TODO:3000/status
```
Interacts with my running build instance of my API hosted by AWS cloud services of the application delivered for week one, and yields the following output:

```bash
The API is running!
```
Which verifies that my application instance is up and running. One can also perform the following actions and get responses based on the current functionality implementation of the Lucky21 game:

```bash
$ curl -X POST TODO:3000/start
$ curl -X POST TODO:3000/stats
$ curl TODO:3000/state
$ curl -X POST TODO:3000/start
$ curl -X POST TODO:3000/guess21OrUnder
$ curl -X POST TODO:3000/guessOver21
```

<a name="w2-jenkins-instance"></a>
### The Running Jenkins Instance
The URL to my running Jenkins Instance which currently manages and audits the deployment pipeline of this repository is http://ec2-54-159-65-134.compute-1.amazonaws.com:8080/. Lab instructors should have been provided with a user to access this Jenkins instance through submission comment when this repository URL was handed in to Canvas.

**NOTE:** If you are relevant to the management of the course T-542-HGOP and you require a user access to the Jenkins instance as well for grading purposes or otherwise, please specify your reasons and contact the author of this repository via email: eddasr15@ru.is to request a user to the Jenkins instance.