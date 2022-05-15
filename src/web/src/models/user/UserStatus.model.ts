import { UserTrackingLocation } from "./UserTrackingLocation.model";
export interface UserStatus {
  userId: string;
  userName: string;
  UserAvatarUrl: string;

  status: Status;

  LastUpdateDate?: string;
  LastLat?: number;
  LastLon?: number;

  RecentTrackingLocations: UserTrackingLocation[];
}

export enum Status {
  Offline = 0,
  Online = 1,
  Idle = 2,
}
