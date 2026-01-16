pipeline {
    agent any

    stages {

        stage('Checkout Code') {
            steps {
                echo 'Cloning source code'
                checkout scm
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
                sh 'docker compose up -d'
            }
        }
    }
}
