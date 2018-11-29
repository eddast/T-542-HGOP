#!/bin/bash

#####################################################################################################
# VERIFY_ENVIRONMENT.SH:
# Script that verifies presence and versions of dependencies used for the course T-542-HGOP
# For convenience, the script also offers user to install and, if appropriate, upgrade dependencies
# Script logs results of these checks for presence and versions of dependencies to ./report.log file
# As well as it logs if any dependencies are installed or upgraded during execution of script
######################################################################################################


#######################################################################################################
# A few commands are defined and imported from seperate script ./utils.sh for readability and clarity
# The following commands are used from utils.sh:
#   program_exists():   checks if a given program is installed to user computer
#   run_cmd():          runs command and logs explicit error to error log file ./script-error.log on fail
#   log_success():      logs to ./report.log and outputs to command line on success defined by green color
#   log_error():        logs to ./report.log and outputs to command line on error defined by red color
#   log():              logs to ./report.log and outputs to command line some neutral information
#   compare_versions(): compares a parameter version to the version installed on user computer
#   install_git():      runs all commands needed to install Git 
#   install_nodejs():   runs all commands needed to install NodeJS (and NPM is installed as well subsequently)
#   install_yarn():     runs all commands needed to install Yarn
#   install_docker()    runs all commands needed to install Docker
#   install_aws_cli()   runs all commands needed to install AWS Cli
#   install_terraform() runs all commands needed to install Terraform
#   get_runtime():      calculates and logs to ./report.log total runtime script took
dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
source "$dir/utils.sh"
#########################################################################################################




# Greet user and inform them of the script purpose
# Output user OS information
printf "\nHello, $USER.\n"
printf "This script will check the versions for your necessary dependencies\n"
printf "And will offer you to install and/or upgrade a dependency if not installed or up-to-date\n"
printf "OS: $(lsb_release -d | awk -F"\t" '{print $2}')\n\n"

# Prompt user to execute script and read user input
printf "Do you wish to continue and check your dependencies? (y/n): "
read input

