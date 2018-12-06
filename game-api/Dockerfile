# Fetching nodeJS image for container to run application
FROM node:dubnium

# Configure the working directory within the container
WORKDIR /code

# Copy all local repository files to container, necessary to run application
# Copy command omits the files specified in .dockerignore file
# (e.g. unit tests, config files, node modules and such)
COPY . .

# Runs npm install command to install application dependencies
RUN npm install --production

# Start application within container using nodeJS image
# (There can only be one CMD per Dockerfile, used specifically to run application) 
CMD node app.js
