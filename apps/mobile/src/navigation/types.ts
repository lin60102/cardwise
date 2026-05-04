import type { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Onboarding: undefined;
  LoginRegister: undefined;
  MyWallet: undefined;
  AddCards: undefined;
  Recommendation: undefined;
  CardDetail: { cardId: string };
  Paywall: { reason?: string } | undefined;
  AnnualDashboard: undefined;
  Settings: undefined;
};

export type ScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;

