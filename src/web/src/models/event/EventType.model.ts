export interface EventType {
  code: string;
  name: string;

  iconUrl: string;
  note: string;
}

export interface CreateEventTypeRequest extends EventType {}
export interface UpdateEventTypeRequest extends EventType {}
