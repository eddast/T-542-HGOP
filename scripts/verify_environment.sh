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
#   log_success():      logs to ./report.log and outputs to command line on success defined by green color
#   log_error():        logs to ./report.log and outputs to command line on error defined by red color
#   log():              logs to ./report.log and outputs to command line some neutral information
#   get_runtime():      calculates and logs to ./report.log total runtime script took
source "$(pwd)/utils.sh"
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
    start_date="`date +%d/%m/%Y\ %H:%M:%S`"
    start=`echo $(($(date +%s%N)/1000000))`
    log "\n========================================"
    log "[$start_date]: verification script started execution"
    printf "\n"

    ### TODO CHECK USER OS
    
    ### TODO CHECK NODE

    ### TODO CHECK NPM

    ### TODO CHECK GIT

    ### TODO CHECK YARN

    end_date="`date +%d/%m/%Y\ %H:%M:%S`"
    end=`echo $(($(date +%s%N)/1000000))`
    ms=$((end-start))
    get_runtime $ms
    log "[$end_date]: Script stopped execution"
    log "========================================\n"
else
    printf "${red}Environment verification script exiting\n\n${reset}"
fi