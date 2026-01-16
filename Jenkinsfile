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
                gitleaks detect \
                  --source="$WORKSPACE" \
                  --no-git \
                  --config="$WORKSPACE"/.gitleaks.toml \
                  --redact
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t devsecops-app:1.0 ./app'
            }
        }
        stage('Image Scan - Trivy') {
	    steps {
		 echo 'Scanning Docker image for vulnerabilities using Trivy'
		 sh '''
         		 docker run --rm \
           		 -v /var/run/docker.sock:/var/run/docker.sock \
           		 aquasec/trivy:latest image \
           		 --severity HIGH,CRITICAL \
           		 --exit-code 1 \
           		 devsecops-app:1.0
       		 '''
   	    }
	}

        stage('Run Application') {
            steps {
                sh 'docker compose -f docker-compose.app.yml up -d'
            }
        }
    }
}

