pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Docker Image') {
      steps {
        script {
          sh 'docker build -t feedback-system:latest .'
        }
      }
    }

    stage('Run Container') {
      steps {
        script {
          // Stop old container if running (avoid conflict)
          sh 'docker rm -f feedback-system-container || true'

          // Run new container in detached mode
          sh 'docker run -d -p 3000:3000 --name feedback-system-container feedback-system:latest'
        }
      }
    }

    stage('Run Unit Tests') {
      steps {
        sh 'echo "Running tests..."'
        // Example: sh 'npm test'
      }
    }
  }

  post {
    success {
      echo '✅ Build and deployment succeeded!'
    }
    failure {
      echo '❌ Build failed!'
    }
  }
}