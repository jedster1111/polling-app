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
                // sh 'printenv'
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

                echo "Building this commits image"

                script {
                    imageId = sh(returnStdout: true, script: "docker build -q -f dockerfiles/pollingapp/Dockerfile .").trim()
                }

                echo "Image has been built with imageId ${imageId}"


                echo "Starting container with imageId: ${imageId}"
                script {
                    containerId = sh(returnStdout: true, script: "docker run --rm -d ${imageId}").trim()
                }
                echo "containerId is saved with value ${containerId}"
            }
        }

        stage("E2E tests") {
          steps {
            echo 'Running E2E tests'
            sh 'testcafe \\"chromium --headless --no-sandbox --disable-gpu --window-size=1920x1080\\" testcafe/'
          }
        }

        post {
            always {
                stage("E2E cleanup") {
                    steps {
                        echo "Stopping and removing container with id ${containerId}"
                        sh "docker stop ${containerId}"
                        echo "Removing the built image with Id: ${imageId}"
                        sh "docker rmi -f ${imageId}"
                    }
                }
            }
        }
    }
}