# If user input was 'y' or 'Y' execute script
if [[ $input == "Y" || $input == "y" ]]; then

    # Get the current date and time in
    #   human readable format
    #   in ms since epoch (for script runtime)
    start_date="`date +%d/%m/%Y\ %H:%M:%S`"
    start=`echo $(($(date +%s%N)/1000000))`

    # Log time when script starts execution
    log "\n========================================"
    log "[$start_date]: verification script started execution"
    printf "\n"

    # Analyse whether operating system type of hardware is compatiable with script
    # Meaning OS needs to be linux-gnu or darwin type
    # If incompatible, log error and have script exit 
    printf "Checking your OS version for compatibility of this script...\n"
    if [[ "$OSTYPE" == "linux-gnu" ]]; then
        log "OS: $(lsb_release -d | awk -F"\t" '{print $2}')"
        log_success "User OS is compatible for this script"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        log "OS: $(lsb_release -d | awk -F"\t" '{print $2}')"
        log_success "User OS is compatible for this script"
    else
        log_error "OS is not supported for script: $OSTYPE"
        log_error "Script exiting"
        exit 1
    fi
    
    # Check for presence and target version (currently 10.4.1) of NodeJS
    # If user does not have NodeJS, offer to install NodeJS for user for convenience
    # If user does not have NodeJS target verison offer them to upgrade for convenience
    printf "\nChecking for presence and version of NodeJS...\n"
    node_target_version="10.4.1"
    if program_exists 'nodejs'; then

        # If user has NodeJS installed, log to logfile and output
        node_version=`node -v`
        log_success "NodeJS version ${node_version} already installed"

        # Check if user has target version of NodeJS
        printf "comparing version to target $node_target_version\n"
        diff=`compare_versions ${node_version:1:10} $node_target_version`
        if [[ $diff == 0 ]]; then
            # Target version already installed - inform user
            printf "NodeJS at target version $node_target_version\n"
        else
            # If NodeJS version is not target version offer user to upgrade NodeJS
            # Upgrade version if user inputs 'y' or 'Y'
            printf "NodeJS not at target version $node_target_version. Upgrade now? (y/n): "
            read input
            if [[ $input == "Y" || $input == "y" ]]; then
                install_nodejs "$node_target_version"
                log_success "Successfully upgraded NodeJS to target version $node_target_version"
            fi
        fi
    else
        # If NodeJS is not installed log this and output to user
        # Offer user to install NodeJS on input 'y' or 'Y'
        # Log in log file if user installs NodeJS
        log_error "No installation of NodeJS was found"
        printf "Do you wish to install NodeJS now? (y/n): "
        read input
        if [[ $input == "Y" || $input == "y" ]]; then
            install_nodejs "$node_target_version"
            log_success "Successfully installed NodeJS to version $(node -v)"
        fi
    fi

    # Check for presence and version of npm
    printf "\nChecking for presence and version of npm...\n"
    if program_exists 'npm'; then
        npm_version=`npm --version`
        log_success "npm already installed at version ${npm_version}"
    else
        # If npm is not installed log this and output to user
        # Offer user to install npm on input 'y' or 'Y'
        # Log in log file if user installs npm
        log_error "No installation of npm found"
        printf "npm is installed alongside NodeJS\n"
        printf "do you wish to install NodeJS? (y/n): "
        read input
        if [[ $input == "Y" || $input == "y" ]]; then
            install_nodejs "$node_target_version"
            log_success "Successfully installed NodeJS to version $(node -v)"
        fi
    fi
    
    # Check for presence and target version (currently 2.17.0) of Git
    # If user does not have Git, offer to install Git for user for convenience
    # If user does not have Git target verison offer them to upgrade for convenience
    printf "\nChecking for presence and version of Git...\n"
    if program_exists 'git'; then

        # If user has Git installed, log to logfile and output
        git_version=`git --version`
        git_target_version="2.17.0"
        log_success "${git_version} is already installed"

        # Check if user has target version of Git
        printf "Checking if version of Git is target version ($git_target_version)\n"
        diff=`compare_versions ${git_version:12:10} ${git_target_version}`

        if [ $diff -eq 2 ]; then
            # If Git version is not target version offer user to upgrade Git
            # Upgrade version if user inputs 'y' or 'Y'
            printf "Git version is not at target version ($git_target_version). Upgrade Git? (y/n): "
            read git_input
            if [[ $git_input == "Y" || $git_input == "y" ]]; then
                install_git
                log_success "Successfully updated git to $git_target_version"
            fi
        else
            # Target version already installed - inform user
            printf "Git is at target version $git_target_version\n"
        fi

    else
        # If Git is not installed log this and output to user
        # Offer user to install Git on input 'y' or 'Y'
        # Log in log file if user installs Git
        log_error "No installation of Git found"
        printf "Do you wish to install Git now? (y/n): "
        read input
        if [[ $input == "Y" || $input == "y" ]]; then
            install_git
            log_success "Successfully installed $(git --version)"
        fi
    fi

    # Check for presence and version of Yarn
    # If user does not have Yarn, offer to install Yarn for user for convenience
    printf "\nChecking for presence and version of Yarn...\n"
    if program_exists 'yarn'; then
        yarn_version=`yarn --version`
        log_success "Yarn already installed at version ${yarn_version}"
    else
        # If Yarn is not installed log this and output to user
        # Offer user to install Yarn on input 'y' or 'Y'
        # Log in log file if user installs Yarn
        log_error "No installation of Yarn found"
        printf "Do you wish to install Yarn now? (y/n): "
        read input
        if [[ $input == "Y" || $input == "y" ]]; then
            install_yarn
            log_success "Successfully installed Yarn version $(yarn --version)"
        fi
    fi

    # Check for presence and version of Docker
    printf "\nChecking for presence and version of Docker...\n"
    if program_exists 'docker'; then
        docker_version=`docker --version`
        log_success "${docker_version} already installed"
    else
        # If Docker is not installed log this and output to user
        # Offer user to install Docker on input 'y' or 'Y'
        # Log in log file if user installs Docker
        log_error "No installation of Docker found"
        printf "Do you wish to install Docker now? (y/n): "
        read input
        if [[ $input == "Y" || $input == "y" ]]; then
            install_docker
            log_success "Successfully installed $(docker --version)"
        fi
    fi

    # Check for presence and version of Docker Compose
    printf "\nChecking for presence and version of Docker Compose...\n"
    if program_exists 'docker-compose'; then
        docker_compose_version=`docker-compose --version`
        log_success "${docker_compose_version} already installed"
    else
        # If Docker is not installed log this and output to user
        # Offer user to install Docker on input 'y' or 'Y'
        # Log in log file if user installs Docker
        log_error "No installation of Docker Compose found"
        printf "Do you wish to install Docker Compose now? (y/n): "
        read input
        if [[ $input == "Y" || $input == "y" ]]; then
            install_docker_compose
            log_success "Successfully installed $(docker-compose --version)"
        fi
    fi

    # Check for presence and version of AWS Cli
    printf "\nChecking for presence and version of AWS Cli...\n"
    if program_exists 'aws'; then
        aws_cli_version=`aws --version 2>&1`
        log_success "AWS Cli ${aws_cli_version} already installed"
    else
        # If AWS Cli is not installed log this and output to user
        # Offer user to install AWS Cli on input 'y' or 'Y'
        # Log in log file if user installs AWS Cli
        log_error "No installation of AWS Cli found"
        printf "Do you wish to install AWS Cli now?\n"
        printf "NOTE: python and pip will be installed in the process if not present (y/n): "
        read input
        if [[ $input == "Y" || $input == "y" ]]; then
            install_aws_cli
            log_success "Successfully installed AWS CLi $(aws --version)"
        fi
    fi

    # Check for presence and version of Terraform
    printf "\nChecking for presence and version of Terraform...\n"
    if program_exists 'terraform'; then
        terraform_version=`terraform --version`
        terraform_version=`echo $terraform_version`
        log_success "${terraform_version} already installed"
    else
        # If Terraform is not installed log this and output to user
        # Offer user to install Terraform on input 'y' or 'Y'
        # Log in log file if user installs Terraform
        log_error "No installation of Terraform found"
        printf "Do you wish to install Terraform now?\n"
        printf "NOTE: unzip will be installed in the process if not present (y/n): "
        read input
        if [[ $input == "Y" || $input == "y" ]]; then
            install_terraform
            log_success "Successfully installed $(terraform --version)"
        fi
    fi

    # Get the current date and time in
    #   human readable format
    #   in ms since epoch (for script runtime)
    end_date="`date +%d/%m/%Y\ %H:%M:%S`"
    end=`echo $(($(date +%s%N)/1000000))`

    # Calculate the time the script took to run in ms
    # Log and print script runtime
    ms=$((end-start))
    get_runtime $ms

    # Log and output end time for script
    log "[$end_date]: Script stopped execution"
    log "========================================\n"
else
    # Exit script if user does not choose to execute script
    printf "${red}Environment verification script exiting\n\n${reset}"
fi