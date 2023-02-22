import { UserStatus } from "../User/UserStatus.type";

export interface ConversationMember {
  userMember: UserStatus;
  role: MemberRole;
  seenDate?: string;
}

export enum MemberRole {
  MANAGER = 0,
  MEMBER = 1,
}
