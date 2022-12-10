terraform {
  required_providers {
    checkly = {
      source = "checkly/checkly"
      version = "~> 1.0"
    }
  }
}

variable "checkly_api_key" {}
variable "checkly_account_id" {}

provider "checkly" {
  api_key = var.checkly_api_key
  account_id = var.checkly_account_id
}

resource "checkly_check_group" "frontend" {
  name      = "Frontend"  // The name of the group
  activated = true              // Whether the group will start as active on creation
  muted     = false             // Whether the group will start as muted on creation

  locations = [                 // Which locations the check should run from (if not in a group)
    "eu-west-1",
    "eu-central-1"
  ]

  concurrency               = 3     // How many checks to run at once when triggering the group using CI/CD triggers
  double_check              = true  // Whether to re-run a failed check from a different location
  use_global_alert_settings = false // Whether to use global alert settings or group-specific ones
}

resource "checkly_snippet" "get-base-url" {
  name   = "Login"
  script = file("${path.module}/browser/snippets/get-base-url.js")
}

resource "checkly_snippet" "graphql" {
  name   = "Login"
  script = file("${path.module}/browser/snippets/graphql.js")
}

resource "checkly_check" "destinations-page-unauth-redirect" {
  name          = "Destinations Page Unauth redirect"
  type          = "BROWSER"
  activated     = true
  frequency     = 1440
  double_check  = true
  locations = [
    "us-west-1"
  ]

  group_id = checkly_check_group.frontend.id

  script = file("${path.module}/browser/destinations-page-unauth-redirect.js")
}

resource "checkly_check" "new-user-sign-up" {
  name          = "New User Sign Up"
  type          = "BROWSER"
  activated     = false
  frequency     = 1440
  double_check  = true
  locations = [
    "us-west-1"
  ]

  group_id = checkly_check_group.frontend.id

  script = file("${path.module}/browser/new-user-sign-up.js")
}