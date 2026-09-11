// =============================================================================
// Jenkinsfile - Declarative pipeline for the Playwright + Cucumber BDD framework.
//
// Requires the following Jenkins configuration:
//   * NodeJS plugin with a tool named "node20"
//   * Credentials (id: "saucedemo") with username + password (secret text)
//     containing the test application credentials
//   * Optional: Allure Jenkins plugin (id: "allure") - report publishing is
//     skipped gracefully if the plugin is unavailable
//
// Triggered via parameters; also installable as a Multibranch Pipeline where
// TEST_TAG/ENV come from branch or build parameters.
// =============================================================================

pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
    timeout(time: 45, unit: 'MINUTES')
    buildDiscarder(logRotator(numToKeepStr: '20'))
  }

  parameters {
    choice(
      name: 'TEST_TAG',
      choices: ['all', 'smoke', 'sanity', 'critical', 'regression'],
      description: 'Cucumber tag filter to run (all = no tag filter)'
    )
    choice(
      name: 'ENV',
      choices: ['qa', 'dev', 'stage', 'prod'],
      description: 'Target environment'
    )
    string(
      name: 'WORKERS',
      defaultValue: '4',
      description: 'Number of parallel Cucumber workers'
    )
  }

  environment {
    ENV = "${params.ENV}"
    WORKERS = "${params.WORKERS}"
    HEADLESS = 'true'
    TRACE = 'on-first-retry'
    SCREENSHOT = 'only-on-failure'
    // Repository root used by the report/artifact steps below.
    REPORTS_DIR = "${WORKSPACE}/reports"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Setup') {
      steps {
        nodejs('node20') {
          sh 'npm ci'
          sh 'npx playwright install --with-deps chromium'
        }
      }
    }

    stage('Prepare environment') {
      steps {
        withCredentials([
          usernamePassword(
            credentialsId: 'saucedemo',
            usernameVariable: 'USERNAME',
            passwordVariable: 'PASSWORD'
          )
        ]) {
          sh 'bash scripts/ci/prepare-env.sh'
        }
      }
    }

    stage('Run Cucumber suite') {
      steps {
        nodejs('node20') {
          sh 'bash scripts/ci/run-tests.sh "${TEST_TAG}"'
        }
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'reports/cucumber-report/**, reports/allure-results/**', allowEmptyArchive: true
      archiveArtifacts artifacts: 'reports/artifacts/**', allowEmptyArchive: true, onlyIfSuccessful: false

      // Publish an Allure report if the Allure Jenkins plugin is installed.
      // Wrapped in a try/catch so the build does not fail on agents without it.
      script {
        try {
          allure([
            includeProperties: false,
            jdk: '',
            properties: [],
            reportBuildPolicy: 'ALWAYS',
            results: [[path: 'reports/allure-results']]
          ])
        } catch (Exception e) {
          echo "Allure plugin unavailable - skipping report publish (${e.getMessage()})."
        }
      }
    }
    success {
      echo 'Cucumber BDD suite completed successfully.'
    }
    failure {
      echo 'Cucumber BDD suite FAILED - see report artifacts above.'
    }
  }
}
