pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
    }

    stages {

        stage('Clean Workspace') {
            steps {
                deleteDir()
            }
        }

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Secret Scan - GitLeaks') {
            steps {
                sh '''
                  gitleaks detect \
                    --source="$WORKSPACE" \
                    --no-git \
                    --config="$WORKSPACE/.gitleaks.toml" \
                    --redact
                '''
            }
        }

        stage('Build Secure Docker Image') {
            steps {
                sh 'docker build -t devsecops-app:1.0 ./app'
            }
        }

        stage('Run Application') {
            steps {
                sh 'docker compose -f docker-compose.app.yml up -d'
            }
        }
    }
}

