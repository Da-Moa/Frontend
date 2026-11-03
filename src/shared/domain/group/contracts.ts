// Generated from Backend DTOs by scripts/exportFrontendContracts.mjs.

export interface CreateGroupRequestDTO {
  name: string;
}

export interface CreateInviteRequestDTO {
  replaceInviteId?: string;
}

export interface GroupMemberPreview {
  userId: string;
  displayName: string;
  profileImageUrl: string | null;
}

export interface GroupInvite {
  id: string;
  expiresAt: number;
}

export interface GroupSummary {
  id: string;
  creatorId: string;
  name: string;
  createdAt: number;
}

export interface GroupMember {
  userId: string;
  displayName: string;
  excludedAt: number | null;
}

export interface GroupListItem extends GroupSummary {
  memberCount: number;
  memberPreview: GroupMemberPreview[];
}

export interface GroupDetail extends GroupSummary {
  members: GroupMember[];
  isCreator: boolean;
  invites: GroupInvite[];
}

export interface GroupPage {
  items: GroupListItem[];
  nextCursor: string | null;
}

export interface InvitePreview {
  groupId: string;
  groupName: string;
  isMember: boolean;
  expiresAt: number;
}

export interface GroupMutationResult {
  id: string;
  inviteId?: string;
  linkUnavailable?: boolean;
  sharePath?: string;
}
