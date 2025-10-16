pipeline {
  agent any
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Build Docker Image') {
      steps {
        script {
          sh 'docker build -t feedback-system:latest .'
        }
      }
    }
    stage('Run Unit Tests') {
      steps {
        sh 'echo "Running tests..."'
        // add your test command here, e.g. npm test
      }
    }
  }
  post {
    success { echo 'Build succeeded!' }
    failure { echo 'Build failed!' }
  }
}