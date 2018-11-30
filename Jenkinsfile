#!/usr/bin/env groovy

pipeline {

    agent {
        docker {
            image 'node'
            args '-u root'
        }
    }


    stages {
        stage('Prepare') {
            steps {
                echo 'Installing yarn...'
                sh "npm instsall -g yarn"
                sh "yarn install"
            }
        }
        stage('Build') {
            steps {
                echo 'Building...'
                sh 'yarn install -g yarn'
                sh 'yarn install'
            }
        }
        stage('Unit Tests') {
            steps {
                echo 'Testing...'
                sh 'yarn test'
            }
        }
    }
}