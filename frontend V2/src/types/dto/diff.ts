export interface DiffItemDTO {
  before?: unknown;
  after?: unknown;
  reason?: string;
  importance: string;
  affected_constraints: string[];
}

export interface DiffDTO {
  trip_id: string;
  version_a: number;
  version_b: number;
  added_activities: DiffItemDTO[];
  removed_activities: DiffItemDTO[];
  moved_activities: DiffItemDTO[];
  time_changes: DiffItemDTO[];
  hotel_changes: DiffItemDTO[];
  transport_changes: DiffItemDTO[];
}
