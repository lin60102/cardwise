# Recommendation Screen States

## Goal

Make the recommendation flow understandable when the app is waiting, cannot rank cards, or has no wallet cards to compare.

## Behavior

- Starting a new recommendation clears stale result content so users do not confuse an old ranking with the current request.
- While ranking, the result area shows a visible loading card with the current category and the work being done.
- If ranking fails, the result area shows a friendly error state with a retry action.
- If there are no comparable wallet cards, the result area explains the next step and links to card search.
- Successful recommendations still show the best card first, followed by the ranked wallet list.
