#!/bin/bash

######################################################################################
# UTILS.SH
#   Helper functions and commands to aid functionality of
#   ./verify_environment.sh script along with logging logic
#######################################################################################


# Variables for current directories and log files
# Script report i.e. result of checks, installs and upgrading of programs are logged to ./report.log
# Explicit error feedback when installation or upgrade for a program fails are logged to ./script-error.log
dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
log_file="report.log"

# Define color variables for more explicit output
red=`tput setaf 1`
green=`tput setaf 2`
reset=`tput sgr0`

# Checks if a program is already installed
# $1 program name
program_exists() {
    if [ $(type -P $1) ]; then
        return 0
    else
        return 1
    fi
}

# Logs both to standard output and log file if check was successful
# Uses green to indicate success
# $1 message to log and output
log_success() {
    if [ ! -f "$dir/$log_file" ]; then
        $(touch $dir/$log_file)
    fi
    printf "${1}\n" >> "$dir/$log_file"
    printf "${green}${1}${reset}\n"
}

# Logs both to standard output and log file if check was unsuccessful
# Uses red to indicate error
# $1 message to log and output
log_error() {
    if [ ! -f "$dir/$log_file" ]; then
        $(touch $dir/$log_file)
    fi
    printf "${1}\n" >> "$dir/$log_file"
    printf "${red}${1}${reset}\n"
}

# Logs both to standard output (colorless) and log file some information
# $1 message to log and output
log() {
    if [ ! -f "$dir/$log_file" ]; then
        $(touch $dir/$log_file)
    fi
    printf "${1}\n" >> "$dir/$log_file"
    printf "${1}\n"
}

# Runs a command and checks if it failed.
# If the command failed it is logged and outputted
run_cmd() {
    output=$( $1 | tee /dev/tty)
    if [ $? -ne 0 ]; then
        log_error "$output\n\n"
    fi
}

# Runs all appropriate commands to install NodeJS to it's target version
# (Target version 10.4.1)
install_nodejs() {
    printf "\nStarting installation of NodeJS\n"
    target_version=$1
    # Updates the apt package lists to new packages
    run_cmd 'sudo apt-get update'
    # Installs npm globally to fetch the node version manager
    run_cmd 'sudo apt-get install npm -y'
    # Installs the node version manager
    run_cmd 'sudo npm install -g n'
    # Specifies the node version manager to install the target version
    run_cmd "sudo n $target_version"
    run_cmd "sudo ln -sf /usr/local/n/versions/node/$target_version/bin/node /usr/bin/node"
}

# Runs all appropriate commands to install NodeJS to it's target version
# (Target version 2.17.0)
install_git() {
    printf "\nStarting installation of Git\n"
    # Adds the latest git repository to the list of known apt repositories
    run_cmd 'sudo apt-add-repository ppa:git-core/ppa'
    # Updates the apt package lists to new packages
    run_cmd 'sudo apt-get update'
    # Fetches all new updates for apt packages
    run_cmd 'sudo apt-get upgrade'
    # Installs ubuntu-make on the system, -y forces yes
    run_cmd 'sudo apt-get install git -y'
}

# Runs all appropriate commands to install Yarn
install_yarn() {
    printf "\nStarting installation of Yarn\n"
    # Adds the gpg key for yarn to the list of known apt keys
    run_cmd 'curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add'
    # Adds the yarnpkg to the debian package list
    run_cmd "echo deb https://dl.yarnpkg.com/debian/ stable main | sudo tee /etc/apt/sources.list.d/yarn.list"
    # Updates the apt package lists to new packages
    run_cmd 'sudo apt-get update'
    # Installs the yarn package, -y forces install
    run_cmd 'sudo apt-get install yarn -y'
}

# Runs all appropriate commands to install Docker
install_docker() {
    printf "\nStarting installation of Docker\n"
    # Installs all the dependencies that docker requires
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
}

install_docker_compose() {
    printf "\nStarting installation of Docker Compose\n"
    kernel_name=$(uname -s)
    machine_hardware_name=$(uname -m)
    # Downloads docker compose dependency version from git and places to usr/local/bin
    run_cmd "sudo curl -L https://github.com/docker/compose/releases/download/1.23.1/docker-compose-${kernel_name}-${machine_hardware_name} -o /usr/local/bin/docker-compose"
    # Get access rights to docker compose command
    run_cmd 'sudo chmod +x /usr/local/bin/docker-compose'
}


# Runs all appropriate commands to install AWS Cli
install_aws_cli() {
    printf "\nStarting installation of AWS Cli\n"
    # Updates the apt package lists to new packages
    run_cmd 'sudo apt-get update'
    # Fetches all new updates for apt packages
    run_cmd 'sudo apt-get upgrade'
    # Get python 3 if user does not have it for pip
    run_cmd 'sudo apt-get install python3'
    # Install pip so that aws cli can be installed via pip
    run_cmd 'sudo apt-get install python-pip'
    # Finally install awscli via pip
    run_cmd 'pip install awscli --upgrade --user'
    # Link the aws executable to the path since it isn't added there by default
    home=$(echo ~)
    run_cmd "sudo cp $home/.local/bin/aws /usr/local/bin"
}

# Runs all appropriate commands to install Terraform
install_terraform() {
    printf "\nStarting installation of Terraform\n"
    # Updates the apt package lists to new packages
    run_cmd 'sudo apt-get update'
    # Fetches all new updates for apt packages
    run_cmd 'sudo apt-get upgrade'
    # Get unzip if user does not have it to unzip files
    run_cmd 'sudo apt-get install unzip'
    # Get zip file for latest version of terraform
    run_cmd 'wget https://releases.hashicorp.com/terraform/0.11.10/terraform_0.11.10_linux_amd64.zip'
    # Unzip zip file gotten from that
    run_cmd 'unzip terraform_0.11.10_linux_amd64.zip'
    # Link the executable to the path (not done by default)
    run_cmd 'sudo mv terraform /usr/local/bin/'
    # remove zip file
    run_cmd 'rm terraform_0.11.10_linux_amd64.zip'
}

# Calculates script runtime by logging it and outputting either
# in seconds or milliseconds depending on speed
get_runtime() {
    ms=$1
    if (( $ms < 1000 )); then
        log_success "The script took ${ms}ms to run"
    else
        sec=$((ms/1000))
        seclength=${#sec}
        secprecision=${ms:seclength:3}
        secprecision="$(seq -f %03g $secprecision $secprecision)"
        log "\nThe script took ${sec}.${secprecision}s to run"
    fi
}
