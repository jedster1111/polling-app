#!/usr/bin/env groovy

pipeline {

    agent {
        docker {
            image 'jedster1111/pollingappe2e:latest'
            args '-u root'
            alwaysPull 'true'
        }
    }

    environment {
        DEV_URL = "http://127.0.0.1:8000"
        CLIENT_ID = credentials('CLIENT_ID')
        CLIENT_SECRET = credentials('CLIENT_SECRET')
        SECRET_KEY = credentials('SECRET_KEY')
        TEST_USERNAME = credentials('TEST_USERNAME')
        TEST_PASSWORD = credentials('TEST_PASSWORD')
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

        stage("Dev Depoloy") {
            when {
                branch 'development'
            }
            stages {
                stage('Building image') {
                    echo "Building image"
                    script {
                        imageId = sh(returnStdout: true, script: "docker build -t pollingappdev:${GIT_COMMIT} -t pollingappdev:latest -q -f dockerfiles/pollingapp/Dockerfile .").trim()
                    }
                    echo "Finished building image. Tagged as pollingappdev:${GIT_COMMIT} and pollingappdev:latest"
                }

                stage('Stopping pollingappdev container') {
                    sh "docker container inspect <container-name> || docker stop pollingappdev"
                }

                stage('Deploying to dev') {
                    echo 'Deploying commit ${GIT_COMMIT} to dev server'
                    sh "docker run -v /database/dev:/usr/src/app/database -e CLIENT_ID -e CLIENT_SECRET -e SECRET_KEY -e VIRTUAL_HOST=dev.pollingapp.jedthompson.co.uk -e LETSENCRYPT_HOST=dev.pollingapp.jedthompson.co.uk -e LETSENCRYPT_EMAIL=jedster1111@hotmail.co.uk --restart=on-failure --name pollingappdev --rm -d ${imageId}"
                    echo 'Deployment succesful! Should be accessible at dev.pollingapp.jedthompson.co.uk'
                }
            }
        }

    //     stage('E2E setup') {
    //         steps {
    //             echo 'Setting up E2E tests...'

    //             echo "Building this commits image"

    //             script {
    //                 imageId = sh(returnStdout: true, script: "docker build -t pollingappdev:${GIT_COMMIT} -q -f dockerfiles/pollingapp/Dockerfile .").trim()
    //             }

    //             echo "Image has been built with imageId ${imageId}"


    //             echo "Starting container with imageId: ${imageId}"
    //             script {
    //                 containerId = sh(returnStdout: true, script: "docker run -e CLIENT_ID -e CLIENT_SECRET -e SECRET_KEY -e TEST_USERNAME -e TEST_PASSWORD --rm -p 127.0.0.1:8000:8000 -d ${imageId}").trim()
    //             }
    //             echo "containerId is saved with value ${containerId}"
    //         }
    //     }

    //     stage("E2E tests") {
    //       steps {
    //         sh 'testcafe -b'
    //         echo 'Running E2E tests'
    //         sh 'pwd'
    //         sh 'ls'
    //         sh 'testcafe \\"chromium --headless --no-sandbox --disable-gpu --window-size=1920x1080\\" testcafe/'
    //       }
    //     }

    // }

    // post {
    //     cleanup {
    //         echo "Stopping and removing container with id ${containerId}"
    //         sh "docker stop ${containerId}"
    //         // echo "Removing the built image with Id: ${imageId}"
    //         // sh "docker rmi -f ${imageId}"
    //     }
    // }
}
