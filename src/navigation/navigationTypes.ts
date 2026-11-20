export type AuthStackParamList = {
  Login: undefined;
  VerifyOtp: { verificationToken: string; maskedEmail: string; expiresAt: number };
  ForgotPassword: undefined;
};
export type MainTabParamList = {
  Dashboard: undefined;
  Projects: undefined;
  Profile: undefined;
};
export type RootStackParamList = { Welcome: undefined; Auth: undefined; Main: undefined };
