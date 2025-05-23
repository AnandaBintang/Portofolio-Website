"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Experience() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const experiences = [
    {
      title: "Web Developer - Freelance",
      period: "Oct 2023 - Present (Remote)",
      description: [
        "Developed and maintained multiple web applications focusing on backend development with PHP, Laravel, and PostgreSQL.",
        "Built an e-commerce platform that served over 1,000 users, integrated a payment gateway, and optimized SQL queries, improving query efficiency by 30%.",
      ],
      tags: ["PHP", "Laravel", "PostgreSQL", "E-commerce", "Payment Gateway"],
    },
    {
      title: "Assistant Mentor Web Developer Division - Google Developer Student Club",
      period: "Nov 2023 - Sep 2024 (Hybrid)",
      description: [
        "Guided students in mastering frontend and backend web technologies including HTML, CSS, JavaScript, and PHP through workshops and mentoring sessions.",
        "Successfully mentored over 50 students, resulting in improved technical understanding and project completion rates.",
      ],
      tags: ["Mentoring", "HTML", "CSS", "JavaScript", "PHP", "Workshops"],
    },
    {
      title: "Full Stack Developer - Roleplay Studio",
      period: "Mar 2023 - Oct 2023 (Internship)",
      description: [
        "Developed dynamic company profile websites using HTML, CSS, and JavaScript, integrating interactive animations to enhance user engagement.",
        "Collaborated with designers and project managers to ensure seamless user experience and functional alignment with business objectives.",
      ],
      tags: ["HTML", "CSS", "JavaScript", "Animations", "Company Profile"],
    },
    {
      title: "Full Stack Developer - CV. Purnama Kreatifa",
      period: "Sep 2022 - Dec 2022 (Internship)",
      description: [
        "Built a location-based attendance system with PHP, MySQL, and geofencing technology, simplifying employee attendance tracking for remote workers.",
        "Ensured seamless functionality by collaborating closely with cross-functional teams to meet business requirements.",
      ],
      tags: ["PHP", "MySQL", "Geofencing", "Attendance System"],
    },
  ]

  return (
    <section id="experience" ref={ref} className="py-16 md:py-24">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Work Experience</h2>

          <div className="space-y-6">
            {experiences.map((experience, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <Card className="border border-border/50 hover:border-primary/50 transition-colors duration-300">
                  <CardHeader>
                    <CardTitle>{experience.title}</CardTitle>
                    <CardDescription>{experience.period}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 mb-4 space-y-2 text-foreground/80">
                      {experience.description.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {experience.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
