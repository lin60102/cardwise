import { useEffect, useState } from "react";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";
import { StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "../context/ThemeContext";
import { spacing } from "../theme";
import type { AppleSignInButtonProps } from "./AppleSignInButton";

function isRequestCanceled(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "ERR_REQUEST_CANCELED"
  );
}

function getDisplayName(fullName: AppleAuthentication.AppleAuthenticationFullName | null) {
  if (!fullName) {
    return undefined;
  }

  const formattedName = AppleAuthentication.formatFullName(fullName, "default").trim();
  return formattedName || undefined;
}

export function AppleSignInButton({ loading, separatorLabel, onSuccess, onError }: AppleSignInButtonProps) {
  const [available, setAvailable] = useState(false);
  const { colors, mode } = useAppTheme();

  useEffect(() => {
    let isMounted = true;

    AppleAuthentication.isAvailableAsync()
      .then((nextAvailable) => {
        if (isMounted) {
          setAvailable(nextAvailable);
        }
      })
      .catch(() => {
        if (isMounted) {
          setAvailable(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  async function handlePress() {
    if (loading) {
      return;
    }

    try {
      const nonce = Crypto.randomUUID();
      const state = Crypto.randomUUID();
      const credential = await AppleAuthentication.signInAsync({
        nonce,
        state,
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL
        ]
      });

      if (credential.state !== state) {
        throw new Error("Apple sign-in state did not match.");
      }

      if (!credential.identityToken) {
        throw new Error("Apple did not return an identity token.");
      }

      await onSuccess({
        identityToken: credential.identityToken,
        nonce,
        user: credential.user,
        name: getDisplayName(credential.fullName)
      });
    } catch (error) {
      if (!isRequestCanceled(error)) {
        onError(error);
      }
    }
  }

  if (!available) {
    return null;
  }

  return (
    <View style={[styles.container, loading && styles.disabled]}>
      <View style={styles.separator}>
        <View style={[styles.line, { backgroundColor: colors.border }]} />
        <Text style={[styles.separatorText, { color: colors.muted }]}>{separatorLabel}</Text>
        <View style={[styles.line, { backgroundColor: colors.border }]} />
      </View>
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={
          mode === "dark"
            ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
            : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
        }
        cornerRadius={8}
        style={styles.button}
        onPress={handlePress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm
  },
  disabled: {
    opacity: 0.55
  },
  separator: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    paddingTop: spacing.xs
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth
  },
  separatorText: {
    fontSize: 13,
    fontWeight: "700"
  },
  button: {
    width: "100%",
    height: 48
  }
});
