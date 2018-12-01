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
                echo 'Setting up...'
                sh 'npm install -g testcafe'
                sh 'npm install'
                sh 'wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb'
                sh 'sudo dpkg -i --force-depends google-chrome-stable_current_amd64.deb'
                sh 'sudo apt-get install -f'
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