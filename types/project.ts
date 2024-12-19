export type ProjectSize = "small" | "medium" | "large";

export interface Project {
  title: string;
  description: string;
  imageUrl: string;
  size: ProjectSize;
  content?: string;
  year: string;
}
