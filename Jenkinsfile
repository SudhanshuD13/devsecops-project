pipeline {
    agent any

    options {
        timestamps()
        skipDefaultCheckout(true)
    }

    environment {
        IMAGE_NAME = "devsecops-app"
        IMAGE_TAG  = "1.0"
    }

    stages {

        stage('Clean Workspace') {
            steps { deleteDir() }
        }

        stage('Checkout Code') {
            steps { checkout scm }
        }

        stage('Secret Scan - Gitleaks') {
            steps {
                sh '''
                  gitleaks detect \
                    --source="$WORKSPACE" \
                    --no-git \
                    --redact
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                  docker build \
                    -t ${IMAGE_NAME}:${IMAGE_TAG} \
                    ./app
                '''
            }
        }

        stage('Trivy Image Scan (SECURITY GATE)') {
            steps {
                sh '''
                  docker run --rm \
                    -v /var/run/docker.sock:/var/run/docker.sock \
                    aquasec/trivy:latest \
                    image devsecops-app:1.0 \
                    --severity HIGH,CRITICAL \
                    --exit-code 1 \
                    --ignore-unfixed
		    --scanners vuln\
		    --vuln-type os
                '''
            }
        }

        stage('Run Application') {
            steps {
                sh '''
                  docker compose \
                    -f docker-compose.app.yml \
                    up -d --remove-orphans
                '''
            }
        }

        stage('Generate SBOM') {
            steps {
                sh '''
                  docker run --rm \
                    -v /var/run/docker.sock:/var/run/docker.sock \
                    anchore/syft \
                    ${IMAGE_NAME}:${IMAGE_TAG} \
                    -o json > sbom.json
                '''
                archiveArtifacts artifacts: 'sbom.json'
            }
        }
    }

    post {
        success {
            echo "✅ PIPELINE SUCCESS — RUNTIME IMAGE SECURE"
        }
        failure {
            echo "❌ PIPELINE FAILED — REAL IMAGE VULNERABILITY"
        }
    }
}
