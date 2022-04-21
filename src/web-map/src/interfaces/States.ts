export type ErrorState = {
  error: string;
};

export type FlagState = {
  listing: boolean;
  creating: boolean;
  updating: boolean;
  removing: boolean;
};

export type ErrorPayload = {
  error: string;
};

export type FlagPayload = { listing: boolean } | { creating: boolean } | { updating: boolean } | { removing: boolean };