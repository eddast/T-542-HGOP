# T-542-HGOP: Hagnýt Gæðastjórnun og Prófanir
Course repository for the Quality Assurance Course at Reykjavík University fall 2018 owned by Edda Steinunn Rúnarsdóttir, kt. 241095-2909. The repostiory contains all code and files as well as commit history relevant created throughout the three week period of the course. Any details that need to be documented or further clarified and/or explained for assignments delivered are attempted to be listed in the following file. 

## Overview
- [Week One](#w1)
  * [The Running Instance of the API](#w1-running-instance)
  * [Implementation Details Explained](#w1-implementation-details)

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

