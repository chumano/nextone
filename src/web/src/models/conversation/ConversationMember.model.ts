export interface ConversationMember {
  ConversationId: string;
  UserId: string;

  UserMember: any;
  Role: MemberRole;
}

export enum MemberRole {
  MANAGER = 0,
  MEMBER = 1,
}
