export interface Store {
  id: string;
  name: string;
  noOfExperts: number;
  ratings: number;
  badge: Badge;
  discount: number;
  location: string;
}

export enum Badge {
  SILVER,
  GOLD,
  PLATINUM,
}
