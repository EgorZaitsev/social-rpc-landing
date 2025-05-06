"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
    // Prevent scrolling when menu is open
    document.body.style.overflow = isOpen ? "auto" : "hidden"
  }

  const closeMenu = () => {
    setIsOpen(false)
    document.body.style.overflow = "auto"
  }

  const menuVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  }

  return (
    <div className="md:hidden">
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMenu}
          className="text-primary-dark hover:text-accent-gold transition-colors duration-300"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Открыть меню</span>
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-primary-dark/95 flex flex-col"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
          >
            <div className="flex justify-end p-4">
              <motion.div whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeMenu}
                  className="text-white hover:text-accent-gold transition-colors duration-300"
                >
                  <X className="h-6 w-6" />
                  <span className="sr-only">Закрыть меню</span>
                </Button>
              </motion.div>
            </div>

            <nav className="flex flex-col items-center justify-center flex-1 gap-8">
              {["О центре", "Направления", "Галерея", "Контакты"].map((item, index) => (
                <motion.div key={item} variants={itemVariants} custom={index}>
                  <Link
                    href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-white text-xl hover:text-accent-gold transition-colors duration-500"
                    onClick={closeMenu}
                  >
                    {item}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
