pipeline {
  agent any
  environment {
    AWS_REGION = credentials('aws-region-text')
    AWS_ACCESS_KEY_ID = credentials('aws-access-key-id')
    AWS_SECRET_ACCESS_KEY = credentials('aws-secret-access-key')
    ECR_ACCOUNT_ID = credentials('aws-account-id-text')
    ECR_REPO = 'webapp-ecs-cicd'
    IMAGE_TAG = "${env.BUILD_NUMBER}"
    APP_VERSION = "${env.BUILD_NUMBER}"
    SONAR_HOST_URL = credentials('sonar-host-url')
    SONAR_TOKEN = credentials('sonar-token')
    CD_APP = 'WebAppEcsApp'
    CD_DG  = 'WebAppEcsDG'
    ECS_CLUSTER = 'webapp-ecs'
    ECS_SERVICE = 'webapp-svc'
  }
  stages {
    stage('Checkout'){steps{checkout scm}}
    stage('Node Build & Unit Tests'){steps{dir('app'){sh 'npm ci && npm test'}}}
    stage('SonarQube Scan'){steps{sh "npx sonar-scanner -Dsonar.host.url=$SONAR_HOST_URL -Dsonar.login=$SONAR_TOKEN"}}
    stage('Build Image'){steps{sh "docker build -t $ECR_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:$IMAGE_TAG ."}}
    stage('Security Scan (Trivy FS)'){steps{sh "scripts/trivy_fs.sh"}}
    stage('Login & Push to ECR'){steps{sh "scripts/ecr_login.sh && docker push $ECR_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:$IMAGE_TAG"}}
    stage('Security Scan (Trivy Image)'){steps{sh "scripts/trivy_image.sh $ECR_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:$IMAGE_TAG"}}
    stage('Blue-Green Deploy'){steps{sh "APP_VERSION=$APP_VERSION IMAGE=$ECR_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:$IMAGE_TAG scripts/deploy_blue_green.sh"}}
  }
}