import {MessageType} from './../types/Message/MessageType.type';
import {MessageEvent} from './../types/Message/Message.type';
import {Status} from '../types/User/UserStatus.type';
export const LIST_MESSAGE: MessageEvent[] = [
  {
    id: 'message-01',
    conversationId: 'conversation-01',
    type: MessageType.Text,
    sentDate: '06/06/2022',
    userSender: {
      userId: 'user-01',
      userName: 'julian wan',
      userAvatarUrl:
        'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80',
      status: Status.Online,
      recentTrackingLocations: [],
    },
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
    files: [],
  },
  {
    id: 'message-02',
    conversationId: 'conversation-01',
    type: MessageType.Text,
    sentDate: '06/06/2022',
    userSender: {
      userId: 'user-02',
      userName: 'ben parker',
      userAvatarUrl:
        'https://images.unsplash.com/photo-1528763380143-65b3ac89a3ff?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=989&q=80',
      status: Status.Offline,
      recentTrackingLocations: [],
    },
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
    files: [],
  },
  {
    id: 'message-03',
    conversationId: 'conversation-01',
    type: MessageType.Text,
    sentDate: '06/06/2022',
    userSender: {
      userId: 'user-01',
      userName: 'julian wan',
      userAvatarUrl:
        'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80',
      status: Status.Online,
      recentTrackingLocations: [],
    },
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
    files: [],
  },
];
