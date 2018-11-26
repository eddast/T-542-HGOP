#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
log_file="report.log"
err_file="script-error.log"
red=`tput setaf 1`
green=`tput setaf 2`
reset=`tput sgr0`

program_exists() {
    if [ $(type -P $1) ]; then
        return 0
    else
        return 1
    fi
}

log_success() {
    if [ ! -f "$DIR/$log_file" ]; then
        $(touch $DIR/$log_file)
    fi
    printf "${1}\n" >> "$DIR/$log_file"
    printf "${green}${1}${reset}\n"
}

log_error() {
    if [ ! -f "$DIR/$log_file" ]; then
        $(touch $DIR/$log_file)
    fi
    printf "${1}\n" >> "$DIR/$log_file"
    printf "${red}${1}${reset}\n"
}

log() {
    if [ ! -f "$DIR/$log_file" ]; then
        $(touch $DIR/$log_file)
    fi
    printf "${1}\n" >> "$DIR/$log_file"
    printf "${1}\n"
}

log_upgrade_install_error() {
    if [ ! -f "$dir/$err_file" ]; then
        $(touch ${err_file})
    fi
    printf "[At `date +%d/%m/%Y\ %H:%M:%S`]: ${1}\n" >> "$dir/$err_file"
}

run_cmd() {
    output=$( $1 | tee /dev/tty)
    if [ $? -ne 0 ]; then
        log_upgrade_install_error "$output\n\n"
    fi
}

get_runtime() {
    ms=$1
    if (( $ms < 1000 )); then
        log_success "The script took ${ms}ms to run"
    else
        sec=$((ms/1000))
        seclength=${#sec}
        secprecision=${ms:seclength:3}
        secprecision="$(seq -f %03g $secprecision $secprecision)"
        log "The script took ${sec}.${secprecision}s to run"
    fi
}

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