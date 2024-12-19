export type ProjectSize = "small" | "medium" | "large";

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  size: ProjectSize;
  content?: React.ReactNode;
}
