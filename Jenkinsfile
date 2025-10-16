pipeline {
    agent any

    environment {
        IMAGE_NAME = "feedback-system:latest"
        BLUE_NAME = "blue"
        GREEN_NAME = "green"
        APP_PORT = 3000
        TEMP_PORT = 3001
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${IMAGE_NAME} ."
                }
            }
        }

        stage('Run Unit Tests') {
            steps {
                sh 'echo "Running unit tests..."'
                // Example: sh 'npm test'
            }
        }

        stage('Blue-Green Deploy') {
            steps {
                script {
                    // Determine which container is active
                    def active = sh(script: "docker ps --filter 'name=${BLUE_NAME}' --format '{{.Names}}'", returnStdout: true).trim()
                    def inactive = active == BLUE_NAME ? GREEN_NAME : BLUE_NAME
                    def oldContainer = active ?: BLUE_NAME  // If no active, default to blue

                    echo "Active container: ${active ?: 'none'}, Deploying to: ${inactive}"

                    // Remove old inactive container if exists
                    sh "docker rm -f ${inactive} || true"

                    // Run new version on temporary port
                    sh "docker run -d -p ${TEMP_PORT}:${APP_PORT} --name ${inactive} ${IMAGE_NAME}"

                    // Wait and perform simple health check
                    sleep 10
                    def status = sh(script: "curl -s -o /dev/null -w '%{http_code}' http://localhost:${TEMP_PORT}", returnStdout: true).trim()
                    if (status != "200") {
                        error("🚨 Health check failed. Deployment aborted.")
                    }

                    // Stop old container if exists
                    if (active) {
                        sh "docker stop ${oldContainer} || true"
                        sh "docker rm -f ${oldContainer} || true"
                    }

                    // Swap new container to main port
                    sh "docker run -d -p ${APP_PORT}:${APP_PORT} --name ${inactive} ${IMAGE_NAME}"
                    echo "✅ Blue-Green deployment complete. ${inactive} is now live on port ${APP_PORT}"
                }
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline succeeded'
        }
        failure {
            echo '❌ Pipeline failed'
        }
    }
}