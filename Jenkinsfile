#!/usr/bin/env groovy

pipeline {

    agent {
        dockerfile {
            filename 'Dockerfile'
            dir 'dockerfiles/e2e'
            args '-u root'
        }
    }

    stages {
        stage('Setup') {
            steps {
                echo 'Setting up...'
                echo 'Git commit: ${GIT_COMMIT}'
                sh 'yarn'
                // Get the commit that we're working on to be used for tagging later
                // script {
                //     // shortCommit = sh(returnStdout: true, script: "git log -n 1 --pretty=format:'%h'").trim()
                // }
            }
        }
        stage('Unit Tests') {
            steps {
                echo 'Testing...'
                sh 'yarn test'
            }
        }
        stage('E2E setup') {
          steps {
            echo 'Setting up E2E tests...'
            sh "docker build -t pollingappdev:${shortCommit}"
          }
        }
        stage("E2E tests") {
          steps {
            echo 'Running E2E tests'
            sh 'testcafe \\"chromium --headless --no-sandbox --disable-gpu --window-size=1920x1080\\" testcafe/'
          }
        }
    }
}
