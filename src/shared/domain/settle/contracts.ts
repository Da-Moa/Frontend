// Generated from Backend DTOs by scripts/exportFrontendContracts.mjs.

import type { Currency } from './money';

export interface CreateRoundRequestDTO {
  name: string;
  participantIds: string[];
}

export interface VersionRequestDTO {
  expectedVersion: number;
}

export interface ReceiptUploadRequestDTO {
  file: unknown;
  expectedVersion: number;
}

export interface CustomShareRequestDTO {
  userId: string;
  amount: string;
}

export interface ExpenseRequestDTO extends VersionRequestDTO {
  currency?: Currency;
  description?: string;
  amount?: string;
  payerId?: string;
  splitMode?: Expense['splitMode'];
  participantIds?: string[];
  customShares?: CustomShareRequestDTO[];
}

export interface CreateExpenseRequestDTO extends ExpenseRequestDTO {
  currency: Currency;
  description: string;
  amount: string;
  payerId: string;
  splitMode: Expense['splitMode'];
}

export interface SettlementCheckRequestDTO extends VersionRequestDTO {
  checked: boolean;
  senderId?: string;
  currency?: Currency;
}

export type RoundStatus = 'RECORDING' | 'CONFIRMED' | 'LOCKED' | 'COMPLETED';

export interface CurrencyTotal {
  currency: Currency;
  totalMinor: string;
  balanceMinor: string | null;
}

export interface CurrencyBalance {
  currency: Currency;
  balanceMinor: string;
}

export interface RoundMember {
  userId: string;
  displayName: string;
  profileImageUrl: string | null;
  excludedAt: number | null;
}

export interface Receipt {
  id: string;
  mimeType: string;
  byteSize: number;
  storageStatus: 'PENDING' | 'READY' | 'FAILED';
}

export interface ExpenseShare {
  userId: string;
  assignedAmountMinor: string | null;
  amountMinor: string | null;
  receivedRemainder: boolean | null;
}

export interface Expense {
  id: string;
  authorId: string;
  payerId: string;
  description: string;
  currency: Currency;
  amountMinor: string;
  splitMode: 'ALL' | 'SELECTED' | 'CUSTOM';
  participantIds: string[];
  baseShareMinor: string | null;
  remainderUnits: number | null;
  shares: ExpenseShare[];
  receipts: Receipt[];
  createdAt: number;
  updatedAt: number;
}

export interface SettlementTransfer {
  currency: Currency;
  senderId: string;
  receiverId: string;
  amountMinor: string;
}

export interface PendingRemainder {
  currency: Currency;
  amountMinor: string;
}

export interface RoundSummary {
  id: string;
  groupId: string;
  groupName: string;
  name: string;
  status: RoundStatus;
  version: number;
  createdAt: number;
  finalizedAt: number | null;
  completedAt: number | null;
  totals: CurrencyTotal[];
  memberCount: number;
}

export interface RoundPage {
  items: RoundSummary[];
  nextCursor: string | null;
}

export interface RoundDetail extends RoundSummary {
  creatorId: string;
  groupCreatorId: string;
  isCreator: boolean;
  members: RoundMember[];
  expenses: Expense[];
  expensesNextCursor: string | null;
  transfers: SettlementTransfer[];
  pendingRemainders: PendingRemainder[];
}

export interface ExclusionExpense {
  id: string;
  description: string;
  currency: Currency;
  amountMinor: string;
  authorId: string;
  authorName: string;
  reason: string;
}

export interface ExclusionCheck {
  allowed: boolean;
  reason: string | null;
  expenses: ExclusionExpense[];
}

export interface MutationResult {
  id: string;
  roundId?: string;
  status?: RoundStatus;
  version?: number;
}

export interface CurrentBankAccount {
  bankName: string | null;
  accountNumber: string | null;
  formattedAccountNumber: string | null;
  accountHolder: string | null;
  verifiedAt: number | null;
}

export interface SettlementConfirmation {
  userId: string;
  displayName: string;
  profileImageUrl: string | null;
  checkedAt: number | null;
}

export interface OutgoingTransfer {
  currency: Currency;
  receiverId: string;
  displayName: string;
  profileImageUrl: string | null;
  amountMinor: string;
  account?: CurrentBankAccount;
}

export interface IncomingTransfer {
  currency: Currency;
  senderId: string;
  displayName: string;
  profileImageUrl: string | null;
  amountMinor: string;
  receivedAt: number | null;
}

export interface SettlementDTO {
  roundId: string;
  name: string;
  groupName: string;
  status: RoundStatus;
  version: number;
  isCreator: boolean;
  finalized: boolean;
  balances: CurrencyBalance[];
  checkedAt: number | null;
  checkRequired: boolean;
  checkedCount: number;
  requiredCount: number;
  allChecked: boolean;
  confirmations: SettlementConfirmation[];
  outgoing: OutgoingTransfer[];
  incoming: IncomingTransfer[];
  sharePath: string | null;
}

export type UnfinishedUserRound = {
  id: string;
  name: string;
  status: RoundStatus;
  groupId: string;
  groupName: string;
};
