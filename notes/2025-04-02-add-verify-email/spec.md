# Feature Specification: Email Verification Flow

## Overview

This feature adds email verification functionality to the authentication system. When users register, they will receive a verification email with a link. Clicking this link will take them to a verification page where they can confirm their email address. This helps ensure email addresses are valid and owned by the registering user.

## Files to Modify

### API Specification

- `/saflib/auth-spec/routes/auth.yaml` - Add new endpoints for email verification and resending verification

### Backend

- `/saflib/auth-service/routes/auth.ts` - Add route handlers for email verification and resending verification
- `/saflib/auth-db/src/queries/email-auth.ts` - Add queries for email verification

### Frontend

- `/saflib/auth-vue/src/components/VerifyEmailPage.vue` - New page for email verification
- `/saflib/auth-vue/src/requests/auth.ts` - Add API client functions for email verification

## User Stories

- As a new user, I want to verify my email address so that I can ensure my account is properly set up
- As a user, I want to be redirected to the main app after verifying my email so that I can continue using the application
- As a user, I want to see clear feedback about whether my email verification was successful or not
- As a user, I want to be able to resend the verification email if I didn't receive it or if the link expired

## Technical Requirements

### Database Schema Updates

No schema updates required - we'll use the existing `emailAuth` table which already has:

- `verificationToken`
- `verificationTokenExpiresAt`
- `verifiedAt`

### Database Queries

We need to add the following queries to `email-auth.ts`:

1. `verifyEmail` - Update verification status and clear token
2. `getByVerificationToken` - Find user by verification token
3. `updateVerificationToken` - Set new verification token and expiration

### API Endpoints

1. POST /auth/verify-email

   - Purpose: Verify a user's email address using a token
   - Request parameters:
     - token (query param): The verification token
   - Response:
     - 200: Success response with user info
     - 400: Invalid or expired token
     - 401: User not logged in
     - 404: Token not found
   - Authorization requirements: User must be logged in

2. POST /auth/resend-verification

   - Purpose: Resend the verification email to the logged-in user
   - Response:
     - 200: Success response
     - 401: User not logged in
   - Authorization requirements: User must be logged in

### Frontend Pages

1. VerifyEmailPage

   - Purpose: Allow users to verify their email address
   - Features:
     - Display verification status
     - Show success/error messages
     - Provide link back to main app
     - Resend verification email button (shown on error or when no token provided)
   - User interactions:
     - Page loads with token from URL
     - Automatically submits verification request
     - Shows result to user
     - Can click to resend verification email
   - State management:
     - Uses TanStack Query for API calls
     - Manages loading/error states

## Implementation Considerations

- Security:
  - Verification tokens must be single-use
  - Tokens must expire after a reasonable time
  - User must be logged in to verify email
- Performance:
  - Verification should be quick and responsive
  - Clear loading states for user feedback
- Accessibility:
  - Clear success/error messages
  - Proper heading structure
  - Keyboard navigation support

## Future Enhancements / Out of Scope

- Email sending functionality (currently just logging)
- Email verification status in user profile
- Multiple email addresses per user

## Questions and Clarifications

- Should we automatically log the user out if verification fails?
  - no
- What should be the token expiration time?
  - 15 minutes
- Should we show the user's email address on the verification page?
  - yes
- Should we show a success message if the user is already verified?
  - yes
