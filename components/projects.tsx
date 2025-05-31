"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github } from "lucide-react"
import Link from "next/link"

export default function Projects() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const projects = [
    {
      title: "E-commerce Platform",
      description:
        "A full-featured e-commerce platform user authentication, and product management.",
      image: "/damarmas.png",
      tags: ["Laravel", "PHP", "PostgreSQL", "REST API"],
      demoLink: "https://damarmas.co.id",
      githubLink: "#",
    },
    {
      title: "Top-up Games Platform",
      description:
        "A platform for gamers to purchase in-game currency and items with secure payment processing and order tracking.",
      image: "/synnmlbb.png",
      tags: ["Laravel", "MySQL", "API Integration", "Payment Gateway"],
      demoLink: "https://synnmlbb.com",
      githubLink: "#",
    },
    {
      title: "Pilang Village Archive Management",
      description:
        "A digital archive management system for Pilang Village to organize and manage village documents and records efficiently.",
      image: "/masarip.png",
      tags: ["PHP", "Laravel", "MySQL", "Document Management", "Admin Panel"],
      demoLink: "https://masarip.online",
      githubLink: "#",
    },
    {
      title: "Attendance System",
      description:
        "A location-based attendance system with geofencing technology for remote workers, featuring image capture for verification.",
      image: "/default.jpg",
      tags: ["PHP", "Cordova", "MySQL", "Geofencing", "Mobile Integration"],
      demoLink: "#",
      githubLink: "#",
    },
    {
      title: "Company Profile Website",
      description:
        "A dynamic company profile website with interactive animations and responsive design for optimal viewing on all devices.",
      image: "/default.jpg",
      tags: ["HTML", "CSS", "JavaScript", "Animations"],
      demoLink: "#",
      githubLink: "#",
    },
  ]

  return (
    <section id="projects" ref={ref} className="py-16 md:py-24 bg-muted/30">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Projects</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <Card className="h-full flex flex-col overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-md">
                  <div className="overflow-hidden">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, i) => (
                        <Badge key={i} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={project.demoLink} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" /> Demo
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={project.githubLink} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-2" /> Code
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
