"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/mobile-nav"
import { motion, useScroll, useTransform, useInView, useAnimation, AnimatePresence } from "framer-motion"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1.2, ease: "easeOut" },
  },
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, ease: "easeOut" },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
      ease: "easeOut",
    },
  },
}

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
}

// Add a reusable heading animation component at the top of the file, after the existing animation variants

// Heading animation variants
const headingAnimation = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

// Create a reusable AnimatedHeading component

const AnimatedHeading = ({ children, className, level = "h2", delay = 0 }) => {
  const HeadingTag = level
  
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: delay,
          },
        },
      }}
    >
      <motion.div variants={headingAnimation}>
        <HeadingTag className={className}>{children}</HeadingTag>
      </motion.div>
    </motion.div>
  )
}

// Scroll-triggered animation component
const AnimateOnScroll = ({ children, threshold = 0.1 }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: threshold })
  const controls = useAnimation()
  
  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { duration: 1.2, ease: "easeOut" },
        },
      }}
      className="w-full h-full flex items-center justify-center"
    >
      {children}
    </motion.div>
  )
}
const DirectionsSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })
  
  const directions = [
    {
      title: "Духовно-просветительское",
      description:
        "Занятия по основам православной культуры, изучение Священного Писания в доступной для детей форме, беседы со священниками и участие в богослужениях. Дети знакомятся с традициями православия, учатся понимать смысл церковных праздников и обрядов, развивают духовное мировоззрение.",
      icon: "prosvet",
      bgColor: "bg-white",
    },
    {
      title: "Спортивно-оздоровительное",
      description:
        "Регулярные спортивные занятия и соревнования помогают детям развивать физическую силу, выносливость и командный дух. Программа включает элементы традиционных боевых искусств, общую физическую подготовку и спортивные игры, направленные на формирование здорового образа жизни.",
      icon: "sport",
      bgColor: "bg-white",
    },
    {
      title: "Военно-патриотическое",
      description:
        "Воспитание любви к Родине, уважения к её истории и традициям. Дети изучают историю России, встречаются с ветеранами, участвуют в памятных мероприятиях. Особое внимание уделяется изучению подвигов русских воинов и святых защитников Отечества.",
      icon: "gol",
      bgColor: "bg-white",
    },
    {
      title: "Творческое развитие",
      description:
        "Творческие мастерские и кружки помогают детям раскрыть свои таланты в различных направлениях искусства. Иконопись, хоровое пение, рукоделие и другие виды творчества позволяют детям выразить себя и познакомиться с богатым культурным наследием православной традиции.",
      icon: "art",
      bgColor: "bg-white",
    },
  ]
  
  // Используем прогресс скролла для управления индексом текущего слайда
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((value) => {
      // Преобразуем прогресс скролла (0-1) в индекс слайда (0-3)
      const slideIndex = Math.min(directions.length - 1, Math.floor(value * directions.length))
      setCurrentIndex(slideIndex)
    })
    
    return () => unsubscribe()
  }, [scrollYProgress, directions.length])
  
  // Вычисляем X-позицию для каждого слайда
  const getSlideX = (index) => {
    if (index < currentIndex) return "-100%" // Слайды слева уходят за экран
    if (index > currentIndex) return "100%" // Слайды справа ждут своей очереди
    return "0%" // Текущий слайд в центре
  }
  
  // Функция для перехода к следующему/предыдущему слайду
  const navigateSlide = (direction) => {
    const newIndex = currentIndex + direction
    if (newIndex >= 0 && newIndex < directions.length) {
      // Вычисляем, какой процент скролла соответствует новому индексу
      const targetScrollY = (newIndex + 0.5) / directions.length
      
      // Находим соответствующую позицию скролла в пикселях
      if (containerRef.current) {
        const containerHeight = containerRef.current.scrollHeight - window.innerHeight
        const targetScrollPosition = containerHeight * targetScrollY
        
        // Плавно скроллим к этой позиции
        window.scrollTo({
          top: containerRef.current.offsetTop + targetScrollPosition,
          behavior: "smooth",
        })
      }
    }
  }
  
  return (
    <div
      ref={containerRef}
      className="directions-slider-container"
      style={{ height: `${directions.length * 100}vh`, position: "relative", zIndex: 10 }}
    >
      <div className="sticky-slider-view sticky top-0 h-screen flex items-center justify-center ">
        <div className="relative w-full h-full">
          {/* Слайды */}
          <div className="relative h-full flex items-center justify-center">
            {directions.map((direction, index) => (
              <motion.div
                key={index}
                className={`absolute w-full max-w-4xl mx-auto px-6 transition-all duration-700 ${index === currentIndex ? "z-10" : "z-0"}`}
                initial={{ x: index === 0 ? "0%" : "100%" }}
                animate={{
                  x: getSlideX(index),
                  opacity: index === currentIndex ? 1 : 0.3,
                  scale: index === currentIndex ? 1 : 0.9,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  opacity: { duration: 0.5 },
                }}
              >
                <div
                  className={`relative bg-white rounded-xl overflow-hidden shadow-lg ${direction.bgColor} flex flex-col items-center justify-center md:flex-row`}
                >
                  {/* Квадратное фото занимает 50% ширины */}
                  <motion.div
                    className="w-full h-full md:w-1/2 relative"
                    initial={{ opacity: 0.8 }}
                    animate={{
                      opacity: index === currentIndex ? 1 : 0.7,
                      scale: index === currentIndex ? 1 : 0.95,
                    }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                  >
                    <div className="aspect-square flex relative overflow-clip">
                      <Image
                        src={`/${direction.icon}.jpg`}
                        alt={direction.title}
                        width={500}
                        height={500}
                        className="object-cover justify-center items-center w-[300px] rounded-xl m-auto h-[300px] z-50 transition-transform duration-700 "
                      />
                    </div>
                  </motion.div>
                  
                  {/* Текстовый контент занимает 50% ширины */}
                  <div className="w-full md:w-1/2 p-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: index === currentIndex ? 1 : 0.5,
                        y: index === currentIndex ? 0 : 10,
                      }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                    >
                      <h3 className="font-serif text-2xl md:text-3xl font-bold text-cedar-gold mb-4">
                        {direction.title}
                      </h3>
                      
                      <motion.p
                        className="text-cedar-green/80 text-base md:text-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: index === currentIndex ? 1 : 0.5 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                      >
                        {direction.description}
                      </motion.p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Навигационные кнопки */}
          <div className="absolute left-0 right-0 bottom-10 flex justify-center items-center gap-4 z-20">
            {/* Индикаторы */}
            <div className="flex gap-2">
              {directions.map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-3 w-3 rounded-full ${index === currentIndex ? "bg-cedar-gold" : "bg-cedar-gold/30"}`}
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{
                    scale: index === currentIndex ? 1.2 : 1,
                    opacity: index === currentIndex ? 1 : 0.5,
                  }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


const sections = [
  {
    title: "Образование через творчество укрепляет связь поколений",
    content: [
      "Дети, участвующие в творческих мастер-классах, не только осваивают\n" +
      "практические навыки, но и приобщаются к традициям, что способствует\n" +
      "укреплению межпоколенческих связей.",
    ],
    icon: "heart",
    color: "cedar-gold",
  },
  {
    title: "Спорт и духовность идут рядом, формируя характер",
    content: [
      "Сочетание физического развития с духовно-нравственным воспитанием создаёт гармоничную личность, способную преодолевать трудности\n" +
      "и достигать поставленных целей.",
    ],
    icon: "star",
    color: "cedar-gold",
  },
  {
    title: "Вовлечённость прихожан — ключ к устойчивому развитию",
    content: [
      "Активное участие членов прихода в организации и проведении мероприятий обеспечивает устойчивость проекта и его\n" +
      "органичное развитие в соответствии с потребностями общины.",
    ],
    icon: "users",
    color: "cedar-gold",
  },
  {
    title: "Системный подход дает долгосрочные результаты",
    content: [
      "Регулярность занятий и последовательная программа развития позволяют добиваться стабильного прогресса в воспитании детей\n" +
      "и подростков, формируя у них полезные привычки и навыки на всю жизнь.",
    ],
    icon: "users",
    color: "cedar-gold",
  },
]

const AutoScrollText = () => {
  const containerRef = useRef<HTMLElement>(null)
  const [activeSection, setActiveSection] = useState(0)
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true)
  const [userScrolling, setUserScrolling] = useState(false)
  const scrollTimeout = useRef(null)
  
  // Управление автоматическим скроллом
  useEffect(() => {
    if (!containerRef.current || !autoScrollEnabled || userScrolling) return
    
    const sectionHeight = containerRef.current.scrollHeight / sections.length
    const scrollDuration = 5000 // 5 секунд на секцию
    
    const interval = setInterval(() => {
      if (activeSection < sections.length - 1) {
        setActiveSection((prev) => prev + 1)
        containerRef.current.scrollTo({
          top: sectionHeight * (activeSection + 1),
          behavior: "smooth",
        })
      } else {
        // Возвращаемся к началу
        setActiveSection(0)
        containerRef.current.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      }
    }, scrollDuration)
    
    return () => clearInterval(interval)
  }, [activeSection, sections.length, autoScrollEnabled, userScrolling])
  
  // Обработка ручного скролла пользователем
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    
    const handleScroll = () => {
      // Отмечаем, что пользователь скроллит
      setUserScrolling(true)
      
      // Определяем текущую активную секцию на основе позиции скролла
      const scrollPosition = container.scrollTop
      const containerHeight = container.scrollHeight
      const viewportHeight = window.innerHeight
      const totalScrollableHeight = containerHeight - viewportHeight
      
      // Вычисляем, какой процент прокрутки соответствует каждой секции
      const scrollProgress = scrollPosition / totalScrollableHeight
      const newActiveSection = Math.min(sections.length - 1, Math.floor(scrollProgress * sections.length))
      
      if (newActiveSection !== activeSection) {
        setActiveSection(newActiveSection)
      }
      
      // Сбрасываем таймер, если он уже установлен
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }
      
      // Устанавливаем новый таймер для возобновления автоскролла через 5 секунд после последнего скролла
      scrollTimeout.current = setTimeout(() => {
        setUserScrolling(false)
      }, 5000)
    }
    
    container.addEventListener("scroll", handleScroll)
    return () => {
      container.removeEventListener("scroll", handleScroll)
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }
    }
  }, [activeSection, sections.length])
  
  return (
    <div className="relative h-screen overflow-hidden text-black">
      {/* Фоновый градиент */}
      <div className="absolute inset-0 bg-gradient-to-b from-cedar-green via-cedar-green to-cedar-green/80 z-0"></div>
      
      {/* Декоративные элементы */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cedar-gold/5 rounded-full -mt-48 -mr-48 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cedar-brown/5 rounded-full -mb-40 -ml-40 blur-3xl"></div>
      
      {/* Индикаторы секций */}
      <div className="absolute left-8 top-1/2 transform -translate-y-1/2 z-20 hidden md:flex flex-col gap-6">
        {sections.map((section, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-500 ${
              activeSection === index ? `bg-${section.color} w-4 h-4` : "bg-cedar-beige/30 hover:bg-cedar-beige/50"
            }`}
            onClick={() => {
              setActiveSection(index)
              containerRef.current.scrollTo({
                top: (containerRef.current.scrollHeight / sections.length) * index,
                behavior: "smooth",
              })
            }}
            aria-label={`Перейти к секции ${section.title}`}
          />
        ))}
      </div>
      
      {/* Контейнер для скролла */}
      <div
        ref={containerRef}
        className="h-screen overflow-y-auto scrollbar-hide relative"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          height: `${sections.length * 100}vh`,
        }}
      >
        <div className="sticky top-0 h-screen w-full">
          {sections.map((section, sectionIndex) => (
            <div
              key={sectionIndex}
              className="h-screen w-full absolute top-0 left-0 flex items-center justify-center px-6"
            >
              <motion.div
                className="max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 50 }}
                animate={{
                  opacity: activeSection === sectionIndex ? 1 : 0,
                  y: activeSection === sectionIndex ? 0 : 50,
                  pointerEvents: activeSection === sectionIndex ? "auto" : "none",
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="text-center mb-12">
                  
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: activeSection === sectionIndex ? 1 : 0,
                      y: activeSection === sectionIndex ? 0 : 20,
                    }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                    className="font-serif text-3xl md:text-4xl lg:text-5xl mb-8 text-cedar-gold"
                  >
                    {section.title}
                  </motion.h2>
                </div>
                
                <div className="space-y-8">
                  {section.content.map((paragraph, paraIndex) => (
                    <motion.p
                      key={paraIndex}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{
                        opacity: activeSection === sectionIndex ? 1 : 0,
                        y: activeSection === sectionIndex ? 0 : 30,
                      }}
                      transition={{
                        duration: 0.8,
                        ease: "easeOut",
                        delay: 0.2 + paraIndex * 0.2,
                      }}
                      className="text-lg md:text-xl text-cedar-beige/90 leading-relaxed text-center max-w-3xl mx-auto"
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const PhotoGallery = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  
  const galleryImages = [
    {
      src: "/1 (1).jpg",
      alt: "",
      caption: "Иконостас и внутреннее убранство храма святого мученика Уара",
    },
    {
      src: "/1 (2).jpg",
      alt: "Празднование Пасхи",
      caption: "Празднование Пасхи в центре «Здоровое поколение»",
    },
    {
      src: "/1 (6).jpg",
      alt: "Церковный хор",
      caption: "Выступление церковного хора",
    },
    {
      src: "/1 (7).jpg",
      alt: "Экопарк",
      caption: "Экопарк «На неведомых мытищинских дорожках»",
    },
    {
      src: "/1 (8).jpg",
      alt: "Общинное мероприятие",
      caption: "Совместное мероприятие прихожан храма",
    },
    {
      src: "/1 (9).jpg",
      alt: "Общинное мероприятие",
      caption: "Совместное мероприятие прихожан храма",
    },
    {
      src: "/1 (10).jpg",
      alt: "Общинное мероприятие",
      caption: "Совместное мероприятие прихожан храма",
    },
    {
      src: "/1 (11).jpg",
      alt: "Общинное мероприятие",
      caption: "Совместное мероприятие прихожан храма",
    },{
      src: "/1 (12).jpg",
      alt: "Общинное мероприятие",
      caption: "Совместное мероприятие прихожан храма",
    },{
      src: "/1 (13).jpg",
      alt: "Общинное мероприятие",
      caption: "Совместное мероприятие прихожан храма",
    },
  ]
  
  // Open image in modal
  const openImage = (index) => {
    setSelectedImage(index)
  }
  
  // Close modal
  const closeImage = () => {
    setSelectedImage(null)
  }
  
  // Navigate to next/previous image
  const navigateImage = (direction) => {
    if (selectedImage === null) return
    
    const newIndex = selectedImage + direction
    if (newIndex >= 0 && newIndex < galleryImages.length) {
      setSelectedImage(newIndex)
    }
  }
  
  // Animation variants
  const galleryVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }
  
  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedImage === null) return
      
      if (e.key === "Escape") {
        closeImage()
      } else if (e.key === "ArrowRight") {
        navigateImage(1)
      } else if (e.key === "ArrowLeft") {
        navigateImage(-1)
      }
    }
    
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedImage])
  
  return (
    <div className="py-20 bg-cedar-beige relative">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?key=bnm45')] bg-repeat"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <AnimatedHeading className="text-3xl md:text-4xl mb-6 text-cedar-gold font-serif">Фотоотчет</AnimatedHeading>
          <p className="text-cedar-green mb-8">
            Фотографии из жизни центра «Здоровое поколение» и храма святого мученика Уара
          </p>
        </div>
        
        <motion.div
          variants={galleryVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              variants={imageVariants}
              className="relative overflow-hidden rounded-lg aspect-[4/3] cursor-pointer group"
              onClick={() => openImage(index)}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <div className="absolute inset-0 bg-cedar-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
              <div className="absolute inset-0 border-2 border-cedar-gold/0 group-hover:border-cedar-gold/30 transition-all duration-300 rounded-lg z-20"></div>
              
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            className="fixed inset-0 bg-cedar-green/95 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeImage}
          >
            <motion.div
              className="relative max-w-5xl w-full max-h-[90vh] bg-cedar-beige rounded-xl overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={galleryImages[selectedImage].src || "/placeholder.svg"}
                  alt={galleryImages[selectedImage].alt}
                  fill
                  className="object-contain"
                />
              </div>
              
              {/* Navigation buttons */}
              <button
                className="absolute top-1/2 left-4 -translate-y-1/2 bg-cedar-gold/80 hover:bg-cedar-gold text-white p-2 rounded-full"
                onClick={(e) => {
                  e.stopPropagation()
                  navigateImage(-1)
                }}
                disabled={selectedImage === 0}
                style={{ opacity: selectedImage === 0 ? 0.5 : 1 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              
              <button
                className="absolute top-1/2 right-4 -translate-y-1/2 bg-cedar-gold/80 hover:bg-cedar-gold text-white p-2 rounded-full"
                onClick={(e) => {
                  e.stopPropagation()
                  navigateImage(1)
                }}
                disabled={selectedImage === galleryImages.length - 1}
                style={{ opacity: selectedImage === galleryImages.length - 1 ? 0.5 : 1 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
              
              <button
                className="absolute top-4 right-4 bg-cedar-gold/80 hover:bg-cedar-gold text-white p-2 rounded-full"
                onClick={closeImage}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


// Компонент для отображения авторов
const AuthorsGrid = () => {
  const authors = [
    {
      name: "Виктория Мордашева",
      role: "Редактор",
      image: "/mordasheva.jpg",
    },
    {
      name: "Желяев Данила",
      role: "Корреспондент",
      image: "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/3e8fcb37-813f-43e6-9779-e635746726f3",
    },
    {
      name: "Виктория Лигай",
      role: "Продюсер",
      image: "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/cbf1ce95-be9b-441f-bf21-a1973155e5c6",
    },
  ]
  
  // Варианты анимации для появления участников команды
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }
  
  return (
    <div className="py-20 bg-cedar-beige relative">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?key=bnm45')] bg-repeat"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <AnimatedHeading className="text-3xl md:text-4xl mb-6 text-cedar-gold font-serif">Авторы</AnimatedHeading>
          <p className="text-cedar-green">Наша команда</p>
        </div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
        >
          {authors.map((author, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex flex-col items-center text-center"
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <div className="relative mb-6 group">
                <div className="absolute inset-0 rounded-full bg-cedar-gold/10 transform scale-90 group-hover:scale-110 transition-transform duration-500"></div>
                <div className="relative w-40 h-40 md:w-48 md:h-48 mx-auto overflow-hidden rounded-full border-4 border-cedar-beige shadow-lg">
                  <Image
                    src={author.image || "/placeholder.svg"}
                    alt={author.name}
                    width={200}
                    height={200}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <motion.div
                  className="absolute inset-0 rounded-full bg-cedar-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{
                    boxShadow: ["0 0 0 0px rgba(201,167,94,0.3)", "0 0 0 10px rgba(201,167,94,0)"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                ></motion.div>
              </div>
              <h3 className="font-serif text-xl font-semibold text-cedar-gold mb-1">{author.name}</h3>
              <p className="text-cedar-gold text-sm">{author.role}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

// Компонент для отображения научных руководителей
const ScientificLeadersGrid = () => {
  const leaders = [
    {
      name: "Людмила Прохоренко",
      role: "Продюсер, преподаватель",
      image: "/lead1.jpg",
    },
    {
      name: "Василий Пинкевич",
      role: "Консультант, преподаватель",
      image: "/lead2.jpg",
    },
    {
      name: "Олег Сафронов",
      role: "Мастер курса, руководитель проекта",
      image: "/lead3.jpg",
    },
  ]
  
  // Варианты анимации для появления научных руководителей
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }
  
  return (
    <div className="py-20 bg-cedar-beige relative">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?key=bnm45')] bg-repeat"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <AnimatedHeading className="text-3xl md:text-4xl mb-6 text-cedar-gold font-serif">
            Научные руководители
          </AnimatedHeading>
        </div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          className="flex flex-col md:flex-row justify-center gap-12 md:gap-24"
        >
          {leaders.map((leader, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex flex-col items-center text-center"
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <div className="relative mb-6 group">
                <div className="absolute inset-0 rounded-full bg-cedar-gold/10 transform scale-90 group-hover:scale-110 transition-transform duration-500"></div>
                <div className="relative w-36 h-36 md:w-56 md:h-56 mx-auto overflow-hidden rounded-full border-4 border-cedar-beige shadow-lg">
                  <Image
                    src={leader.image || "/placeholder.svg"}
                    alt={leader.name}
                    width={100}
                    height={100}
                    className="object-cover object-top z-50 w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <motion.div
                  className="absolute inset-0 rounded-full bg-cedar-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{
                    boxShadow: ["0 0 0 0px rgba(201,167,94,0.3)", "0 0 0 10px rgba(201,167,94,0)"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                ></motion.div>
              </div>
              <h3 className="font-serif text-2xl font-semibold text-cedar-gold mb-1">{leader.name}</h3>
              <p className="text-cedar-gold text-lg">{leader.role}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default function Home() {
  // Parallax effect for hero section
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0])
  
  return (
    <div className="site-wrapper">
      {/* Header/Navigation */}
      <motion.header
        className="fixed-header"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="font-serif text-xl font-semibold text-cedar-beige uppercase tracking-wider">
                Здоровое поколение
              </span>
              <span className="text-xs text-cedar-gold uppercase tracking-wider">Православный центр</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            {["О центре", "Направления", "Галерея", "Авторы"].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <Link
                  href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-cedar-beige hover:text-cedar-gold transition-colors duration-500 uppercase text-sm tracking-wider"
                >
                  {item}
                </Link>
              </motion.div>
            ))}
          </nav>
          
          <MobileNav />
        </div>
      </motion.header>
      
      <main className="min-h-screen bg-cedar-beige overflow-x-clip">
        {/* Hero Section */}
        <section className="fixed-hero">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('/placeholder.svg?key=5rlyy')] bg-repeat opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-cedar-green via-transparent to-cedar-green"></div>
          </div>
          
          <div className="container mx-auto px-4 py-16 relative z-10 h-screen flex flex-col items-center justify-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="flex flex-col items-center"
            >
              <motion.div variants={staggerItem}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 max-w-4xl mx-auto leading-tight text-center text-cedar-gold font-serif">
                  Социальные проекты Русской Православной Церкви: служение вне храма.
                </h1>
              </motion.div>
              
              <motion.p
                variants={staggerItem}
                className="text-cedar-beige text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed text-center"
              >
                Более 4,5 тыс. действующих групп милосердия по всей России и ближнему зарубежью. Мы расскажем об одной
                из них — о центре, в котором дети становятся сильными духом, телом и разумом.
              </motion.p>
              
              <motion.div variants={staggerItem}>
                <h2 className="text-xl text-cedar-gold uppercase tracking-widest mb-2 font-medium">
                  Межрегиональная общественная организация «Здоровое Поколение»
                </h2>
              </motion.div>
            </motion.div>
            
            <div className="absolute bottom-10 left-0 right-0 flex justify-center">
              <div className="w-full max-w-3xl mx-auto overflow-hidden">
                <div className="relative">
                <motion.div
                  className="flex items-center gap-4 py-2"
                  animate={{ x: "-50%" }}
                  transition={{
                    duration: 30,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                    repeatType: "loop",
                    duration: 20,
                  }}
                  style={{ width: "fit-content" }}
                >
                  {/* First set of images */}
                  {[...Array(12)].map((_, index) => (
                    <div
                      key={`first-${index}`}
                      className="flex-shrink-0 h-16 w-16  rounded-md  overflow-hidden"
                    >
                      <Image
                        src="/logo-healthy-generation.png"
                        alt={`Жизнь центра ${index + 1}`}
                        width={100}
                        height={100}
                        className="h-full w-full object-cover rounded-full"
                      />
                    </div>
                  ))}
                  
                  {/* Duplicate set for seamless looping */}
                  {[...Array(12)].map((_, index) => (
                    <div
                      key={`second-${index}`}
                      className="flex-shrink-0 h-16 w-16  rounded-md  overflow-hidden"
                    >
                      <Image
                        src="/logo-healthy-generation.png"
                        alt={`Жизнь центра ${index + 1}`}
                        width={100}
                        height={100}
                        className="h-full w-full object-cover rounded-full"
                      />
                    </div>
                  ))}
                </motion.div>
              </div>
              </div>
            </div>
          </div>
        </section>
        
        <div className="h-screen"></div>
        
        <div className="content-wrapper">
          {/* About Temple Section */}
          <section id="о-центре" className="py-20 bg-cedar-beige relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-[url('/placeholder.svg?key=kg4m1')] bg-repeat"></div>
            </div>
            
            <div className="container mx-auto px-4 relative z-10">
              <AnimateOnScroll>
                <div className="max-w-3xl mx-auto text-center mb-16">
                  <AnimatedHeading className="text-3xl md:text-4xl mb-6 text-cedar-gold font-serif">
                    Проект <span className="text-cedar-gold">«Здоровое поколение»</span> создали прихожане храма св.
                    Уара в Подмосковье
                  </AnimatedHeading>
                </div>
              </AnimateOnScroll>
              
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <AnimateOnScroll>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: false, amount: 0.2 }}
                  >
                    <Image
                      src="/secondcenter.jpg"
                      alt="Храм святого мученика Уара"
                      width={800}
                      height={600}
                      className="w-full h-auto object-cover rounded-lg"
                    />
                  </motion.div>
                </AnimateOnScroll>
                <AnimateOnScroll>
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: false, amount: 0.2 }}
                  >
                    <p className="text-cedar-green w-2/3 text-center justify-self-center">
                      Центр «Здоровое поколение» создали прихожане, которые объединились ради общей цели — дать своим
                      детям возможность расти в среде, где царят вера, любовь к Отечеству и уважение к традиционным
                      ценностям. Они работали над местом, в котором не только воспитываются ум и тело, но и формируется
                      крепкий характер. А помог в создании настоятель храма, биолог в миру, протоиерей Олег Мумриков. За
                      несколько лет открылись филиалы в Москве и МО, Ялте и Калининграде.
                    </p>
                  </motion.div>
                </AnimateOnScroll>
                
                <AnimateOnScroll>
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: false, amount: 0.2 }}
                  >
                    <p className="text-cedar-green w-2/3 text-center justify-self-center">
                      Святой Уар почитается как единственный святой в православной традиции, являющийся небесным
                      ходатаем за некрещеных умерших и младенцев, умерших во чреве матери или при родах. Он жил в Египте
                      в конце III - начале IV веков в чину военачальника Тианской когорты.
                      <br />
                      Будучи тайным христианином во времена жестоких гонений на христиан при императоре Диоклетиане, Уар
                      не решался раскрыть свою веру. Однажды он посещал заключенных христиан и был обнаружен. Его
                      подвергли пыткам и казнили за веру в 307 году.
                    </p>
                  </motion.div>
                </AnimateOnScroll>
                
                <AnimateOnScroll>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: false, amount: 0.2 }}
                  >
                    <Image
                      src="/iconabl1.jpg"
                      alt="Храм святого мученика Уара"
                      width={800}
                      height={600}
                      className="w-full h-auto object-cover rounded-lg"
                    />
                  </motion.div>
                </AnimateOnScroll>
              </div>
            </div>
          </section>
          
          {/* About Temple History Section - NEW */}
          <section id="о-храме" className="py-20 bg-cedar-beige relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-[url('/placeholder.svg?key=3fqty')] bg-repeat opacity-10"></div>
            </div>
            
            <div className="container mx-auto px-4 relative z-10">
              <AnimateOnScroll>
                <div className="max-w-3xl mx-auto text-center mb-24">
                  <AnimatedHeading className="text-3xl md:text-4xl mb-6 text-cedar-gold font-serif">
                    Как появился храм и возник центр
                  </AnimatedHeading>
                </div>
              </AnimateOnScroll>
              
              {/* Scene 1 */}
              <div className="scroll-scene min-h-screen flex flex-col justify-center">
                <div className="grid md:grid-cols-2 gap-12 items-center mb-40">
                  <AnimateOnScroll>
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      viewport={{ once: false, amount: 0.2 }}
                      className="order-1 md:order-1"
                    >
                      <AnimatedHeading level="h3" className="text-2xl mb-4 text-cedar-gold font-serif text-center justify-self-center">
                        История храма
                      </AnimatedHeading>
                      <p className="text-cedar-green mb-6 w-2/3 text-center justify-self-center">
                        Храм мученика Уара-война в посёлке Вёшки Мытищинского городского округа — один из немногих
                        православных святынь в России, освящённых в честь этого святого. После разрушения старинного
                        храма пророка Илии, существовавшего в Вёшках в XVIII веке, на протяжении долгого времени в
                        посёлке не было действующего прихода. Новый храм построили в 2003 году, а первая Божественная
                        литургия прошла здесь весной того же года на Пасху.
                      </p>
                    </motion.div>
                  </AnimateOnScroll>
                  
                  <AnimateOnScroll>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                      viewport={{ once: false, amount: 0.2 }}
                      className="order-2 md:order-2 relative"
                    >
                      <Image
                        src="/churchbl1.jpg"
                        alt="Внешний вид храма святого мученика Уара"
                        width={800}
                        height={600}
                        className="w-full h-auto object-cover rounded-lg"
                      />
                      <motion.div
                        className="absolute -bottom-4 -right-4 bg-cedar-beige p-2 rounded shadow-md"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                      >
                        <p className="text-sm text-cedar-green/80 italic">Храм святого мученика Уара, 2024 г.</p>
                      </motion.div>
                    </motion.div>
                  </AnimateOnScroll>
                </div>
              </div>
              
              {/* Scene 2 */}
              <div className="scroll-scene min-h-screen flex flex-col justify-center">
                <div className="grid md:grid-cols-2 gap-12 items-center mb-40">
                  <AnimateOnScroll>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      viewport={{ once: false, amount: 0.2 }}
                      className="order-2 md:order-1 relative"
                    >
                      <Image
                        src="/ubranstvo.jpg"
                        alt="Иконостас храма"
                        width={700}
                        height={500}
                        className="w-full h-auto object-cover rounded-lg"
                      />
                      <motion.div
                        className="absolute -bottom-4 -left-4 bg-cedar-beige p-2 rounded shadow-md"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                      >
                        <p className="text-sm text-cedar-green/80 italic">
                          Иконостас храма, выполненный мастерами из Палеха
                        </p>
                      </motion.div>
                    </motion.div>
                  </AnimateOnScroll>
                  
                  <AnimateOnScroll>
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                      viewport={{ once: false, amount: 0.2 }}
                      className="order-1 md:order-2"
                    >
                      <AnimatedHeading level="h3" className="text-2xl mb-4 text-cedar-gold font-serif text-center justify-self-center">
                        Внутреннее убранство
                      </AnimatedHeading>
                      <p className="text-cedar-green mb-6 w-2/3 text-center justify-self-center">
                        Внутреннее убранство храма отличается особой красотой. Иконостас, покрытый сусальным золотом,
                        выполнен в стиле русского барокко мастерами из Палеха. Резные элементы и уникальные иконы
                        создают атмосферу благоговения и умиротворения.
                      </p>
                      <p className="text-cedar-green w-2/3 text-center justify-self-center">
                        Особое место в храме занимает икона святого мученика Уара с частицей его мощей, привезенная из
                        Греции. Храм славится своей акустикой, которая позволяет проводить не только богослужения, но и
                        духовные концерты церковного хора.
                      </p>
                    </motion.div>
                  </AnimateOnScroll>
                </div>
              </div>
              
              {/* Scene 3 */}
              <div className="scroll-scene min-h-screen flex flex-col justify-center">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <AnimateOnScroll>
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      viewport={{ once: false, amount: 0.2 }}
                      className="order-1 md:order-1"
                    >
                      <AnimatedHeading level="h3" className="text-2xl mb-4 text-cedar-gold font-serif text-center justify-self-center">
                        Сплетенные истории храма и центра
                      </AnimatedHeading>
                      <p className="text-cedar-green mb-6 w-2/3 text-center justify-self-center">
                        В 2017 году настоятелем храма назначили протоиерея Олега Мумрикова, который за два года до
                        этого, в 2015-м, стал ответственным за всю за экологическую работу Московской областной епархии.
                        На территории храма возник экопарк «На неведомых мытищинских дорожках», над которым работали
                        активисты из прихода. Теперь там устраивают регулярные субботники и мастер-классы. Первый центр
                        «Здоровое поколение» построили именно в этом экопарке.
                      </p>
                    </motion.div>
                  </AnimateOnScroll>
                  
                  <AnimateOnScroll>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                      viewport={{ once: false, amount: 0.2 }}
                      className="order-2 md:order-2 relative"
                    >
                      <Image
                        src="/centerbl1.jpg"
                        alt="Прихожане во время службы"
                        width={800}
                        height={600}
                        className="w-full h-auto object-cover rounded-lg"
                      />
                      <motion.div
                        className="absolute -bottom-4 -right-4 bg-cedar-beige p-2 rounded shadow-md"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                      >
                        <p className="text-sm text-cedar-green/80 italic">Православный центр «Здоровое поколение»</p>
                      </motion.div>
                    </motion.div>
                  </AnimateOnScroll>
                </div>
              </div>
            </div>
          </section>
          
          {/* Video Tour Section */}
          <section className="py-16 bg-cedar-green relative">
            <div className="container mx-auto px-4">
              <AnimateOnScroll>
                <div className="max-w-3xl mx-auto text-center mb-8">
                  <AnimatedHeading className="text-3xl md:text-4xl mb-4 text-cedar-gold font-serif">
                    Прогулка по территории храма
                    <br /> с отцом Олегом Мумриковым
                  </AnimatedHeading>
                </div>
              </AnimateOnScroll>
              
              <div className="grid md:grid-cols-2 gap-8 items-center min-h-[70vh]">
                <motion.div
                  className="relative block rounded-xl overflow-hidden shadow-2xl"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Decorative border */}
                  <div className="absolute inset-0 border-[12px] border-cedar-beige rounded-xl z-10 pointer-events-none"></div>
                  <div className="absolute inset-0 border-[3px] border-cedar-gold/30 rounded-xl z-20 pointer-events-none"></div>
                  <div className="absolute inset-[3px] border-[1px] border-cedar-gold/20 rounded-lg z-20 pointer-events-none"></div>
                  
                  {/* Decorative corners */}
                  <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-cedar-gold rounded-tl-lg z-30 pointer-events-none"></div>
                  <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-cedar-gold rounded-tr-lg z-30 pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-cedar-gold rounded-bl-lg z-30 pointer-events-none"></div>
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-cedar-gold rounded-bl-lg z-30 pointer-events-none"></div>
                  
                  <div className="aspect-w-16 aspect-h-9 bg-cedar-green">
                    <div className="w-full h-full">
                      <div className="relative w-full h-full">
                        <iframe src="https://vkvideo.ru/video_ext.php?oid=-230367682&id=456239021&hd=2&hash=e9bcd380dddf2640"
                                width="853"
                                height="480"
                                allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;"
                                frameBorder="0"
                                className="absolute top-0 left-0 w-full h-full"
                                
                                allowFullScreen></iframe>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <AnimateOnScroll>
                  <motion.div
                    className="bg-cedar-beige/30 p-6 rounded-xl border border-cedar-gold/10"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: false, amount: 0.2 }}
                  >
                    <AnimatedHeading level="h3" className="text-2xl mb-4 text-cedar-gold font-serif">
                      О видео-экскурсии
                    </AnimatedHeading>
                    <p className="text-cedar-beige mb-4">
                      Наша команда приехала в храм Уара-воина, чтобы подробнее выяснить, как работает центр «Здоровое
                      поколение» и как дети учатся заботиться о душе и теле.
                    </p>
                    <p className="text-cedar-beige mb-4">
                      Отец Олег дал нам историческую справку, поделился особенностями организации и своим видением ее
                      развития. Также он показал нам территорию храма и экопарк, за которым прихожане ухаживают
                      совместно со служителями.
                    </p>
                    
                    <motion.div className="mt-6" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button  className="bg-cedar-gold hover:bg-cedar-gold/90 text-cedar-beige transition-all duration-500">
                        <Link target="_blank" href='https://vkvideo.ru/video-230367682_456239021?list=ln-6kJ0ZjOgVvInex8E5U'>Погрузиться в экскурсию</Link>
                      </Button>
                    </motion.div>
                  </motion.div>
                </AnimateOnScroll>
              </div>
            </div>
          </section>
          
          {/* Directions Section */}
          <section id="направления" className="py-20 bg-cedar-beige relative">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-[url('/placeholder.svg?key=6vtyp')] bg-repeat"></div>
            </div>
            
            <div className="container mx-auto px-4 relative z-10">
              <AnimateOnScroll>
                <div className="max-w-3xl mx-auto text-center mb-16">
                  <AnimatedHeading className="text-3xl md:text-4xl mb-6 text-cedar-gold font-serif">
                    Основные направления центра
                  </AnimatedHeading>
                </div>
              </AnimateOnScroll>
              
              {/* Горизонтальный слайдер для направлений */}
              <DirectionsSlider />
            </div>
          </section>
          
          {/* Easter Workshop Section */}
          <section className="py-20 bg-cedar-green relative">
            <div className="container mx-auto px-4">
              <AnimateOnScroll>
                <div className="max-w-3xl mx-auto text-center mb-12">
                  <AnimatedHeading className="text-3xl md:text-4xl mb-6 text-cedar-gold font-serif">
                    Мастер-класс перед Пасхой
                  </AnimatedHeading>
                  <p className="text-cedar-beige">
                    За неделю до Пасхи дети из центра «Здоровое поколение» собрались на творческий мастер-класс, где
                    расписали деревянные яйца и узнали историю праздника. Ребятам помогали катехизаторы и наставники.
                  </p>
                </div>
              </AnimateOnScroll>
              
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <AnimateOnScroll>
                  <div>
                    <p className="text-cedar-beige mb-6">
                      Участники не только научились технике росписи, но и услышали рассказ о символическом значении этой
                      пасхальной традиции. Наша съемочная группа тоже поучаствовала в создании уникального яйца.
                    </p>
                    <motion.div
                      className="relative rounded-xl overflow-hidden shadow-2xl"
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.5 }}
                    >
                      {/* Decorative border */}
                      <div className="absolute inset-0 border-[12px] border-cedar-beige rounded-xl z-10 pointer-events-none"></div>
                      <div className="absolute inset-0 border-[3px] border-cedar-gold/30 rounded-xl z-20 pointer-events-none"></div>
                      <div className="absolute inset-[3px] border-[1px] border-cedar-gold/20 rounded-lg z-20 pointer-events-none"></div>
                      
                      {/* Decorative corners */}
                      <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-cedar-gold rounded-tl-lg z-30 pointer-events-none"></div>
                      <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-cedar-gold rounded-tr-lg z-30 pointer-events-none"></div>
                      <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-cedar-gold rounded-bl-lg z-30 pointer-events-none"></div>
                      <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-cedar-gold rounded-br-lg z-30 pointer-events-none"></div>
                      
                      <div className="aspect-w-16 aspect-h-9 bg-cedar-green">
                        <div className="flex items-center justify-center w-full h-full">
                          <div className="relative w-full h-full">
                            <iframe src="https://vkvideo.ru/video_ext.php?oid=-230367682&id=456239020&hd=2&hash=37e9c0431e7ad4d0"
                                    width="853"
                                    height="480"
                                    allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;"
                                    frameBorder="0"
                                    className="absolute top-0 left-0 w-full h-full"
                                    allowFullScreen></iframe>
                            
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </AnimateOnScroll>
                
                <motion.div
                  className="grid grid-cols-2 gap-4"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.2 }}
                  variants={staggerContainer}
                >
                  {[1,2,3,4].map((item) => (
                    <motion.div
                      key={item}
                      variants={staggerItem}
                      whileHover={{
                        scale: 1.05,
                        rotate: item % 2 === 0 ? 1 : -1,
                        zIndex: 10,
                      }}
                      className="rounded-lg w-[300px] h-[300px] relative overflow-hidden shadow-md transition-all duration-500  "
                    >
                      <Image
                        src={`/mk${item}.jpg`}
                        alt={`Фото с мастер-класса ${item}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 300px"
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </section>
          
          
          {/* Миссия, ценности и обращение - автоскролл секция */}
          <section id="миссия" className="relative">
            <AutoScrollText />
          </section>
          
          {/* Галерея фотографий */}
          <section id="галерея" className="relative">
            <PhotoGallery />
          </section>
          
          {/* Авторы секция */}
          <section id="авторы" className="relative">
            <AuthorsGrid />
          </section>
          
          {/* Научные руководители секция */}
          <section id="научные-руководители" className="relative">
            <ScientificLeadersGrid />
          </section>
          
          <footer className="bg-cedar-green">
            <AnimateOnScroll>
              <div className="max-w-3xl mt-16 mx-auto text-center mb-16 bg-cedar-green">
                <AnimatedHeading className="text-3xl md:text-4xl mb-6 text-cedar-gold font-serif">
                  Благодарность
                </AnimatedHeading>
                <p className="text-cedar-beige">
                  Наша команда выражает безмерную благодарность отцу Олегу, преподавателям центра, родителям, ребятам и другим прихожанам, которые не только были рады видеть съемочную группу на мастер-классе, но и с радостью отвечали на все наши вопросы. Конечно, не можем не упомянуть Олега Ивановича, Людмилу Вячеславовну и Василия Константиновича. Твердо и четко говорим всем вам спасибо!
                </p>
              </div>
            </AnimateOnScroll>
            
          </footer>
        </div>
      </main>
    </div>
  )
}
