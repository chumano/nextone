import { UserStatus } from "./../user/UserStatus.model";
export interface ConversationMember {
  userMember: UserStatus;
  role: MemberRole;
  seenDate?: string;
}

export enum MemberRole {
  MANAGER = 0,
  MEMBER = 1,
  PARENT = 2
}
export const MemberRoleName = {
  0 : "Quản lý kênh",
  1 : "Thành viên",
  2 : "Kênh cha",
}
