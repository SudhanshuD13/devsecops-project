pipeline {
    agent any

    stages {

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
         	 detect --source=/repo --no-git --config=/repo/.gitleaks.toml --redact
       		 '''
   		 }
	}
        stage('Build Docker Image') {
            steps {
                echo 'Building application Docker image'
                sh 'docker build -t devsecops-app:1.0 ./app'
            }
        }

        stage('Run Application') {
            steps {
                echo 'Running application using docker-compose'
                sh 'docker-compose -f docker-compose.app.yml up -d'
            }
        }
    }
}
