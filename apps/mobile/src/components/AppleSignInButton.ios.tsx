import { useEffect, useState } from "react";
import type * as AppleAuthentication from "expo-apple-authentication";
import type * as Crypto from "expo-crypto";
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

let cryptoModule: typeof Crypto | null | undefined;

async function getCrypto() {
  if (cryptoModule !== undefined) {
    return cryptoModule;
  }

  try {
    cryptoModule = await import("expo-crypto");
  } catch (error) {
    console.warn("Expo Crypto is not available in this runtime.", error);
    cryptoModule = null;
  }

  return cryptoModule;
}

function getDisplayName(
  appleAuthentication: typeof AppleAuthentication,
  fullName: AppleAuthentication.AppleAuthenticationFullName | null
) {
  if (!fullName) {
    return undefined;
  }

  const formattedName = appleAuthentication.formatFullName(fullName, "default").trim();
  return formattedName || undefined;
}

export function AppleSignInButton({ loading, separatorLabel, onSuccess, onError }: AppleSignInButtonProps) {
  const [available, setAvailable] = useState(false);
  const [appleAuthentication, setAppleAuthentication] = useState<typeof AppleAuthentication | null>(null);
  const { colors, mode } = useAppTheme();

  useEffect(() => {
    let isMounted = true;

    import("expo-apple-authentication")
      .then(async (nextAppleAuthentication) => {
        const nextAvailable = await nextAppleAuthentication.isAvailableAsync();
        if (isMounted) {
          setAvailable(nextAvailable);
          setAppleAuthentication(nextAvailable ? nextAppleAuthentication : null);
        }
      })
      .catch((error) => {
        console.warn("Apple Authentication is not available in this runtime.", error);
        if (isMounted) {
          setAvailable(false);
          setAppleAuthentication(null);
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
      if (!appleAuthentication) {
        return;
      }

      const CryptoModule = await getCrypto();
      if (!CryptoModule) {
        throw new Error("Expo Crypto is not available.");
      }

      const nonce = CryptoModule.randomUUID();
      const state = CryptoModule.randomUUID();
      const credential = await appleAuthentication.signInAsync({
        nonce,
        state,
        requestedScopes: [
          appleAuthentication.AppleAuthenticationScope.FULL_NAME,
          appleAuthentication.AppleAuthenticationScope.EMAIL
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
        name: getDisplayName(appleAuthentication, credential.fullName)
      });
    } catch (error) {
      if (!isRequestCanceled(error)) {
        onError(error);
      }
    }
  }

  if (!available || !appleAuthentication) {
    return null;
  }

  const AppleAuthenticationButton = appleAuthentication.AppleAuthenticationButton;

  return (
    <View style={[styles.container, loading && styles.disabled]}>
      <View style={styles.separator}>
        <View style={[styles.line, { backgroundColor: colors.border }]} />
        <Text style={[styles.separatorText, { color: colors.muted }]}>{separatorLabel}</Text>
        <View style={[styles.line, { backgroundColor: colors.border }]} />
      </View>
      <AppleAuthenticationButton
        buttonType={appleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={
          mode === "dark"
            ? appleAuthentication.AppleAuthenticationButtonStyle.WHITE
            : appleAuthentication.AppleAuthenticationButtonStyle.BLACK
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
