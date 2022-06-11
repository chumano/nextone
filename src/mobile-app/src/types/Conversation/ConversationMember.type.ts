import { UserStatus } from "../User/UserStatus.type";

export interface ConversationMember {
  userMember: UserStatus;
  role: MemberRole;
}

export enum MemberRole {
  MANAGER = 0,
  MEMBER = 1,
}
