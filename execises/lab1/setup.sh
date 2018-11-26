#!/bin/bash
dir="$(pwd)"
source "$dir/utils.sh"
printf "\nHello, $USER.\n"
printf "This script will install your necessary dependencies\n"
printf "OS: $(lsb_release -d | awk -F"\t" '{print $2}')\n"
if [[ "$OSTYPE" == "linux-gnu" ]]; then
    log_success "$OSTYPE is supported by this script"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    log_success "$OSTYPE is supported by this script"
else
    log_error "You're current operating system is not supported: $OSTYPE"
    exit 1
fi
printf "Do you wish to continue and check dependencies? (y/n): "
# Read input from user to the variable input
read input

# Install all required dependencies
# few commands used are defined in a seperate script (./utils.sh)
# They are documented there:
# program_exists()
# run_cmd()
# log_success()
# compare_versions()
# install_git()
# install_nodejs()
# calculate_runtime()
if [[ $input == "Y" || $input == "y" ]]; then
    # Get the current date and time in human readable format
    start_date="`date +%d/%m/%Y\ %H:%M:%S`"
    # Get the current date and time in ms since epoch
    start=`echo $(($(date +%s%N)/1000000))`
    printf "\nStarted installation at $start_date\n\n"
    printf "===================================\n\n"
    
    # install nodejs"
    node_target_version="10.4.1"
    if program_exists 'nodejs'; then
        printf "${green}NodeJS already installed, comparing version to target $node_target_version${reset}\n\n"
        node_version=`node -v`
        # compares the current node version and the previous node version
        diff=`compare_versions ${node_version:1:10} $node_target_version`
        if [[ $diff == 0 ]]; then
            printf "${green}NodeJS version $node_target_version already installed, skipping...${reset}\n\n"
        else
            printf "Missing NodeJS version 10. Install now? (y/n): "
            read input
            if [[ $input == "Y" || $input == "y" ]]; then
                # Runs steps to install the correct nodejs version
                install_nodejs "$node_target_version"
                log_success "Successfully updated NodeJS to version $(node -v)"
            else
                printf "Skipping NodeJS...\n\n"
            fi
        fi
    else
        printf "Missing NodeJS. Install now? (y/n): "
        read input
        if [[ $input == "Y" || $input == "y" ]]; then
            # Runs steps to install the correct nodejs version
            install_nodejs "$node_target_version"
            log_success "Successfully installed NodeJS version $(node -v)"
        else
            printf "Skipping NodeJS...\n\n"
        fi
    fi

    # install vscode
    if program_exists 'code'; then
        printf "${green}Visual Studio Code is already installed, skipping...${reset}\n\n"
    else
        printf "Missing Visual Studio Code. Install now? (y/n): "
        read input
        if [[ $input == "Y" || $input == "y" ]]; then
            printf "\nStarting installation of Visual Studio Code\n"

            # Adds the repository for ubuntu-make to the list of known apt-repositories
            run_cmd 'sudo add-apt-repository ppa:ubuntu-desktop/ubuntu-make'
            # Updates the apt package lists to new packages
            run_cmd 'sudo apt-get update'
            # Fetches all new updates for apt packages
            run_cmd 'sudo apt-get upgrade'
            # Installs ubuntu-make on the system, -y forces yes
            run_cmd 'sudo apt-get install ubuntu-make -y'
            # Installs visual studio code through umake
            run_cmd 'umake ide visual-studio-code'
            log_success 'Successfully installed Visual Studio Code'
        else
            printf "Skipping Visual Studio Code...\n\n"
        fi
    fi
    
    # install git
    if program_exists 'git'; then
        printf "${green}Git already installed, checking if version is greater than 2.17${reset}\n\n"
        git_version=`git --version`
        git_target_version="2.17.0"
        diff=`compare_versions ${git_version:12:10} ${git_target_version}`
        if [ $diff -eq 2 ]; then
            printf "Missing Git version greater than 2.17.0, install now? (y/n)"
            read git_input
            if [[ $git_input == "Y" || $git_input == "y" ]]; then
                install_git
                log_success "Successfully updated git to $(git --version)"
            else
                printf "Skipping Git...\n\n"
            fi
        else
            printf "${green}Git version greater than $git_target_version already installed, skipping...${reset}\n\n"
        fi
    else
        printf "Missing Git. Install now? (y/n): "
        read input
        if [[ $input == "Y" || $input == "y" ]]; then
            install_git
            log_success "Successfully installed $(git --version)"
        else
            printf "Skipping Git...\n\n"
        fi
    fi

    #install docker
    if program_exists 'docker'; then
        printf "${green}Docker already installed, skipping...\n\n${reset}"
    else
        printf "Missing Docker. Install now? (y/n): "
        read input
        if [[ $input == "Y" || $input == "y" ]]; then
            printf "\nStarting installation of Docker\n"
            # Installs all the dependancies that docker requires
            run_cmd 'sudo apt-get install apt-transport-https curl ca-certificates software-properties-common -y'
            # Adds the gpg key for docker to the list of known apt keys
            run_cmd 'curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add'
            # Adds the repository for docker to the system
            run_cmd "sudo add-apt-repository deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
            # Updates the apt package lists to new packages
            run_cmd 'sudo apt-get update'
            # Fetches all new updates for apt packages
            run_cmd 'sudo apt-get upgrade'
            # Installs ubuntu-make on the system, -y forces yes
            run_cmd 'sudo apt-get install docker-ce -y'
            log_success "Successfully installed $(docker -v)"
        else
            printf "Skipping Docker...\n\n"
        fi
    fi

    # install yarn
    if program_exists 'yarn'; then
        printf "${green}Yarn already installed, skipping...\n\n${reset}"
    else
        printf "Missing Yarn. Install now? (y/n): "
        read input
        if [[ $input == "Y" || $input == "y" ]]; then
            printf "\nStarting installation of Yarn\n"
            # Adds the gpg key for yarn to the list of known apt keys
            run_cmd 'curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add'
            # Adds the yarnpkg to the debian package list
            run_cmd "echo deb https://dl.yarnpkg.com/debian/ stable main | sudo tee /etc/apt/sources.list.d/yarn.list"
            # Updates the apt package lists to new packages
            run_cmd 'sudo apt-get update'
            # Installs the yarn package, -y forces install
            run_cmd 'sudo apt-get install yarn -y'
            log_success "Successfully installed Yarn version $(yarn --version)"
        else
            printf "Skipping Yarn...\n\n"
        fi
    fi

    printf "===================================\n\n"
    # Get the current date in human readable form
    end_date="`date +%d/%m/%Y\ %H:%M:%S`"
    printf "Ended installation at $end_date\n"
    # Get the current date in ms since epoch
    end=`echo $(($(date +%s%N)/1000000))`
    # Calculate the time the script took to run in ms
    ms=$((end-start))
    # Calculates the time and prints it to screen
    calculate_runtime $ms
else
    printf "${red}Installation script exiting\n${reset}\n\n"
fi