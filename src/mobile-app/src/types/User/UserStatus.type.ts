import {UserTrackingLocation} from './UserTrackingLocation';

export interface UserStatus {
  userId: string;
  userName: string;
  userAvatarUrl: string;
  status: Status;
  lastUpdateDate?: string;
  lastLat?: string;
  lastLon?: string;
  recentTrackingLocations: UserTrackingLocation[];
}

export enum Status {
  Offline = 0,
  Online = 1,
  Idle = 2,
}
