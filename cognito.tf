
resource "aws_cognito_user_pool" "tech-challenge_admin_pool" {
    name = "tech-challenge-admin-pool"

    admin_create_user_config {
        allow_admin_create_user_only = true
    }
    password_policy {
        minimum_length    = 8
        require_lowercase = true
        require_numbers   = true
        require_symbols   = true
        require_uppercase = true
    }
    username_attributes = []
    mfa_configuration = "OFF"
    auto_verified_attributes = ["email"]

    account_recovery_setting {
        recovery_mechanism {
            name     = "verified_email"
            priority = 1
        }
    }
    email_configuration {
        email_sending_account = "COGNITO_DEFAULT"
    }
}

# Cria dominio para user pool
resource "aws_cognito_user_pool_domain" "tech-challenge_domain" {
    domain       = "tech-challenge-domain"
    user_pool_id = aws_cognito_user_pool.tech-challenge_admin_pool.id
}

# Cria client para app
resource "aws_cognito_user_pool_client" "tech-challenge_client" {
    name                   = "tech-challenge-client"
    user_pool_id           = aws_cognito_user_pool.tech-challenge_admin_pool.id
    generate_secret        = false
    allowed_oauth_flows_user_pool_client = true
    allowed_oauth_flows    = ["code", "implicit"]
    allowed_oauth_scopes   = ["email", "openid"]
    explicit_auth_flows = ["ALLOW_REFRESH_TOKEN_AUTH", "ALLOW_USER_SRP_AUTH"]
    prevent_user_existence_errors = "ENABLED"
    callback_urls          = ["https://localhost/"]
    supported_identity_providers = ["COGNITO"]
}


resource "aws_cognito_user" "admin_user" {
    user_pool_id = aws_cognito_user_pool.challenge_admin_pool.id
    username     = "admin"
    attributes = {
        email = "admin@email.com"
    }
    password = "admin@123"
    depends_on = [aws_cognito_user_pool.challenge_admin_pool]
}
