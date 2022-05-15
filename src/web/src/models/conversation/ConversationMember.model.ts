import { UserStatus } from "./../user/UserStatus.model";
export interface ConversationMember {
  userMember: UserStatus;
  role: MemberRole;
}

export enum MemberRole {
  MANAGER = 0,
  MEMBER = 1,
}
