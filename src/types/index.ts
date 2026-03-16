export interface Shot {
  id: string;
  shotTime: number;
  landingTime: number | null;
}

export interface Settings {
  fps: number;
}
