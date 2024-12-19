export interface PayloadMedia {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  filesize: number;
  width: number;
  height: number;
  alt: string;
}

export interface PayloadProject {
  id: string;
  title: string;
  description: string;
  image: PayloadMedia;
  technologies: { name: string }[];
  githubUrl: string;
  liveUrl?: string;
  size?: "small" | "medium" | "large";
}
