export interface PolaroidItem {
  id: string;
  title: string;
  description: string;
  initialImage: string;
  userImage: string | null;
  caption: string;
  date: string;
  defaultX: number;
  defaultY: number;
  rotate: number;
  category: "Pre-Wedding" | "Rituals" | "Fun" | "Celebration";
  story: string;
}

export interface PlacedSticker {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
  rotate: number;
  scale: number;
}

export interface WishNote {
  id: string;
  author: string;
  message: string;
  color: string;
  x: number;
  y: number;
  rotate: number;
  date: string;
}

export type ScrapbookTab = "cover" | "canvas" | "story" | "wishes" | "about";

export interface WeddingEventPhoto {
  url: string;
  caption: string;
}

export interface WeddingEvent {
  title: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  iconName: string;
  photos: WeddingEventPhoto[];
}
