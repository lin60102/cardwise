import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { FeatureSettingsProvider } from "./src/context/FeatureSettingsContext";
import { LanguageProvider, useLanguage } from "./src/context/LanguageContext";
import { ThemeProvider, useAppTheme } from "./src/context/ThemeContext";
import { AddCardsScreen } from "./src/screens/AddCardsScreen";
import { AnnualDashboardScreen } from "./src/screens/AnnualDashboardScreen";
import { BonusTrackerScreen } from "./src/screens/BonusTrackerScreen";
import { CardDetailScreen } from "./src/screens/CardDetailScreen";
import { LoginRegisterScreen } from "./src/screens/LoginRegisterScreen";
import { MyWalletScreen } from "./src/screens/MyWalletScreen";
import { OnboardingScreen } from "./src/screens/OnboardingScreen";
import { PaywallScreen } from "./src/screens/PaywallScreen";
import { RecommendationScreen } from "./src/screens/RecommendationScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";
import { SpendProfileScreen } from "./src/screens/SpendProfileScreen";
import { SupportScreen } from "./src/screens/SupportScreen";
import { RootStackParamList } from "./src/navigation/types";
import { LoadingState } from "./src/components/LoadingState";

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const { token, hasOnboarded, isBooting } = useAuth();
  const { t } = useLanguage();
  const { colors, mode } = useAppTheme();

  if (isBooting) {
    return <LoadingState label={`${t("common.loading")} CardWise`} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
          headerTitleStyle: { color: colors.text, fontWeight: "700" },
          contentStyle: { backgroundColor: colors.background }
        }}
      >
        {!hasOnboarded ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
        ) : !token ? (
          <Stack.Screen name="LoginRegister" component={LoginRegisterScreen} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="MyWallet" component={MyWalletScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AddCards" component={AddCardsScreen} options={{ title: t("wallet.addCards") }} />
            <Stack.Screen name="Recommendation" component={RecommendationScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SpendProfile" component={SpendProfileScreen} options={{ headerShown: false }} />
            <Stack.Screen name="BonusTracker" component={BonusTrackerScreen} options={{ headerShown: false }} />
            <Stack.Screen name="CardDetail" component={CardDetailScreen} options={{ title: t("detail.title") }} />
            <Stack.Screen name="Paywall" component={PaywallScreen} options={{ title: "CardWise Premium" }} />
            <Stack.Screen name="Support" component={SupportScreen} options={{ title: t("support.navTitle") }} />
            <Stack.Screen name="AnnualDashboard" component={AnnualDashboardScreen} options={{ title: t("wallet.annualValue") }} />
            <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <ThemeProvider>
          <FeatureSettingsProvider>
            <AuthProvider>
              <RootNavigator />
            </AuthProvider>
          </FeatureSettingsProvider>
        </ThemeProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
