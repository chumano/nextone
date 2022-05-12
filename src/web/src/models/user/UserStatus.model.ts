import { UserTrackingLocation } from "./UserTrackingLocation.model";
export interface UserStatus {
  UserId: string;
  UserName: string;
  UserAvatarUrl: string;

  Status: Status;

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
