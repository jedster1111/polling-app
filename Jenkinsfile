#!/usr/bin/env groovy

pipeline {

    agent {
        docker {
            image 'node'
            args '-u root'
        }
    }

    stages {
        stage('Setup') {
            steps {
                echo 'Seting up...'
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
        stage("E2E tests") {
          steps {
            sh 'testcafe "chrome:headless" testcafe/'
          }
        }
    }
}