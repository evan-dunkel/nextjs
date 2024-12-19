import { Project } from "@/types/project";

export const projects: Project[] = [
  {
    id: "vijnanabhairava",
    title: "Vijñāna Bhairava Tantra",
    description: "Meditation App — Design, Illustration, React Native App",
    imageUrl: "/images/placeholder-space.avif",
    size: "large",
    year: "Coming Spring 2025",
  },
  {
    id: "nuclear-connectionsf",
    title: "Nuclear Connections",
    description: "Social word game",
    imageUrl: "/images/placeholder-space.avif",
    size: "small",
    year: "January 2024",
  },
  {
    id: "retreat-technology",
    title: "Retreat.technology",
    description: "Lock yourself out of social media",
    imageUrl: "/images/placeholder-space.avif",
    size: "small",
    year: "2024",
  },
  {
    id: "utopia-app",
    title: "Utopia.app",
    description:
      "React Design Tool. Canvas and code update each other in real time.",
    imageUrl: "/images/placeholder-space.avif",
    size: "medium",
    year: "2017-2020",
  },
  // Add more projects...
  {
    id: "nuclear-connections",
    title: "Nuclear",
    description: "Social word game",
    imageUrl: "/images/placeholder-space.avif",
    size: "small",
    year: "January 2024",
  },
].sort((a, b) => {
  // Sort by size first (large -> medium -> small)
  const sizeOrder = { large: 3, medium: 2, small: 1 };
  return sizeOrder[b.size] - sizeOrder[a.size];
});
