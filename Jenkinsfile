
node {
    def git = checkout scm
    /**
    * Clean step - keeps files from git repository but removes everything else from workspace
    */
    stage("Clean") {
        echo 'I solemnly swear that I know not to run this without committing changes I want to keep!'
        sh "git clean -dfxq"
        sh "git stash"
    }
    /**
    * Setup step - installs required dependencies for application
    */
    stage("Setup") {
        sh "npm install game-api/"
    }
    /**
    * Build step - builds binaries and artifacts (docker image) and pushes to artifact repository
    */
    stage("Build") {
        sh "./scripts/docker_build.sh ${git.GIT_COMMIT}"
        sh "./scripts/docker_push.sh ${git.GIT_COMMIT}"
    }
}
