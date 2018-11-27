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
err_file="script-error.log"

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

# Logs explicit error message from terminal output on error on install or upgrade of programs
# Uses red to indicate error
# $1 the error message
log_upgrade_install_error() {
    if [ ! -f "$dir/$err_file" ]; then
        $(touch $dir/$err_file)
    fi
    printf "[At `date +%d/%m/%Y\ %H:%M:%S`]: ${1}\n" >> "$dir/$err_file"
}

# Runs a command and checks if it failed.
# If the command failed it is logged to an error file ./script-error.log and outputted
run_cmd() {
    output=$( $1 | tee /dev/tty)
    if [ $? -ne 0 ]; then
        log_upgrade_install_error "$output\n\n"
    fi
}

# Compares if versions of programs are equal
compare_versions() {
    if [[ $1 == $2 ]]; then
        echo 0
        return
    fi
    local i ver1=($1) ver2=($2)
    # fill empty fields in ver1 with zeros
    for ((i=${#ver1[@]}; i<${#ver2[@]}; i++))
    do
        ver1[i]=0
    done
    for ((i=0; i<${#ver1[@]}; i++))
    do
        if [[ -z ${ver2[i]} ]]
        then
            # fill empty fields in ver2 with zeros
            ver2[i]=0
        fi
        if [[ ${ver1:$i:1} -ge ${ver2:$i:1} ]]
        then
            echo 1
            return
        fi
        if [[ ${ver1:$i:1} -le ${ver2:$i:1} ]]
        then
            echo 2
            return
        fi
    done
    echo 0
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
