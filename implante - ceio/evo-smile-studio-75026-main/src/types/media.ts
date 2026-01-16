export type MediaSectionKey = "smilesTransformed" | "doctorHighlight" | "realStories" | "clinicStructure";

export type MediaType = "image" | "video";

export interface MediaItem {
  id: string;
  type: MediaType;
  src: string;
  alt: string;
  description?: string;
  poster?: string;
  order: number;
  zoom?: number;
  positionX?: number;
  positionY?: number;
}

export interface MediaSections {
  smilesTransformed: MediaItem[];
  doctorHighlight: MediaItem[];
  realStories: MediaItem[];
  clinicStructure: MediaItem[];
}

