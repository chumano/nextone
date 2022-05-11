export interface EventType {
  Code: string;
  Name: string;

  IconUrl: string;
  Note: string;
}

export interface CreateEventTypeRequest extends EventType {}
export interface UpdateEventTypeRequest extends EventType {}
