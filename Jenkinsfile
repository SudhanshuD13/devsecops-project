pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
    }

    stages {

        stage('Clean Workspace') {
            steps {
                echo 'Cleaning workspace'
                deleteDir()
            }
        }

        stage('Checkout Code') {
            steps {
                echo 'Checking out source code'
                checkout scm
            }
        }

        stage('Secret Scan - GitLeaks') {
            steps {
                echo 'Running GitLeaks secret scan'
                sh '''
                  gitleaks detect \
                    --source="$WORKSPACE" \
                    --no-git \
                    --config="$WORKSPACE/.gitleaks.toml" \
                    --redact
                '''
            }
        }

        stage('Install Node Dependencies') {
            steps {
                echo 'Installing production dependencies'
                dir('app') {
                    sh '''
                      rm -rf node_modules
                      npm ci --only=production
                    '''
                }
            }
        }

        stage('Trivy Dependency Scan') {
            steps {
                echo 'Running Trivy filesystem scan'
                dir('app') {
                    sh '''
                      trivy fs . \
                        --scanners vuln \
                        --severity HIGH,CRITICAL \
                        --exit-code 1
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image'
                sh 'docker build -t devsecops-app:1.0 ./app'
            }
        }

        stage('Run Application') {
            steps {
                echo 'Running application via docker compose'
                sh 'docker compose -f docker-compose.app.yml up -d'
            }
        }
    }

    post {
        success {
            echo '✅ PIPELINE SUCCESSFUL'
        }
        failure {
            echo '❌ PIPELINE FAILED'
        }
    }
}

