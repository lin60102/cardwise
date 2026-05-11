# Apple Sign In

## Goal

Allow iOS users to sign in or create a CardWise account with Sign in with Apple while preserving the existing email/password and demo flows.

## User Flow

- The login/register screen shows the Apple-provided Sign in with Apple button only when Apple authentication is available.
- Tapping the button starts the native Apple authentication sheet and requests the user's email and full name.
- If Apple succeeds, the app sends the identity token, nonce, Apple user identifier, and optional display name to the API.
- The API verifies the token with Apple's public keys, issuer, audience, expiration, and nonce before issuing a CardWise JWT.
- Existing Apple-linked users are signed in. New Apple users get a free account and subscription record.

## Backend Rules

- The Apple provider user identifier is the durable account link.
- Email can link to an existing CardWise user only after the Apple identity token is verified and the email claim is verified.
- Apple-only accounts do not require a password hash.
- The Apple client ID defaults to the iOS bundle identifier and can be overridden with `APPLE_CLIENT_ID`.

## Platform Notes

- Apple Sign In is an iOS feature in this app. Android and web keep the existing auth options.
- Native builds must enable the Sign in with Apple capability through Expo config.
- Expo Go can test the UI flow, but standalone/dev builds should be tested on a real iOS device because identifiers may differ.
