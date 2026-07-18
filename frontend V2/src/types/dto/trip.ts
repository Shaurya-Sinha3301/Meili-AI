export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface TripDetailResponse {
  trip_id: string;
  trip_name: string;
  destination: string;
  start_date?: string;
  end_date?: string;
  status: string;
  iteration_count: number;
  family_id: string;
}
