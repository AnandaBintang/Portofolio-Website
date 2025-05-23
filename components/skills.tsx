"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Badge } from "@/components/ui/badge"

export default function Skills() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const skillCategories = [
    {
      name: "Backend",
      skills: ["PHP", "Laravel", "Node.js", "Express.js", "REST API", "GraphQL", "PostgreSQL", "MySQL", "MongoDB"],
    },
    {
      name: "Frontend",
      skills: ["HTML", "CSS", "JavaScript", "Vue.js", "Tailwind CSS", "Bootstrap"],
    },
    {
      name: "DevOps & Tools",
      skills: ["Git", "GitHub", "Docker", "GCP", "Linux", "Nginx", "Apache"],
    },
    {
      name: "Other",
      skills: ["Agile Methodology", "Project Management", "Mentoring", "Technical Documentation", "Problem Solving"],
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section id="skills" ref={ref} className="py-16 md:py-24">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Skills</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skillCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                className="bg-card rounded-lg p-6 border border-border/50"
              >
                <h3 className="text-xl font-semibold mb-4">{category.name}</h3>
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate={isInView ? "show" : "hidden"}
                  className="flex flex-wrap gap-2"
                >
                  {category.skills.map((skill, i) => (
                    <motion.div key={i} variants={item}>
                      <Badge className="px-3 py-1 text-sm">{skill}</Badge>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
