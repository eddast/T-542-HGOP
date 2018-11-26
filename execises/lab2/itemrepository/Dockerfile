# Fetching nodeJS image for container to run application
FROM node:dubnium

# Configure the working directory within the container
WORKDIR /code

# Copy following local files to container, necessary to run application
COPY package.json package.json
COPY database.js database.js
COPY app.js app.js

# Runs npm install command to install application dependencies
RUN npm install

# Start application within container using nodeJS image
# (There can only be one CMD per Dockerfile, used specifically to run application) 
CMD node app.js
