import {Status} from '../types/User/UserStatus.type';
import {EventInfo} from './../types/Event/EventInfo.type';

export const LIST_EVENT: EventInfo[] = [
  {
    id: 'event-01',
    channelId: 'channel-01',
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    eventTypeCode: 'fire',
    eventType: {
      name: 'social',
      code: 'social',
      iconUrl:
        'https://media.istockphoto.com/photos/thumbs-up-picture-id171312357?b=1&k=20&m=171312357&s=170667a&w=0&h=b1E3jNN0jBt6VOVK6XlawGNBs4zLR-cHJ2qu83kMYxA=',
      note: 'social event type',
    },
    occurDate: '2022-06-12 10:39:00',
    address: 'HoChiMinh city',
    lat: 10.333333,
    lon: 11.333333,
    userSenderId: 'user-01',
    userSender: {
      userId: 'user-01',
      userName: 'julian wan',
      userAvatarUrl:
        'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80',
      status: Status.Online,
      recentTrackingLocations: [],
    },
    files: [],
  },
];
