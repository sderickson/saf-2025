## Overview

This feature adds a complete forgot password flow to the SAF authentication system. This includes:

1. A page where users can request a password reset
2. A page where users can set a new password using a temporary password
3. Backend support for generating and validating temporary passwords
4. API endpoints to handle the forgot password flow

This feature is a prerequisite for implementing user administration features, as it ensures users can recover access to their accounts if they forget their passwords.

## User Stories

- As a user who forgot their password, I want to request a password reset link so that I can regain access to my account
- As a user with a password reset link, I want to set a new password so that I can continue using the system
- As a user, I want the password reset process to be secure so that my account remains protected

## Technical Requirements

### Database Schema Updates

The existing schema in `auth-db/src/schema.ts` already has the necessary fields in the `emailAuth` table:

- `forgotPasswordToken`
- `forgotPasswordTokenExpiresAt`

No schema changes are required.

### API Endpoints

1. POST /auth/forgot-password

   - Purpose: Request a password reset
   - Request body: `{ email: string }`
   - Response: `{ success: true, message: "If the user exists, a recovery email was sent" }`
   - Error responses:
     - 400: Invalid email format
   - Authorization: None
   - Security: Always returns 200 to prevent email enumeration attacks

2. POST /auth/reset-password
   - Purpose: Set a new password using temporary password
   - Request body: `{ token: string, newPassword: string }`
   - Response: `{ success: true }`
   - Error responses:
     - 400: Invalid token or password
     - 404: Token not found or expired
   - Authorization: None

### Frontend SPA

Changes will be made to the existing auth-vue SPA.

### Frontend Pages

1. ForgotPasswordPage.vue (Update)

   - Purpose: Allow users to request a password reset
   - Features:
     - Email input field with validation
     - Submit button
     - Link back to login page
   - User interactions:
     - Enter email
     - Submit form
     - See success message
   - State management:
     - Form validation state
     - Loading state during submission
     - Success/error message state

2. ChangeForgottenPasswordPage.vue (New)
   - Purpose: Allow users to set a new password using temporary password
   - Features:
     - Temporary password input field
     - New password input field with validation
     - Confirm password field
     - Submit button
   - User interactions:
     - Enter temporary password
     - Enter and confirm new password
     - Submit form
     - See success message
   - State management:
     - Form validation state
     - Loading state during submission
     - Success/error message state

## Implementation Considerations

- Security:
  - Temporary passwords should be single-use
  - Temporary passwords should expire after 15 minutes
  - New passwords should meet minimum security requirements (see confirmPasswordRules in RegisterPage.vue)
  - All sensitive operations should be logged
  - API responses should not reveal user existence
- Performance:
  - Password reset tokens should be stored with appropriate indexes
  - Rate limiting will be implemented in a future feature
- User Experience:
  - Clear error messages for all failure cases
  - Loading states during API calls
  - Success messages after completion
  - Clear instructions for users

## Future Enhancements / Out of Scope

- Email service integration (currently just logging)
- Password strength requirements (will be refactored from RegisterPage.vue)
- Rate limiting (requires separate rate limiting system)
- Account lockout after failed attempts
- Password history tracking
- CAPTCHA or other anti-abuse measures

## Questions and Clarifications

- What should be the expiration time for temporary passwords?
  - fifteen minutes
- Should we implement rate limiting for password reset requests?
  - no, we need a rate limiting system first
- What are the minimum password requirements?
  - see "confirmPasswordRules" in RegisterPage.vue - those should be refactored out
- Should we add CAPTCHA or other anti-abuse measures?
  - not for now
