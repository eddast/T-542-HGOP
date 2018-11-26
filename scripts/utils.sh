#!/bin/bash
dir="$(pwd)"
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
    if [ ! -f "$dir/$log_file" ]; then
        $(touch ${log_file})
    fi
    printf "${1}\n" >> "$dir/$log_file"
    printf "${green}${1}${reset}\n"
}

log_error() {
    if [ ! -f "$dir/$log_file" ]; then
        $(touch ${log_file})
    fi
    printf "${1}\n" >> "$dir/$log_file"
    printf "${red}${1}${reset}\n"
}

log() {
    if [ ! -f "$dir/$log_file" ]; then
        $(touch ${log_file})
    fi
    printf "${1}\n" >> "$dir/$log_file"
    printf "${1}\n"
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