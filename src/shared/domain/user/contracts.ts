// Generated from Backend DTOs by scripts/exportFrontendContracts.mjs.

export interface BankAccountRequestDTO {
  bankCode: string;
  accountNumber: string;
  accountHolder: string;
  expectedBankVersion: number;
  verifyWithOpenBanking?: false;
}

export interface OnboardingRequestDTO extends BankAccountRequestDTO {
  confirmRejoin?: boolean;
}

export interface AccountBank {
  bankName: string;
  accountNumber: string;
  formattedAccountNumber: string | null;
  accountHolder: string;
  bankCode: string | null;
  verifiedAt: number | null;
}

export interface Account {
  id: string;
  displayName: string | null;
  email: string | null;
  profileImageUrl: string | null;
  purpose: 'app' | 'onboarding';
  deletedAt: number | null;
  onboardingCompletedAt: number | null;
  bankVersion: number;
  bankAccount: AccountBank | null;
}

export interface BankAccountResponseDTO {
  id: string;
  bankVersion: number;
}

export interface OnboardingResponseDTO {
  id: string;
  returnTo: string;
  accessToken: string;
}

export interface WithdrawResponseDTO {
  ok: true;
}

export type UserAccountState = {
  id: string;
  displayName: string | null;
  email: string | null;
  profileImageUrl: string | null;
  bankName: string | null;
  accountNumber: string | null;
  formattedAccountNumber: string | null;
  accountHolder: string | null;
  bankCode: string | null;
  bankVerifiedAt: number | null;
  bankVersion: number;
  updatedAt: number;
  deletedAt: number | null;
  onboardingCompletedAt: number | null;
};

export type ActiveUserProfile = {
  userId: string;
  displayName: string;
  profileImageUrl: string | null;
};

export type SignInUserDTO = Pick<
  UserAccountState,
  'id' | 'deletedAt' | 'onboardingCompletedAt'
>;
