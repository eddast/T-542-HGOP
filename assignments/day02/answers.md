# Docker Exercise
This assignment revolved around building and running applications using Docker via running application in specific environments maintained in Docker containers. This has the benefit of running applications on (almost) "clean" sort of light-weight virtual-machines which ensures application can run on all machines.

## What is Docker?
A tool that allows developers to create, run and deploy applications. Docker creates containers that are like light-weight virtual-machines, but use the same Linux kernel as the computer that runs it. This ensures that the program will run in the same manner with same behaviour on any Linux kernel running that application.

## What is the difference between:
* Virtual Machine
* Docker Container
* Docker Image

A *Virtual Machine* is a software that emulates the behaviour of another computer in it's entirety, e.g. software providing full functionality of another physical computer running on your computer.

A *Docker container* however is an executable of a runnable Docker image, i.e. it is a software that bundles up application code and dependencies so the application runs across computer environments but does not provide full functionality of a computer, only of the application itself. Main difference between containers and virtual machines is that containers virtualize the operating system instead of hardware, making them more portable and efficient.

A *Docker Image* is a lightweight, stand-alone completely built application with all required dependencies and is built from the instructions for a complete and executable version of an application. The image includes the code, runtime, system tools, system libraries as well as all settings of the application. The image is then used to execute code in a Docker container.

## Web API?
A programmable interface that can be interacted with over a network to retrieve data, manipulate data or achieve some sort of desired functionality. The communication with web APIs are conducted via HTTP.

## Postgres?
An object-relational database offers many extensions on top the conventional raw SQL query language. It is used to store state and data for applications. 

## package.json file dependencies field:
The dependencies field in package.json file of application describe the dependencies that are required for that application to run. All dependencies that are declared in package.json are installed in a separate folder in the same directory called node_modules/ via the command npm install (or yarn install).

## NPM express package:
A light-weight external client for JavaScript installed via npm that is used for more easier implementation and definition of Web APIs. It provides a set of tools and methods for implementing API routes.

## NPM pg package:
A external npm client for JavaScript for communicating with PostgreSQL that supports postgres specific SQL extensions.

## What is docker-compose:
A Docker tool that enables running multiple Docker components in parallel, thus making it easier to deploy multi-container projects. To run multi-container project via docker compose, the application’s services are defined in a .yaml file which when run creates and starts all services in parallel using that configuration.

## Results
After this exercise I have learnt how to use Docker to create, run and deploy single-container applications that can run on any computer. I have also learnt how to create and run multi-container application with Docker compose by running a Web API container and a Postgres container simultaneously whose application's functionality is formed by the communication between the two containers.
