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
                sh 'printenv | sort'
                echo 'Installing node dependencies'
                sh 'yarn'
                echo "${env.CLIENT_ID}"
            }
        }

        stage('Unit Tests') {
            steps {
                echo 'Testing...'
                sh 'yarn test'
            }
        }

        stage('Building image') {
            steps {
                echo "Building image"
                script {
                    imageId = sh(returnStdout: true, script: "docker build -t pollingappdev:${GIT_COMMIT} -t pollingappdev:latest -q -f dockerfiles/pollingapp/Dockerfile .").trim()
                }
                echo "Finished building image. Tagged as pollingappdev:${GIT_COMMIT} and pollingappdev:latest"
            }
        }

        stage('E2E setup') {
            steps {
                echo "Starting container with imageId: ${imageId}"
                script {
                    containerId = sh(returnStdout: true, script: "docker run -e CLIENT_ID -e CLIENT_SECRET -e SECRET_KEY -e TEST_USERNAME -e TEST_PASSWORD --rm -d ${imageId}").trim()
                }
                echo "containerId is saved with value ${containerId}"
            }
        }

        stage("Wait") {
            input {
                message 'Wait so I can play around...'
            }
        }

        stage("E2E tests") {
          steps {
            sh 'testcafe -b'
            echo 'Running E2E tests'
            sh 'pwd'
            sh 'ls'
            sh 'testcafe \\"chromium --headless --no-sandbox --disable-gpu --window-size=1920x1080\\" testcafe/tests/helloWorld.test.ts'
          }
        }

        stage("Dev Deploy") {
            when {
                branch 'development'
            }
            input {
              message 'Deploy to dev server? This will stop and replace the existing server if one is running.'
            }
            stages {
                stage('Stopping pollingappdev container') {
                    when {
                        not {
                            expression {
                                sh(returnStdout: true, script: 'docker ps -f name=pollingappdev --format \\"{{.ID}}\\"').trim() == ""
                            }
                        }
                    }
                    steps {
                        echo 'Container exists so we need to stop it...'
                        sh 'docker stop pollingappdev'
                        sh 'docker rm pollingappdev'
                    }
                }

                stage('Deploying to dev') {
                    steps {
                        echo 'Deploying commit ${GIT_COMMIT} to dev server'
                        sh "docker run -v /database/dev:/usr/src/app/database -e CLIENT_ID -e CLIENT_SECRET -e SECRET_KEY -e VIRTUAL_HOST=dev.pollingapp.jedthompson.co.uk -e LETSENCRYPT_HOST=dev.pollingapp.jedthompson.co.uk -e LETSENCRYPT_EMAIL=jedster1111@hotmail.co.uk --restart=on-failure --name pollingappdev --net docker-compose_default -d ${imageId}"
                        echo 'Deployment succesful! Should be accessible at dev.pollingapp.jedthompson.co.uk'
                    }
                }
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
