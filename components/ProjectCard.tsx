"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  year: string;
}

export function ProjectCard({
  title,
  description,
  imageUrl,
  link,
  year,
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group relative overflow-hidden rounded-lg"
    >
      <Link href={link} className="block">
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-foreground">{title}</h3>
            <span className="text-sm text-muted-foreground">{year}</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>
      </Link>
    </motion.div>
  );
}
