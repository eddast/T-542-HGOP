
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
        sh "cd game-api/ && npm install"
    }
    /**
    * Lint step - checks if code conforms to eslint configured rules
    */
    stage("Lint") {
        sh "cd game-api/ && npm run eslint"
    }
    /**
    * Build step - builds binaries and artifacts (docker image) and pushes to artifact repository
    */
    stage("Build") {
        sh "./scripts/docker_build.sh ${git.GIT_COMMIT}"
        sh "./scripts/docker_push.sh ${git.GIT_COMMIT}"
    }
    /**
    * Test step - runs unit tests for the game-api
    */
    stage("Test") {
        sh "cd game-api/ && npm run test:unit"
        // Use Clover plugin to output coverage results in Jenkins
        step([
            $class: 'CloverPublisher',
            cloverReportDir: 'coverage',
            cloverReportFileName: 'clover.xml',
            healthyTarget: [methodCoverage: 80, conditionalCoverage: 80, statementCoverage: 80],
            unhealthyTarget: [methodCoverage: 50, conditionalCoverage: 50, statementCoverage: 50],
            failingTarget: [methodCoverage: 0, conditionalCoverage: 0, statementCoverage: 0]
        ])
    }

    /* API Test job from free style Jenkins job
     * Conducts api tests in a new deployed instance then destroys instance
     */
    build job: 'gameAPI-api-test', parameters: [[$class: 'StringParameterValue', name: 'GIT_COMMIT', value: "${git.GIT_COMMIT}"]]

    /* Capacity Test job from free style Jenkins job
     * Conducts api tests in a new deployed instance then destroys instance
     */
    build job: 'gameAPI-capacity-test', parameters: [[$class: 'StringParameterValue', name: 'GIT_COMMIT', value: "${git.GIT_COMMIT}"]]


    /* Deployment job from free style Jenkins job */
    build job: 'gameAPI-deployment', parameters: [[$class: 'StringParameterValue', name: 'GIT_COMMIT', value: "${git.GIT_COMMIT}"]]
}
