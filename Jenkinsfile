pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
    }

    stages {

        stage('Clean Workspace') {
            steps {
                echo 'Cleaning Jenkins workspace'
                deleteDir()
            }
        }

        stage('Checkout Code') {
            steps {
                echo 'Cloning source code'
                checkout scm
            }
        }

        stage('Secret Scan - GitLeaks') {
            steps {
                echo 'Scanning repository for secrets using GitLeaks'
                sh '''
                docker run --rm \
                  -v "$WORKSPACE:/repo" \
                  zricethezav/gitleaks:latest \
                  detect \
                  --source=/repo \
                  --no-git \
                  --config=/repo/.gitleaks.toml \
                  --redact
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t devsecops-app:1.0 ./app'
            }
        }

        stage('Run Application') {
            steps {
                sh 'docker-compose -f docker-compose.app.yml up -d'
            }
        }
    }
}

