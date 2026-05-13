import type { NavigatorScreenParams } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

export type MainTabParamList = {
  MyWallet: undefined;
  Recommendation: undefined;
  SpendProfile: undefined;
  BonusTracker: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Onboarding: undefined;
  LoginRegister: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  AddCards: undefined;
  CardDetail: { cardId: string };
  Paywall: { reason?: string } | undefined;
  Support: undefined;
  AnnualDashboard: undefined;
} & MainTabParamList;

export type ScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;
