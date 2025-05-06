//@ts-nocheck

"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/mobile-nav"
import { motion, useScroll, useTransform, useInView, useAnimation } from "framer-motion"

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
    >
      {children}
    </motion.div>
  )
}

// Компонент горизонтального слайдера для направлений
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
      icon: "church",
      bgColor: "bg-primary-light/50",
    },
    {
      title: "Спортивно-оздоровительное",
      description:
        "Регулярные спортивные занятия и соревнования помогают детям развивать физическую силу, выносливость и командный дух. Программа включает элементы традиционных боевых искусств, общую физическую подготовку и спортивные игры, направленные на формирование здорового образа жизни.",
      icon: "activity",
      bgColor: "bg-white",
    },
    {
      title: "Военно-патриотическое",
      description:
        "Воспитание любви к Родине, уважения к её истории и традициям. Дети изучают историю России, встречаются с ветеранами, участвуют в памятных мероприятиях. Особое внимание уделяется изучению подвигов русских воинов и святых защитников Отечества.",
      icon: "flag",
      bgColor: "bg-primary-light/50",
    },
    {
      title: "Творческое развитие",
      description:
        "Творческие мастерские и кружки помогают детям раскрыть свои таланты в различных направлениях искусства. Иконопись, хоровое пение, рукоделие и другие виды творчества позволяют детям выразить себя и познакомиться с богатым культурным наследием православной традиции.",
      icon: "palette",
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
          {/* Фоновый слой */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-light/20 to-white/20"></div>

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
                <div className={`relative bg-white rounded-xl p-8 shadow-lg ${direction.bgColor}`}>
                  {/* Декоративный элемент для эффекта "из-под вуали" */}
                  <motion.div
                    className="absolute inset-0 bg-accent-gold/5 rounded-xl"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: index === currentIndex ? 0 : 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                  />

                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <motion.div
                      className="w-24 h-24 rounded-full bg-accent-gold/10 flex items-center justify-center relative z-10 flex-shrink-0"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{
                        scale: index === currentIndex ? 1 : 0.8,
                        opacity: index === currentIndex ? 1 : 0.5,
                      }}
                      transition={{ delay: 0.2, duration: 0.8 }}
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: "rgba(212,175,55,0.2)",
                      }}
                    >
                      <Image
                        src={`/abstract-geometric-shapes.png?height=48&width=48&query=${direction.icon} icon`}
                        alt={direction.title}
                        width={48}
                        height={48}
                        className="h-12 w-12 text-accent-gold"
                      />
                    </motion.div>

                    <div className="flex-1">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                          opacity: index === currentIndex ? 1 : 0.5,
                          y: index === currentIndex ? 0 : 10,
                        }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                      >
                        <h3 className="font-serif text-2xl md:text-3xl font-bold text-accent-gold mb-4">
                          {direction.title}
                        </h3>

                        <motion.p
                          className="text-primary-dark/80 text-lg"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: index === currentIndex ? 1 : 0.5 }}
                          transition={{ delay: 0.4, duration: 0.8 }}
                        >
                          {direction.description}
                        </motion.p>
                      </motion.div>
                    </div>
                  </div>

                  {/* Декоративные элементы */}
                  <motion.div
                    className="absolute top-0 right-0 w-32 h-32 -mt-16 -mr-16 bg-accent-gold/5 rounded-full"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: index === currentIndex ? 1 : 0,
                      opacity: index === currentIndex ? 1 : 0,
                    }}
                    transition={{ delay: 0.5, duration: 1 }}
                  />

                  <motion.div
                    className="absolute bottom-0 left-0 w-24 h-24 -mb-12 -ml-12 bg-accent-gold/5 rounded-full"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: index === currentIndex ? 1 : 0,
                      opacity: index === currentIndex ? 1 : 0,
                    }}
                    transition={{ delay: 0.6, duration: 1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Навигационные кнопки */}
          <div className="absolute left-0 right-0 bottom-10 flex justify-center items-center gap-4 z-20">
            <motion.button
              className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md text-accent-gold border border-accent-gold/20"
              onClick={() => navigateSlide(-1)}
              whileHover={{ scale: 1.1, backgroundColor: "rgba(212,175,55,0.2)" }}
              whileTap={{ scale: 0.95 }}
              disabled={currentIndex === 0}
              initial={{ opacity: 0 }}
              animate={{ opacity: currentIndex > 0 ? 1 : 0.3 }}
            >
              <ChevronLeft className="h-6 w-6" />
            </motion.button>

            {/* Индикаторы */}
            <div className="flex gap-2">
              {directions.map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-3 w-3 rounded-full ${index === currentIndex ? "bg-accent-gold" : "bg-accent-gold/30"}`}
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{
                    scale: index === currentIndex ? 1.2 : 1,
                    opacity: index === currentIndex ? 1 : 0.5,
                  }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>

            <motion.button
              className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md text-accent-gold border border-accent-gold/20"
              onClick={() => navigateSlide(1)}
              whileHover={{ scale: 1.1, backgroundColor: "rgba(212,175,55,0.2)" }}
              whileTap={{ scale: 0.95 }}
              disabled={currentIndex === directions.length - 1}
              initial={{ opacity: 0 }}
              animate={{ opacity: currentIndex < directions.length - 1 ? 1 : 0.3 }}
            >
              <ChevronRight className="h-6 w-6" />
            </motion.button>
          </div>

          {/* Подсказка о скролле */}
          <motion.div
            className="absolute top-10 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md text-primary-dark/70 text-sm flex items-center gap-2"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <span>Скролл для навигации</span>
            <ChevronDown className="h-4 w-4" />
          </motion.div>
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
      "укреплению межпоколенческих связей."
    ],
    icon: "heart",
    color: "accent-gold",
  },
  {
    title: "Спорт и духовность идут рядом, формируя характер",
    content: [
      "Сочетание физического развития с духовно-нравственным воспитанием создаёт гармоничную личность, способную преодолевать трудности\n" +
      "и достигать поставленных целей."
    ],
    icon: "star",
    color: "accent-mint",
  },
  {
    title: "Вовлечённость прихожан — ключ к устойчивому развитию",
    content: [
      "Активное участие членов прихода в организации и проведении мероприятий обеспечивает устойчивость проекта и его\n" +
      "органичное развитие в соответствии с потребностями общины."
    ],
    icon: "users",
    color: "accent-green",
  },
  {
    title: "Системный подход дает долгосрочные результаты",
    content: [
      "Регулярность занятий и последовательная программа развития позволяют добиваться стабильного прогресса в воспитании детей\n" +
      "и подростков, формируя у них полезные привычки и навыки на всю жизнь."
    ],
    icon: "users",
    color: "accent-green",
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
      const sectionHeight = container.scrollHeight / sections.length
      const newActiveSection = Math.floor(scrollPosition / sectionHeight)
      
      if (newActiveSection !== activeSection && newActiveSection >= 0 && newActiveSection < sections.length) {
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
      <div className="absolute inset-0 bg-gradient-to-b from-primary-dark via-primary-dark to-primary-dark/80 z-0"></div>
      
      {/* Декоративные элементы */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-gold/5 rounded-full -mt-48 -mr-48 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-mint/5 rounded-full -mb-40 -ml-40 blur-3xl"></div>
      
      {/* Индикаторы секций */}
      <div className="absolute left-8 top-1/2 transform -translate-y-1/2 z-20 hidden md:flex flex-col gap-6">
        {sections.map((section, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-500 ${
              activeSection === index ? `bg-${section.color} w-4 h-4` : "bg-white/30 hover:bg-white/50"
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
        className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="h-screen flex items-center justify-center snap-start px-6 relative">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={activeSection === sectionIndex ? { opacity: 1, y: 0 } : { opacity: 0.3, y: 30 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-${section.color}/20 mb-6`}
                >
                  <Image
                    src={`/abstract-geometric-shapes.png?key=jhogl&height=32&width=32&query=${section.icon} icon`}
                    alt={section.title}
                    width={32}
                    height={32}
                    className={`text-${section.color}`}
                  />
                </motion.div>
                
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={activeSection === sectionIndex ? { opacity: 1, y: 0 } : { opacity: 0.3, y: 20 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                  className="font-serif text-3xl md:text-4xl lg:text-5xl mb-8 text-white"
                >
                  {section.title}
                </motion.h2>
              </div>
              
              <div className="space-y-8">
                {section.content.map((paragraph, paraIndex) => (
                  <motion.p
                    key={paraIndex}
                    initial={{ opacity: 0, y: 30 }}
                    animate={
                      activeSection === sectionIndex ? { opacity: 1, y: 0 } : { opacity: 0, y: paraIndex > 0 ? 30 : 0 }
                    }
                    transition={{
                      duration: 0.8,
                      ease: "easeOut",
                      delay: 0.2 + paraIndex * 0.2,
                    }}
                    className="text-lg md:text-xl text-white/90 leading-relaxed text-center max-w-3xl mx-auto"
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>
            </div>
            
            {/* Индикатор прокрутки вниз (только для последнего параграфа) */}
            {sectionIndex < sections.length - 1 && (
              <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
                animate={{
                  y: [0, 10, 0],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <ChevronDown className="h-8 w-8 text-white/50" />
              </motion.div>
            )}
          </div>
        ))}
      </div>
      
      {/* Кнопка включения/выключения автоскролла */}
      <button
        className={`absolute bottom-8 right-8 z-20 p-3 rounded-full ${
          autoScrollEnabled ? "bg-accent-gold/20" : "bg-white/10"
        }`}
        onClick={() => setAutoScrollEnabled(!autoScrollEnabled)}
        aria-label={autoScrollEnabled ? "Выключить автоскролл" : "Включить автоскролл"}
      >
        <motion.div animate={{ rotate: autoScrollEnabled ? 0 : 45 }} transition={{ duration: 0.3 }}>
          {autoScrollEnabled ? (
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
              className="text-white"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M10 8l6 4-6 4V8z" />
            </svg>
          ) : (
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
               className="text-white/70"
             >
               <circle cx="12" cy="12" r="10" />
               <path d="M10 15V9M14 15V9" />
             </svg>
           )}
        </motion.div>
      </button>
    </div>
  )
}

// Компонент для отображения авторов
const AuthorsGrid = () => {
  const authors = [
    {
      name: "Виктория Мордашева",
      role: "Редактор",
      image: "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/eeddc9ca-fae6-492f-b709-4ec279d01220",
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
    <div className="py-20 bg-white relative">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?key=bnm45')] bg-repeat"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <AnimatedHeading className="text-3xl md:text-4xl mb-6">Авторы</AnimatedHeading>
          <p className="text-primary-dark">Наша команда</p>
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
                <div className="absolute inset-0 rounded-full bg-accent-gold/10 transform scale-90 group-hover:scale-110 transition-transform duration-500"></div>
                <div className="relative w-40 h-40 md:w-48 md:h-48 mx-auto overflow-hidden rounded-full border-4 border-white shadow-lg">
                  <Image
                    src={author.image || "/placeholder.svg"}
                    alt={author.name}
                    width={200}
                    height={200}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <motion.div
                  className="absolute inset-0 rounded-full bg-accent-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{
                    boxShadow: ["0 0 0 0px rgba(212,175,55,0.3)", "0 0 0 10px rgba(212,175,55,0)"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                ></motion.div>
              </div>
              <h3 className="font-serif text-xl font-semibold text-primary-dark mb-1">{author.name}</h3>
              <p className="text-accent-gold text-sm">{author.role}</p>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Мобильная лента для прокрутки на маленьких экранах */}
        <div className="mt-12 md:hidden">
          <p className="text-center text-primary-dark/70 mb-4 text-sm italic">
            Прокрутите вправо, чтобы увидеть всех авторов
          </p>
          <div className="overflow-x-auto pb-6 -mx-4 px-4">
            <div className="flex space-x-6" style={{ minWidth: "max-content" }}>
              {authors.map((author, index) => (
                <motion.div
                  key={`mobile-${index}`}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: false, amount: 0.3 }}
                  className="flex flex-col items-center text-center w-32"
                >
                  <div className="relative mb-4 w-24 h-24 overflow-hidden rounded-full border-2 border-white shadow-md">
                    <Image
                      src={author.image || "/placeholder.svg"}
                      alt={author.name}
                      width={100}
                      height={100}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h3 className="font-serif text-sm font-semibold text-primary-dark mb-1">{author.name}</h3>
                  <p className="text-accent-gold text-xs">{author.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Компонент для отображения научных руководителей
const ScientificLeadersGrid = () => {
  const leaders = [
    {
      name: "Олег Сафронов",
      role: "Научный руководитель",
      image: "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/019bc7ff-93f0-43a2-af63-1b663748fc29",
    },
    {
      name: "Людмила Прохоренко",
      role: "Научный руководитель",
      image: "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/e46c8174-e0a0-4cbb-98c8-9de7129fe948",
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
    <div className="py-20 bg-white relative">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?key=bnm45')] bg-repeat"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <AnimatedHeading className="text-3xl md:text-4xl mb-6">Научные руководители</AnimatedHeading>
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
                <div className="absolute inset-0 rounded-full bg-accent-gold/10 transform scale-90 group-hover:scale-110 transition-transform duration-500"></div>
                <div className="relative w-48 h-48 md:w-56 md:h-56 mx-auto overflow-hidden rounded-full border-4 border-white shadow-lg">
                  <Image
                    src={leader.image || "/placeholder.svg"}
                    alt={leader.name}
                    width={240}
                    height={240}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <motion.div
                  className="absolute inset-0 rounded-full bg-accent-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{
                    boxShadow: ["0 0 0 0px rgba(212,175,55,0.3)", "0 0 0 10px rgba(212,175,55,0)"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                ></motion.div>
              </div>
              <h3 className="font-serif text-2xl font-semibold text-primary-dark mb-1">{leader.name}</h3>
              <p className="text-accent-gold text-lg">{leader.role}</p>
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
          <Link href="/" className="flex items-center gap-2">
            <Image src="/placeholder.svg?key=ieo9a" alt="Логотип центра" width={40} height={40} className="h-10 w-10" />
            <span className="font-serif text-xl font-semibold text-primary-dark">Центр "Здоровое поколение"</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {["О центре", "Направления", "Галерея", "Контакты"].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <Link
                  href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-primary-dark hover:text-accent-gold transition-colors duration-500"
                >
                  {item}
                </Link>
              </motion.div>
            ))}
          </nav>

          <MobileNav />
        </div>
      </motion.header>

      <main className="min-h-screen bg-primary-light overflow-x-clip">
        {/* Hero Section */}
        <section className="fixed-hero">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('/placeholder.svg?key=5rlyy')] bg-repeat opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white"></div>
          </div>

          <div className="container mx-auto px-4 py-16 relative z-10 h-screen flex flex-col items-center justify-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="flex flex-col items-center"
            >
              <motion.div variants={staggerItem}>
                <AnimatedHeading
                  level="h1"
                  className="text-4xl md:text-5xl lg:text-6xl mb-6 max-w-4xl mx-auto leading-tight text-center"
                >
                  Социальная деятельность РПЦ
                </AnimatedHeading>
              </motion.div>

              <motion.p
                variants={staggerItem}
                className="text-primary-dark text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed text-center"
              >
                Более 4,5 тыс. действующих групп милосердия по всей России и ближнему зарубежью. Мы расскажем об одной
                из них — о центре, в котором дети становятся сильными духом, телом и разумом.
              </motion.p>
            </motion.div>

            <motion.div
              className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
              animate={{
                y: [0, 10, 0],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <div className="small-logo-container mx-auto flex items-center justify-center">
                <Image
                  src="/logo-healthy-generation.png"
                  alt="Здоровое поколение"
                  width={40}
                  height={40}
                  className="small-logo"
                />
              </div>
              <ChevronDown className="h-8 w-8 text-accent-gold" />
            </motion.div>
          </div>
        </section>

        <div className="h-screen"></div>

        <div className="content-wrapper">
          {/* About Temple Section */}
          <section id="о-центре" className="py-20 bg-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-[url('/placeholder.svg?key=kg4m1')] bg-repeat"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
              <AnimateOnScroll>
                <div className="max-w-3xl mx-auto text-center mb-16">
                  <AnimatedHeading className="text-3xl md:text-4xl mb-6">
                    Проект «Здоровое поколение» создали прихожане храма св. Уара в Подмосковье
                  </AnimatedHeading>
                </div>
              </AnimateOnScroll>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                <AnimateOnScroll>
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: false, amount: 0.2 }}
                  >
                    <p className="text-primary-dark">
                      Святой Уар почитается как единственный святой в православной традиции, являющийся небесным
                      ходатаем за некрещеных умерших и младенцев, умерших во чреве матери или при родах. Он жил в Египте
                      в конце III - начале IV веков в чину военачальника Тианской когорты.
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
                      src="/placeholder.svg?key=eg0j1"
                      alt="Храм святого мученика Уара"
                      width={800}
                      height={600}
                      className="w-full h-auto object-cover"
                    />
                  </motion.div>
                </AnimateOnScroll>
              </div>
            </div>
          </section>

          {/* About Temple History Section - NEW */}
          <section id="о-храме" className="py-20 bg-primary-light relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-[url('/placeholder.svg?key=3fqty')] bg-repeat opacity-10"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
              <AnimateOnScroll>
                <div className="max-w-3xl mx-auto text-center mb-24">
                  <AnimatedHeading className="text-3xl md:text-4xl mb-6">О храме</AnimatedHeading>
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
                      <AnimatedHeading level="h3" className="text-2xl mb-4">
                        История храма
                      </AnimatedHeading>
                      <p className="text-primary-dark mb-6">
                        Храм святого мученика Уара в посёлке Вёшки Мытищинского городского округа — один из немногих
                        православных храмов в России, освящённых в честь этого святого. История храма началась в 2000
                        году, когда прихожане получили благословение на строительство.
                      </p>
                      <p className="text-primary-dark">
                        После разрушения старинного храма пророка Илии, существовавшего в Вёшках в XVIII веке, на
                        протяжении долгого времени в посёлке не было действующего прихода. Новый храм построили в 2003
                        году, а первая Божественная литургия прошла здесь весной того же года на Пасху.
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
                        src="/orthodox-church-exterior.png"
                        alt="Внешний вид храма святого мученика Уара"
                        width={800}
                        height={600}
                        className="w-full h-auto object-cover rounded-lg"
                      />
                      <motion.div
                        className="absolute -bottom-4 -right-4 bg-white p-2 rounded shadow-md"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                      >
                        <p className="text-sm text-primary-dark/80 italic">Храм святого мученика Уара, 2024 г.</p>
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
                        src="/placeholder.svg?key=eg1k9"
                        alt="Иконостас храма"
                        width={800}
                        height={600}
                        className="w-full h-auto object-cover rounded-lg"
                      />
                      <motion.div
                        className="absolute -bottom-4 -left-4 bg-white p-2 rounded shadow-md"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                      >
                        <p className="text-sm text-primary-dark/80 italic">
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
                      <AnimatedHeading level="h3" className="text-2xl mb-4">
                        Внутреннее убранство
                      </AnimatedHeading>
                      <p className="text-primary-dark mb-6">
                        Внутреннее убранство храма отличается особой красотой. Иконостас, покрытый сусальным золотом,
                        выполнен в стиле русского барокко мастерами из Палеха. Резные элементы и уникальные иконы
                        создают атмосферу благоговения и умиротворения.
                      </p>
                      <p className="text-primary-dark">
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
                      <AnimatedHeading level="h3" className="text-2xl mb-4">
                        Современная жизнь прихода
                      </AnimatedHeading>
                      <p className="text-primary-dark mb-6">
                        Сегодня храм святого мученика Уара — это не только место для молитвы, но и важный духовный и
                        социальный центр. При храме действует воскресная школа для детей и взрослых, проводятся
                        катехизаторские беседы, работает библиотека духовной литературы.
                      </p>
                      <p className="text-primary-dark">
                        Особой гордостью храма стал центр «Здоровое поколение», где ведется систематическая работа по
                        физическому и духовному развитию детей. Благодаря активности прихожан храм превратился в место,
                        где каждый может найти поддержку и укрепиться в вере.
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
                        src="/placeholder.svg?key=keiyt"
                        alt="Прихожане во время службы"
                        width={800}
                        height={600}
                        className="w-full h-auto object-cover rounded-lg"
                      />
                      <motion.div
                        className="absolute -bottom-4 -right-4 bg-white p-2 rounded shadow-md"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                      >
                        <p className="text-sm text-primary-dark/80 italic">Прихожане храма на воскресной службе</p>
                      </motion.div>
                    </motion.div>
                  </AnimateOnScroll>
                </div>
              </div>
            </div>
          </section>

          {/* Video Tour Section */}
          <section className="py-16 bg-white relative">
            <div className="container mx-auto px-4">
              <AnimateOnScroll>
                <div className="max-w-3xl mx-auto text-center mb-8">
                  <AnimatedHeading className="text-3xl md:text-4xl mb-4">
                    Прогулка по территории храма с отцом Олегом Мумриковым
                  </AnimatedHeading>
                </div>
              </AnimateOnScroll>

              <div className="grid md:grid-cols-2 gap-8 items-center min-h-[70vh]">
                <AnimateOnScroll>
                  <motion.div
                    className="relative rounded-xl overflow-hidden shadow-2xl"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Decorative border */}
                    <div className="absolute inset-0 border-[12px] border-primary-light rounded-xl z-10 pointer-events-none"></div>
                    <div className="absolute inset-0 border-[3px] border-accent-gold/30 rounded-xl z-20 pointer-events-none"></div>
                    <div className="absolute inset-[3px] border-[1px] border-accent-gold/20 rounded-lg z-20 pointer-events-none"></div>

                    {/* Decorative corners */}
                    <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-accent-gold rounded-tl-lg z-30 pointer-events-none"></div>
                    <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-accent-gold rounded-tr-lg z-30 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-accent-gold rounded-bl-lg z-30 pointer-events-none"></div>
                    <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-accent-gold rounded-bl-lg z-30 pointer-events-none"></div>

                    <div className="aspect-w-16 aspect-h-9 bg-primary-dark">
                      <div className="flex items-center justify-center w-full h-full">
                        <div className="relative w-full h-full">
                          <Image
                            src="/placeholder.svg?key=i3744"
                            alt="Видео-тур по территории храма"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-primary-dark/30 flex items-center justify-center">
                            <motion.div
                              className="w-20 h-20 rounded-full bg-accent-gold/90 flex items-center justify-center cursor-pointer hover:bg-accent-gold transition-colors duration-300"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              animate={{
                                boxShadow: [
                                  "0px 0px 0px rgba(212,175,55,0.3)",
                                  "0px 0px 20px rgba(212,175,55,0.7)",
                                  "0px 0px 0px rgba(212,175,55,0.3)",
                                ],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                              }}
                            >
                              <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimateOnScroll>

                <AnimateOnScroll>
                  <motion.div
                    className="bg-primary-light/30 p-6 rounded-xl border border-accent-gold/10"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: false, amount: 0.2 }}
                  >
                    <AnimatedHeading level="h3" className="text-2xl mb-4">
                      О видео-экскурсии
                    </AnimatedHeading>
                    <p className="text-primary-dark mb-4">
                      Наша команда приехала в храм святого мученика Уара, чтобы узнать подробнее о том, как работает
                      центр «Здоровое поколение» и как дети учатся заботиться о душе и теле.
                    </p>
                    <p className="text-primary-dark mb-4">
                      Настоятель храма объяснил, как возникла организация, и поделился ее особенностями. Также он
                      показал нам территорию храма и экопарк, за которым прихожане ухаживают совместно со служителями.
                    </p>
                    <p className="text-primary-dark">
                      В этом видео вы увидите не только архитектуру храма, но и познакомитесь с повседневной жизнью
                      прихода, узнаете о традициях и особенностях духовного воспитания детей.
                    </p>
                    <motion.div className="mt-6" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button className="bg-accent-gold hover:bg-accent-gold/90 text-white transition-all duration-500">
                        Смотреть полную версию
                      </Button>
                    </motion.div>
                  </motion.div>
                </AnimateOnScroll>
              </div>
            </div>
          </section>

          {/* Directions Section */}
          <section id="направления" className="py-20 bg-primary-light relative">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-[url('/placeholder.svg?key=6vtyp')] bg-repeat"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
              <AnimateOnScroll>
                <div className="max-w-3xl mx-auto text-center mb-16">
                  <AnimatedHeading className="text-3xl md:text-4xl mb-6">Основные направления центра</AnimatedHeading>
                </div>
              </AnimateOnScroll>

              {/* Горизонтальный слайдер для направлений */}
              <DirectionsSlider />
            </div>
          </section>

          {/* Easter Workshop Section */}
          {/* Easter Workshop Section */}
          <section className="py-20 bg-white relative">
            <div className="container mx-auto px-4">
              <AnimateOnScroll>
                <div className="max-w-3xl mx-auto text-center mb-12">
                  <AnimatedHeading className="text-3xl md:text-4xl mb-6">Мастер-класс перед Пасхой</AnimatedHeading>
                  <p className="text-primary-dark">
                    За неделю до Пасхи дети из центра «Здоровое поколение» собрались на творческий мастер-класс, где
                    расписали деревянные яйца и узнали историю праздника. Ребятам помогали катехизаторы и наставники.
                  </p>
                </div>
              </AnimateOnScroll>
              
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <AnimateOnScroll>
                  <div>
                    <p className="text-primary-dark mb-6">
                      Участники не только научились технике росписи, но и услышали рассказ о символическом значении этой
                      пасхальной традиции. Наша съемочная группа тоже поучаствовала в создании уникального яйца.
                    </p>
                    <motion.div
                      className="relative rounded-xl overflow-hidden shadow-2xl"
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.5 }}
                    >
                      {/* Decorative border */}
                      <div className="absolute inset-0 border-[12px] border-primary-light rounded-xl z-10 pointer-events-none"></div>
                      <div className="absolute inset-0 border-[3px] border-accent-gold/30 rounded-xl z-20 pointer-events-none"></div>
                      <div className="absolute inset-[3px] border-[1px] border-accent-gold/20 rounded-lg z-20 pointer-events-none"></div>
                      
                      {/* Decorative corners */}
                      <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-accent-gold rounded-tl-lg z-30 pointer-events-none"></div>
                      <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-accent-gold rounded-tr-lg z-30 pointer-events-none"></div>
                      <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-accent-gold rounded-bl-lg z-30 pointer-events-none"></div>
                      <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-accent-gold rounded-br-lg z-30 pointer-events-none"></div>
                      
                      <div className="aspect-w-16 aspect-h-9 bg-primary-dark">
                        <div className="flex items-center justify-center w-full h-full">
                          <div className="relative w-full h-full">
                            <Image
                              src="/placeholder.svg?key=q8e55"
                              alt="Мастер-класс по росписи пасхальных яиц"
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-primary-dark/30 flex items-center justify-center">
                              <motion.div
                                className="w-20 h-20 rounded-full bg-accent-gold/90 flex items-center justify-center cursor-pointer hover:bg-accent-gold transition-colors duration-300"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                animate={{
                                  boxShadow: [
                                    "0px 0px 0px rgba(212,175,55,0.3)",
                                    "0px 0px 20px rgba(212,175,55,0.7)",
                                    "0px 0px 0px rgba(212,175,55,0.3)",
                                  ],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Number.POSITIVE_INFINITY,
                                  ease: "easeInOut",
                                }}
                              >
                                <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                              </motion.div>
                            </div>
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
                  {[1, 2, 3, 4].map((item) => (
                    <motion.div
                      key={item}
                      variants={staggerItem}
                      whileHover={{
                        scale: 1.05,
                        rotate: item % 2 === 0 ? 1 : -1,
                        zIndex: 10,
                      }}
                      className="rounded-lg overflow-hidden shadow-md transition-all duration-500"
                    >
                      <Image
                        src={`/placeholder.svg?key=h8x9d&key=aprws&key=dp0b2&key=4s8uy&key=2wyc1&key=m0z3c&key=0quej&key=vnhi1&key=2fzck&key=plv9q&key=mhilp&key=cf959&key=9cc1b&key=to8v9&key=257qz&key=43reg&key=klizv&key=pchbf&key=sqfwc&key=ulhds&key=55uqh&key=p54cz&key=hzbzm&key=71qyl&key=hvdg3&key=s1k2d&key=1nce2&key=6c0rg&key=aidwr&height=300&width=300&query=orthodox easter egg painting workshop image ${item}`}
                        alt={`Фото с мастер-класса ${item}`}
                        width={300}
                        height={300}
                        className="w-full h-auto"
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
          
          {/* Авторы секция */}
          <section id="авторы" className="relative">
            <AuthorsGrid />
          </section>
          
          {/* Научные руководители секция */}
          <section id="научные-руководители" className="relative">
            <ScientificLeadersGrid />
          </section>
          
          {/* Остальные секции... */}
        </div>
      </main>
    </div>
  )
}
