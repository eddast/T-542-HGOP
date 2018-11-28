#!/bin/bash

#########################################################################################
# DEPLOY.SH:                                                                            #
#   Script that initializes or reinitializes instance of application using Terraform    #
#   Destroying any running Terraform managed instances in the process                   #
#########################################################################################

printf "[STARTED DEPLOYING NEW TERRAFORM INSTANCE...]\n"

## CHECK FOR NECESSARY FILES

# Check if infrastructure file exist
# if not output error and we cannot deploy
if [ ! -f "infrastructure.tf" ]; then
    printf "ERROR: infrastructure.tf not present in current directory, cannot deploy\n"
    printf "Make sure you run deploy script within correct directory and infrastructure.tf file is present\n"
    exit 1
fi

# Check if docker compose file exist
# if not output error and we cannot deploy
if [ ! -f "docker-compose.yml" ]; then
    printf "ERROR: docker-compose.yml not present in current directory, cannot deploy\n"
    printf "Make sure you run deploy script within correct directory and docker-compose.yml file is present\n"
    exit 1
fi

# Check if keyfile exists
# if not output error and we cannot deploy
home=$(echo ~)
if [ ! -f "${home}/.aws/GameKeyPair.pem" ]; then
    printf "ERROR: No GameKeyPair.pem file found in location ~/.aws, cannot deploy\n"
    exit 1
fi

# Check if initialization script for application exist
# if not output error and we cannot deploy
if [ ! -f "./scripts/initialize_game_api_instance.sh" ]; then
    printf "ERROR: initialize_game_api_instance.sh not in ./scripts folder, cannot deploy\n"
    printf "Make sure you run deploy script within correct directory and that initialization script is present\n"
    exit 1
fi

# Destroys any running Terraform managed instances
# Do not prompt user for approval using auto approve flag
printf "[DESTROYING PREVIOUS TERRAFORM-MANAGED INSTANCES...]\n"
terraform destroy -auto-approve
printf "[PREVIOUS TERRAFORM-MANAGED INSTANCES DESTROYED]\n"

# Initialize a new instance using Terraform
printf "[CREATING NEW INSTANCE...]\n"
terraform init
printf "[NEW INSTANCE CREATED!]\n"

# Deploy the new instance
# Do not prompt user for approval using auto approve flag
printf "[DEPLOYING NEW INSTANCE...]\n"
terraform apply -auto-approve
printf "[NEW INSTANCE DEPLOYED!]\n"

# Run the initialization script on the new instance
# Make sure you have access right to .pem file to access instance
printf "[RUNNING INITIALIZEATION SCRIPT OF INSTANCE...]\n"
chmod 400 ~/.aws/GameKeyPair.pem
ssh -o StrictHostKeyChecking=no -i "~/.aws/GameKeyPair.pem" ubuntu@$(terraform output public_ip) "./initialize_game_api_instance.sh"
printf "[RAN INITIALIZEATION SCRIPT OF INSTANCE!]\n"
printf "[DEPLOY COMPLETE!]\n"