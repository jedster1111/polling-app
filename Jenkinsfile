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
                sh 'yarn'
            }
        }
        stage('Unit Tests') {
            steps {
                echo 'Testing...'
                sh 'yarn test'
            }
        }
        // stage('E2E setup') {
        //   steps {
        //     echo 'Setting up E2E tests...'
        //     sh 'npm start'
        //   }
        // }
        // stage("E2E tests") {
        //   steps {
        //     echo 'Running E2E tests'
        //     sh 'testcafe "chrome:headless --no-sandbox" testcafe/'
        //   }
        // }
    }
}
