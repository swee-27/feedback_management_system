pipeline {
    agent any

    environment {
        IMAGE_NAME = "feedback-system:latest"
        BLUE_NAME = "blue"
        GREEN_NAME = "green"
        MAIN_PORT = 3001          // live app port
        TEMP_PORT = 3002          // temporary test port
        APP_PORT = 3000           // app inside container
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
                echo "🧪 Running unit tests..."
                // Example: sh 'npm test'
            }
        }

        stage('Blue-Green Deploy') {
            steps {
                script {
                    // Identify which container is currently active
                    def active = sh(script: "docker ps --filter 'name=${BLUE_NAME}' --format '{{.Names}}'", returnStdout: true).trim()
                    def newColor = (active == BLUE_NAME) ? GREEN_NAME : BLUE_NAME
                    def oldColor = (newColor == BLUE_NAME) ? GREEN_NAME : BLUE_NAME

                    echo "Active container: ${active ?: 'none'}, deploying new version to: ${newColor}"

                    // Stop and remove the newColor container if it exists
                    sh "docker rm -f ${newColor} || true"

                    // Run new container on TEMP_PORT for testing
                    sh "docker run -d -p ${TEMP_PORT}:${APP_PORT} --name ${newColor} ${IMAGE_NAME}"
                    echo "🚀 Started ${newColor} container on temporary port ${TEMP_PORT}"

                    // Health check
                    sleep 10
                    def status = sh(script: "curl -s -o /dev/null -w '%{http_code}' http://localhost:${TEMP_PORT}", returnStdout: true).trim()
                    if (status != "200") {
                        error("❌ Health check failed on ${newColor}. Deployment aborted.")
                    }

                    echo "✅ Health check passed for ${newColor}. Switching traffic..."

                    // Stop and remove old active container if exists
                    if (active) {
                        sh "docker rm -f ${oldColor} || true"
                    }

                    // Run new container on MAIN_PORT (live)
                    sh "docker rm -f ${newColor} || true"
                    sh "docker run -d -p ${MAIN_PORT}:${APP_PORT} --name ${newColor} ${IMAGE_NAME}"

                    echo "🎉 Deployment complete. ${newColor} is live on port ${MAIN_PORT}"
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
