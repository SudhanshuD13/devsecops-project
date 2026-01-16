pipeline {
    agent any

    options {
        timestamps()
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

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t devsecops-app:1.0 ./app'
            }
        }

        stage('Trivy Image Scan (OS ONLY – SECURITY GATE)') {
            steps {
                sh '''
                  docker run --rm \
                    -v /var/run/docker.sock:/var/run/docker.sock \
                    aquasec/trivy:latest \
                    image devsecops-app:1.0 \
                    --severity HIGH,CRITICAL \
                    --exit-code 1 \
                    --ignore-unfixed \
                    --scanners vuln \
                    --vuln-type os
                '''
            }
        }

        stage('Run Application') {
            steps {
                sh 'docker compose -f docker-compose.app.yml up -d'
            }
        }

        stage('Generate SBOM') {
            steps {
                sh '''
                  docker run --rm \
                    -v /var/run/docker.sock:/var/run/docker.sock \
                    anchore/syft devsecops-app:1.0 -o json > sbom.json
                '''
                archiveArtifacts artifacts: 'sbom.json'
            }
        }
    }

    post {
        success {
            echo '✅ PIPELINE PASSED — IMAGE IS SECURE'
        }
        failure {
            echo '❌ PIPELINE FAILED — SECURITY GATE BLOCKED'
        }
    }
}
