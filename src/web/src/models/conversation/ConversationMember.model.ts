import { UserStatus } from "./../user/UserStatus.model";
export interface ConversationMember {
  ConversationId: string;
  UserId: string;

  UserMember: UserStatus;
  Role: MemberRole;
}

export enum MemberRole {
  MANAGER = 0,
  MEMBER = 1,
}
