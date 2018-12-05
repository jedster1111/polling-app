#!/usr/bin/env groovy

pipeline {

    agent {
        docker {
            image 'jedster1111/pollingappe2e:latest'
            args '-u root'
        }
    }

    environment {
        DEV_URL = "http://127.0.0.1:8000"
        CLIENT_ID = credentials('CLIENT_ID')
    }

    stages {
        stage('Setup') {
            steps {
                echo 'Setting up...'
                sh 'printenv'
                sh 'yarn'
                echo "${env.CLIENT_ID}"
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
                    imageId = sh(returnStdout: true, script: "docker build -t pollingappdev:${GIT_COMMIT} -q -f dockerfiles/pollingapp/Dockerfile .").trim()
                }

                echo "Image has been built with imageId ${imageId}"


                echo "Starting container with imageId: ${imageId}"
                script {
                    containerId = sh(returnStdout: true, script: "docker run --rm -p 127.0.0.1:8000:8000 -d ${imageId}").trim()
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

    }

    post {
        cleanup {
            echo "Stopping and removing container with id ${containerId}"
            sh "docker stop ${containerId}"
            // echo "Removing the built image with Id: ${imageId}"
            // sh "docker rmi -f ${imageId}"
        }
    }
}
