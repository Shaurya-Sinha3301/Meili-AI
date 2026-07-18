export interface ExplanationDTO {
  id: string;
  day?: number;
  activity_changed: string;
  previous_value?: string;
  new_value?: string;
  reason: string;
  affected_constraints: string[];
  confidence: number;
  human_explanation: string;
}
