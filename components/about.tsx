"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="about" ref={ref} className="py-16 md:py-24 bg-muted/30">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">About Me</h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="space-y-4 text-foreground/80"
          >
            <p>
              I am a skilled web developer with a strong focus on backend engineering, active in the field since 2022.
              My expertise includes building secure and scalable web applications, utilizing frameworks like Laravel to
              deliver efficient backend solutions.
            </p>

            <p>
              I have extensive experience in creating dynamic websites, including top-up games platforms, e-commerce
              websites, and professional company profiles. As a freelance developer, I have worked on multiple projects,
              crafting customized solutions tailored to each client's needs.
            </p>

            <p>
              In addition, I have experience as an Assistant Tech Mentor at Google Developer Student Club, where I guide
              students through web development concepts, create learning materials, and deliver workshops.
            </p>

            <p>
              My work as a Fullstack Web Developer at Roleplay Studio and CV Purnama Kreatifa has further broadened my
              technical skills. I've developed company profile websites with frontend animations and built
              location-based attendance systems that integrate image capture for mobile platforms.
            </p>

            <p>I am passionate about leveraging my backend expertise to drive impactful digital solutions.</p>

            <div className="pt-4 flex justify-center">
              <Button variant="outline" asChild>
                <a href="/resume.pdf" download="Ananda_Bintang_Resume.pdf">
                  <Download className="mr-2 h-4 w-4" /> Download Full Resume
                </a>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
