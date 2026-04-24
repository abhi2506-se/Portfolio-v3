'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Github, ExternalLink, Code2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePortfolioData } from '@/hooks/usePortfolioData'

export function Projects() {
  const { projects } = usePortfolioData()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }
  const card = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25,0.46,0.45,0.94] } } }

  return (
    <motion.section
      id="projects"
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={container}
      className="py-20 md:py-32 px-4 md:px-6 lg:px-8 max-w-5xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={card} className="mb-4">
        <span className="text-sm font-semibold text-blue-600 uppercase tracking-widest">What I've Built</span>
        <h2 className="text-4xl md:text-5xl font-bold mt-2">
          Featured{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Projects</span>
        </h2>
      </motion.div>
      <motion.p variants={card} className="text-base md:text-lg text-muted-foreground mb-12 max-w-2xl">
        Explore some of my recent work showcasing frontend, full-stack, and AI-powered solutions.
      </motion.p>

      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project, idx) => (
          <motion.div
            key={idx}
            variants={card}
            whileHover={{ y: -8, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            onHoverStart={() => setHoveredIdx(idx)}
            onHoverEnd={() => setHoveredIdx(null)}
            className="group bg-secondary border border-border rounded-2xl overflow-hidden hover:border-blue-600/30 hover:shadow-xl hover:shadow-blue-600/5 transition-all duration-300"
          >
            {/* Project image / gradient header */}
            <div className={`h-44 bg-gradient-to-br ${project.image} relative overflow-hidden`}>
              {/* Animated mesh overlay */}
              <motion.div
                animate={hoveredIdx === idx ? { opacity: 0.4, scale: 1.05 } : { opacity: 0.2, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 bg-black"
              />
              {/* Grid pattern */}
              <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div animate={hoveredIdx === idx ? { scale: 1.2, rotate: 10 } : { scale: 1, rotate: 0 }} transition={{ duration: 0.4 }}>
                  <Code2 className="w-14 h-14 text-white/40" />
                </motion.div>
              </div>
              {/* Sparkles on hover */}
              <AnimatePresence>
                {hoveredIdx === idx && (
                  <>
                    {[[-20, -20], [20, -10], [-15, 15], [25, 20]].map(([dx, dy], i) => (
                      <motion.div key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="absolute"
                        style={{ top: `calc(50% + ${dy}px)`, left: `calc(50% + ${dx}px)` }}
                      >
                        <Sparkles className="w-4 h-4 text-white/60" />
                      </motion.div>
                    ))}
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors duration-200">
                  {project.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{project.description}</p>
              </div>

              {/* Tech tags */}
              <div className="flex flex-wrap gap-2 pt-1">
                {project.tech.map((tech, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.4 + idx * 0.1 + i * 0.04 }}
                    whileHover={{ scale: 1.1 }}
                    className="text-xs px-2.5 py-1 bg-background rounded-full text-muted-foreground border border-border hover:border-blue-600/40 hover:text-blue-600 transition-colors cursor-default"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-3 border-t border-border">
                <Button asChild size="sm" variant="outline" className="flex-1 gap-2 bg-transparent hover:bg-secondary">
                  <a href={project.github} target="_blank" rel="noopener noreferrer">
                    <Github className="w-3.5 h-3.5" />Code
                  </a>
                </Button>
                <Button asChild size="sm" className="flex-1 gap-2 shadow-md shadow-blue-600/10">
                  <a href={project.live} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3.5 h-3.5" />Live Demo
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
