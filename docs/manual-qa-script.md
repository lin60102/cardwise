# CardWise Internal Tester Manual QA Script

Run this script on a physical iPhone using the TestFlight build.

## Tester Setup

- Device: iPhone model and iOS version.
- Build number:
- Tester email:
- Network: Wi-Fi and cellular if available.

## 1. First Launch And Onboarding

1. Install the app fresh from TestFlight.
2. Launch CardWise.
3. Confirm onboarding appears before login.
4. Switch language once and verify text changes.
5. Tap the onboarding CTA once.
6. Confirm the CTA shows loading only briefly and does not double-submit.

Expected result: login/register screen appears, no blank screen or stuck spinner.

## 2. Register And Login

1. Try registering with an invalid email.
2. Try registering with a short password.
3. Register with a valid email and password.
4. If the service is cold, confirm the message: "Secure service is waking up. Trying again..."
5. Close and reopen the app.
6. Confirm the session restores to the wallet.
7. Log out.
8. Log in again.
9. Try a wrong password.

Expected result: valid auth stores the session; wrong credentials show a friendly error and do not retry forever.

## 3. Wallet

1. Confirm empty wallet state appears for a new account.
2. Tap Add Cards.
3. Search for "Chase".
4. Add one personal card.
5. Return to wallet and confirm it appears.
6. Remove the card.
7. Add 5 personal cards as a Free user.
8. Try adding a 6th card.

Expected result: wallet updates correctly, duplicate taps do not add/remove multiple cards, 6th card opens the paywall.

## 4. Recommendations

1. With 0 cards, open Best Card and tap recommendation.
2. Confirm the empty wallet state appears.
3. Add at least 2 cards.
4. Select Dining and run recommendation.
5. Select Groceries and run recommendation.
6. Enter a purchase amount and run recommendation.
7. Tap retry after forcing a network failure if practical.

Expected result: no infinite spinner; best card, reward rate, explanation, and ranked list appear.

## 5. Premium And RevenueCat

1. Open Paywall from the 6-card limit or Settings.
2. Confirm Monthly and Yearly plan cards appear, or a clear fallback message appears.
3. Tap purchase only with an approved sandbox/test account.
4. Tap Restore Purchases.
5. Leave the screen while loading and return.

Expected result: paywall never crashes; unavailable offerings show a fallback; purchase/restore messaging is clear.

## 6. Settings

1. Toggle language.
2. Toggle light/dark mode.
3. Try enabling business cards as a Free user.
4. Enter an invalid promo code.
5. Enter a valid promo code if one is provided.
6. Tap Refresh subscription.
7. Log out.

Expected result: Premium-only settings route to paywall; promo and refresh errors are visible; logout returns to auth.

## 7. Offline And Recovery

1. Turn on airplane mode.
2. Open wallet, add cards, recommendation, and settings.
3. Turn network back on.
4. Retry failed actions.

Expected result: API failures do not permanently brick screens; retry paths recover.

## Bug Report Template

- Build number:
- Device/iOS:
- Account email:
- Screen:
- Steps to reproduce:
- Expected:
- Actual:
- Screenshot or screen recording:
- Console logs if available:
