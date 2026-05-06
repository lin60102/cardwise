import type { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Onboarding: undefined;
  LoginRegister: undefined;
  MyWallet: undefined;
  AddCards: undefined;
  Recommendation: undefined;
  SpendProfile: undefined;
  BonusTracker: undefined;
  CardDetail: { cardId: string };
  Paywall: { reason?: string } | undefined;
  Support: undefined;
  AnnualDashboard: undefined;
  Settings: undefined;
};

export type ScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;
