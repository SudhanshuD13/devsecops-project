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
        stage('Trivy Image Scan') {
	    steps {
       		 sh '''
        	  trivy image devsecops-app:1.0 \
           	   --severity HIGH,CRITICAL \
           	   --exit-code 1
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
}

