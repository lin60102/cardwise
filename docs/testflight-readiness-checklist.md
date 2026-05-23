# CardWise TestFlight Readiness Checklist

Use this checklist before inviting internal testers.

## Build And Configuration

- [ ] Confirm the iOS bundle identifier is `com.kensa.cardwise`.
- [ ] Confirm the EAS project is linked to the correct Expo project.
- [ ] Confirm the Apple developer account and provisioning profile include the internal test device list.
- [ ] Confirm `EXPO_PUBLIC_API_URL` points to the production/staging Render API.
- [ ] Confirm Supabase is active and not paused before testing begins.
- [ ] Confirm `JWT_SECRET` is set to a production-strength secret on the API host.
- [ ] Confirm RevenueCat public SDK keys are set for iOS.
- [ ] Confirm RevenueCat entitlement id is `premium`.
- [ ] Confirm App Store Connect subscription products match RevenueCat offerings.
- [ ] Keep AdMob test ads enabled for internal testing unless a clean native build has real IDs.
- [ ] Do not rely on AdMob real ad rendering until a clean iOS development or TestFlight build includes the native module.

## Functional Readiness

- [ ] Register, login, logout, and token restore work on a physical iPhone.
- [ ] First auth attempt after Render sleep shows cold-start retry messaging.
- [ ] Invalid password and duplicate email do not retry.
- [ ] Wallet loads after login and after app restart.
- [ ] Free users cannot exceed 5 cards.
- [ ] Business card controls are gated for Free users.
- [ ] Recommendation screen handles 0 cards, API failure, and normal ranked results.
- [ ] Paywall handles unavailable RevenueCat offerings without crashing.
- [ ] Restore purchases completes with a clear success or no-purchase message.
- [ ] Settings refresh subscription does not leave the screen stuck.
- [ ] Logout clears auth state immediately.

## App Store Connect Assets

- [ ] App name, subtitle, description, keywords, and support URL are ready.
- [ ] Privacy policy URL is ready and publicly reachable.
- [ ] Support URL is ready and publicly reachable.
- [ ] App category selected: Finance.
- [ ] Age rating completed.
- [ ] Financial disclaimer included in description or review notes.
- [ ] Screenshots prepared for required iPhone sizes.

## Review Notes

- [ ] Provide reviewer test account credentials.
- [ ] Explain that CardWise is a credit card rewards optimizer, not financial advice.
- [ ] Explain RevenueCat subscription behavior and Premium gates.
- [ ] Mention AdMob uses placeholder/test behavior if real ads are not enabled in the submitted build.
- [ ] Mention Render Free may have a cold start on first API request if still using that host for review.

## Blocker Decision

Do not submit to TestFlight internal testing until:

- Auth works on the exact build testers will install.
- Supabase is active.
- RevenueCat does not crash when offerings are unavailable.
- Privacy policy and support pages are reachable.
- A fresh native iOS build has been created after any native dependency or config changes.
