import {Status} from './../types/User/UserStatus.type';
import {MemberRole} from './../types/Conversation/ConversationMember.type';
import {ConversationType} from '../types/Conversation/ConversationType.type';
import {Conversation} from './../types/Conversation/Conversation.type';

export const LIST_CONVERSATION: Conversation[] = [
  {
    id: 'conversation-01',
    name: 'conversation-01',
    type: ConversationType.Peer2Peer,
    members: [
      {
        userMember: {
          userId: 'user-01',
          userName: 'julian wan',
          userAvatarUrl:
            'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80',
          status: Status.Online,
          recentTrackingLocations: [],
        },
        role: MemberRole.MEMBER,
      },
      {
        userMember: {
          userId: 'user-02',
          userName: 'ben parker',
          userAvatarUrl:
            'https://images.unsplash.com/photo-1528763380143-65b3ac89a3ff?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=989&q=80',
          status: Status.Offline,
          recentTrackingLocations: [],
        },
        role: MemberRole.MEMBER,
      },
    ],
    updatedDate: '12 minutes ago',
  },
  {
    id: 'conversation-02',
    name: 'conversation-02',
    type: ConversationType.Group,
    members: [
      {
        userMember: {
          userId: 'user-01',
          userName: 'julian wan',
          userAvatarUrl:
            'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80',
          status: Status.Online,
          recentTrackingLocations: [],
        },
        role: MemberRole.MEMBER,
      },
      {
        userMember: {
          userId: 'user-02',
          userName: 'ben parker',
          userAvatarUrl:
            'https://images.unsplash.com/photo-1528763380143-65b3ac89a3ff?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=989&q=80',
          status: Status.Offline,
          recentTrackingLocations: [],
        },
        role: MemberRole.MEMBER,
      },
      {
        userMember: {
          userId: 'user-03',
          userName: 'alex suprun',
          userAvatarUrl:
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80',
          status: Status.Idle,
          recentTrackingLocations: [],
        },
        role: MemberRole.MANAGER,
      },
    ],
    updatedDate: '30 minutes ago',
  },
  {
    id: 'conversation-03',
    name: 'conversation-03',
    type: ConversationType.Peer2Peer,
    members: [
      {
        userMember: {
          userId: 'user-03',
          userName: 'alex suprun',
          userAvatarUrl:
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80',
          status: Status.Idle,
          recentTrackingLocations: [],
        },
        role: MemberRole.MANAGER,
      },
      {
        userMember: {
          userId: 'user-02',
          userName: 'ben parker',
          userAvatarUrl:
            'https://images.unsplash.com/photo-1528763380143-65b3ac89a3ff?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=989&q=80',
          status: Status.Offline,
          recentTrackingLocations: [],
        },
        role: MemberRole.MEMBER,
      },
    ],
    updatedDate: '40 minutes ago',
  },
];
