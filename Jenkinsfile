#!/usr/bin/env groovy

// docker inspect e1a2a16cab23 | grep IPAddress |  grep -v '""' | grep -v null | cut -d '"' -f 4

pipeline {

    agent {
        docker {
            image 'jedster1111/pollingappe2e:latest'
            args '-u root'
            alwaysPull 'true'
        }
    }

    environment {
        GITHUB_CLIENT_ID = credentials('DEV_GITHUB_CLIENT_ID')
        GITHUB_CLIENT_SECRET = credentials('DEV_GITHUB_CLIENT_SECRET')
        GOOGLE_CLIENT_ID = credentials('GOOGLE_CLIENT_ID')
        GOOGLE_CLIENT_SECRET = credentials('GOOGLE_CLIENT_SECRET')
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
                    imageId = sh(returnStdout: true, script: "docker build -t jedster1111/pollingapp:${GIT_COMMIT} -t jedster1111/pollingapp:latest -q -f dockerfiles/pollingapp/Dockerfile .").trim()
                }
                echo "Finished building image. Tagged as pollingappdev:${GIT_COMMIT} and pollingappdev:latest"
            }
        }

        stage("Dev Deploy") {
            when {
                branch 'development'
            }
            options {
                lock('devServer')
            }
            
            stages {
                stage('Stopping pollingappdev container') {
                    when {
                        not {
                            expression {
                                sh(returnStdout: true, script: 'docker container ls --all -f name=pollingappdev --format "{{.ID}}"').trim() == ""
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
                    environment {
                        DEV_URL = 'https://dev.pollingapp.jedthompson.co.uk'
                    }
                    steps {
                        echo "Deploying commit ${GIT_COMMIT} to dev server"
                        sh "docker run -v /database/dev:/usr/src/app/database -e DEV_GITHUB_CLIENT_ID -e DEV_GITHUB_CLIENT_SECRET -e GOOGLE_CLIENT_ID -e GOOGLE_CLIENT_SECRET -e SECRET_KEY -e VIRTUAL_HOST=dev.pollingapp.jedthompson.co.uk -e LETSENCRYPT_HOST=dev.pollingapp.jedthompson.co.uk -e LETSENCRYPT_EMAIL=jedster1111@hotmail.co.uk -e POLLING_APP_URL=${DEV_URL} --restart=on-failure --name pollingappdev --net docker-compose_default -d ${imageId}"
                        echo 'Deployment succesful! Should be accessible at dev.pollingapp.jedthompson.co.uk'
                    }
                }

                stage("E2E tests") {
                    environment {
                        TESTCAFE_URL = 'https://dev.pollingapp.jedthompson.co.uk'
                    }
                    steps {
                        echo 'Running   E2E tests'
                        sh 'testcafe \"chromium --headless --no-sandbox --disable-gpu --window-size=1920x1080\" testcafe/'
                    }
                }
            }
        }

        stage ('Prod deploy') {
            environment {
                DOCKERHUB_CREDS = credentials('DOCKERHUB_CREDS')
                GITHUB_CLIENT_ID = credentials('PROD_GITHUB_CLIENT_ID')
                GITHUB_CLIENT_SECRET = credentials('PROD_GITHUB_CLIENT_SECRET')
                GOOGLE_CLIENT_ID = credentials('GOOGLE_CLIENT_ID')
                GOOGLE_CLIENT_SECRET = credentials('GOOGLE_CLIENT_SECRET')
                POLLING_APP_URL = 'https://pollingapp.jedthompson.co.uk'
            }
            when {
                beforeInput true
                branch 'master'
            }
            input {
                message 'Should we deploy to production?'
            }
            stages {
                stage('Tagging and pushing images to jedster1111/pollingapp:release') {
                    steps {
                        sh "docker login -u ${DOCKERHUB_CREDS_USR} -p ${DOCKERHUB_CREDS_PSW}"
                        sh "docker tag ${imageId} jedster1111/pollingapp:release"
                        sh 'docker push jedster1111/pollingapp:release'
                    }
                }
                stage('Stopping and restarting pollingApp container') {
                    stages {
                        stage ('Stopping existing pollingapp container') {
                            when {
                                not {
                                    expression {
                                        sh(returnStdout: true, script: 'docker container ls --all -f name=pollingapp --format "{{.ID}}"').trim() == ""
                                    }
                                }
                            }
                            steps {
                                sh 'docker stop pollingapp'
                                sh 'docker rm pollingapp'
                            }
                        }

                        stage ('Starting up polling app production container') {
                            steps {
                                sh 'docker-compose -f /docker-compose/docker-compose.yml up -d'        
                            }
                        }
                    }
                }
            }
        }
    }
}
