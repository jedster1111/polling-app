#!/usr/bin/env groovy

pipeline {

    agent {
        docker {
            image 'geekykaran/headless-chrome-node-docker'
            args '-u root'
        }
    }

    stages {
        stage('Setup') {
            steps {
                echo 'Setting up...'
                sh 'npm install -g testcafe'
                sh 'npm install'
            }
        }
        stage('Unit Tests') {
            steps {
                echo 'Testing...'
                sh 'npm test'
            }
        }
        stage('E2E setup') {
          steps {
            echo 'Setting up E2E tests...'
            sh 'npm build'
            sh 'npm run start:prod'
          }
        }
        stage("E2E tests") {
          steps {
            echo 'Running E2E tests'
            sh 'testcafe "chrome:headless --no-sandbox" testcafe/'
          }
        }
    }
}
