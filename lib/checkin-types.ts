export type CheckinState = "safe" | "unsafe";

export type Mood =
  | "steady"
  | "tired_ok"
  | "heavy_day"
  | "hard_week"
  | "want_to_talk";

export type Checkin = {
  state: CheckinState;
  mood?: Mood;
  at: number;
};

export const CHECKIN_COOKIE = "beside_checkin";
export const CHECKIN_TTL_SECONDS = 60 * 60 * 8;
