# Fetching node image for container to be able to use node/npm to run application
FROM node:latest

# Global install yarn package manager
RUN apt-get update && apt-get install -y curl apt-transport-https && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && apt-get install -y yarn
RUN yarn global add parcel-bundler

# Configure the working directory within the container
WORKDIR /code

# Copy package.json to container, then install frontend client via npm
COPY package.json package.json
RUN yarn install

# Copy all local repository files to container, necessary to run application
# Note that copy command omits the files specified in .dockerignore file
COPY . .

# Make the directory if it doesn't exist
RUN mkdir -p dist

# Start up frontend using npm
CMD ["yarn", "start"]
