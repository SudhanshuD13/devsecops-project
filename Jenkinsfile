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
        
        stage('SAST - SonarQube') {
	    environment {
        	SONAR_TOKEN = credentials('sonar-token')
	    } 
   	    steps {
       		 sh '''
         	  docker run --rm \
           	   -e SONAR_HOST_URL=http://host.docker.internal:9000 \
           	   -e SONAR_LOGIN=$SONAR_TOKEN \
           	   -v "$WORKSPACE:/usr/src" \
           	   sonarsource/sonar-scanner-cli \
           	   -Dsonar.projectKey=devsecops-project \
           	   -Dsonar.sources=.
       		 '''
   	     }
	}
        
        stage('Quality Gate') {
    steps {
        sleep 10
        sh '''
          STATUS=$(curl -s -u $SONAR_TOKEN: \
          "http://host.docker.internal:9000/api/qualitygates/project_status?projectKey=devsecops-project" \
          | jq -r '.projectStatus.status')

          if [ "$STATUS" != "OK" ]; then
            echo "❌ Quality Gate Failed"
            exit 1
          fi
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
