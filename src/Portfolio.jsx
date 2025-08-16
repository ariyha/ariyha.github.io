import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { ChevronDown, Github, Linkedin, Mail, ExternalLink, Award, Code, Terminal, User, Briefcase, GraduationCap, FileText, Download } from 'lucide-react';

const Portfolio = () => {
  const darkMode = true;
  const [currentSection, setCurrentSection] = useState('home');
  const [typedText, setTypedText] = useState('');
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [particles, setParticles] = useState([]);
  const [connections, setConnections] = useState([]);
  const [scrollY, setScrollY] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [cursorTrail, setCursorTrail] = useState([]);
  const [isHovering, setIsHovering] = useState(false);
  const terminalRef = useRef(null);
  const observerRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  // Enhanced mouse handling with trail
  const fullText = "const developer = new NithishAriyha();";

  // Typing animation
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, []);
  
  const handleMouseMove = useCallback((e) => {
    const newPosition = { x: e.clientX, y: e.clientY };
    setCursorPosition(newPosition);
    
    // Update cursor trail
    setCursorTrail(prevTrail => {
      const newTrail = [...prevTrail, { 
        x: newPosition.x, 
        y: newPosition.y, 
        id: Date.now() + Math.random() 
      }];
      // Keep only the last 8 trail points for smooth effect
      return newTrail.slice(-8);
    });
  }, []);

  // Optimized hover handlers
  const handleMouseEnter = useCallback(() => setIsHovering(true), []);
  const handleMouseLeave = useCallback(() => setIsHovering(false), []);

  // Optimized scroll handler
  const handleScroll = useCallback(() => {
    if (animationFrameRef.current) return;
    animationFrameRef.current = requestAnimationFrame(() => {
      setScrollY(window.scrollY);
      animationFrameRef.current = null;
    });
  }, []);

  // Optimized comet particle system
  useEffect(() => {
    const generateComets = () => {
      const newComets = Array.from({ length: 15 }, (_, i) => ({ // Reduced from 25 to 15
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2 + 2,
        speedX: (Math.random() - 0.5) * 0.8 + 0.3, // Reduced base speed from 1.5+0.8 to 0.8+0.3
        speedY: (Math.random() - 0.5) * 0.5 + 0.2, // Reduced base speed from 1+0.4 to 0.5+0.2
        opacity: Math.random() * 0.6 + 0.4,
        trail: [],
        angle: Math.random() * Math.PI * 2,
        depth: Math.random() * 0.8 + 0.2, // Wider depth range for better parallax (was 0.6+0.4)
        color: `hsl(${180 + Math.random() * 60}, 70%, ${60 + Math.random() * 30}%)`,
      }));
      
      setParticles(newComets);
    };

    generateComets();

    const animateComets = () => {
      setParticles(prevComets => {
        return prevComets.map(comet => {
          // Enhanced parallax calculation - particles with lower depth move slower
          const parallaxFactor = comet.depth * comet.depth; // Squared for more dramatic effect
          const scrollEffect = scrollY * (1 - comet.depth) * 0.03; // Inverted depth for scroll parallax
          
          // Slower movement with more pronounced depth differences
          let newX = comet.x + comet.speedX * parallaxFactor * 0.7; // Additional speed reduction
          let newY = comet.y + comet.speedY * parallaxFactor * 0.7 + scrollEffect * 0.08;

          // Wrap around screen edges
          if (newX > window.innerWidth + 50) newX = -50;
          if (newX < -50) newX = window.innerWidth + 50;
          if (newY > window.innerHeight + 50) newY = -50;
          if (newY < -50) newY = window.innerHeight + 50;

          // Simplified trail - only 4 points
          const newTrail = [...comet.trail, { x: comet.x, y: comet.y, opacity: comet.opacity }];
          if (newTrail.length > 4) newTrail.shift();

          const fadedTrail = newTrail.map((point, index) => ({
            ...point,
            opacity: point.opacity * (index / newTrail.length) * 0.3
          }));

          return { 
            ...comet, 
            x: newX, 
            y: newY,
            trail: fadedTrail,
            angle: comet.angle + (0.008 * parallaxFactor), // Rotation speed also affected by depth
            opacity: Math.max(0.4, Math.min(0.8, comet.opacity + Math.sin(Date.now() * 0.0005 + comet.id) * 0.05))
          };
        });
      });
    };

    const interval = setInterval(animateComets, 80); // Slightly faster for smoother motion with reduced speeds

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', generateComets, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', generateComets);
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleMouseMove, handleScroll, scrollY]);

  // Easter egg (Konami code)
  useEffect(() => {
    const konamiSequence = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let konamiPosition = 0;

    const handleKeyPress = (e) => {
      // Normalize single-character keys to lowercase, leave Arrow... keys as-is
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const expected = konamiSequence[konamiPosition];

      if (key === expected) {
        konamiPosition += 1;

        if (konamiPosition === konamiSequence.length) {
          setShowEasterEgg(true);
          konamiPosition = 0; // reset after successful entry
        }
      } else {
        // Reset position — but if this key matches the first key, start from 1
        konamiPosition = key === konamiSequence[0] ? 1 : 0;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Cursor trail cleanup effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorTrail(prevTrail => {
        // Remove older trail points gradually
        return prevTrail.slice(-10); // Keep only 6 most recent points
      });
    }, 50); // Update every 50ms for smooth trail

    return () => clearInterval(interval);
  }, []);

  // Scroll observer
  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1 });

    const sections = document.querySelectorAll('.observe-section');
    sections.forEach(section => observerRef.current?.observe(section));

    return () => observerRef.current?.disconnect();
  }, []);

  const projects = [
    {
      title: "SignSpeak",
      tech: ["Python", "PyTorch", "Flask", "Flutter", "MongoDB"],
      description: "Real-time multilingual sign language recognition with 98% accuracy",
      achievements: ["MobileNet-based CNNs", "Cross-lingual performance", "Mobile app with offline inference"],
      github: "#"
    },
    {
      title: "RagGit",
      tech: ["Python", "PyTorch", "Flask", "CrewAI", "Gemini"],
      description: "LLM-powered chatbot for Git repository insights",
      achievements: ["Multi-agent intelligence", "80% accuracy", "60% manual work reduction"],
      github: "#"
    },
    {
      title: "Hospital Management System",
      tech: ["Go", "Python", "Redis", "Azure", "PostgreSQL"],
      description: "Complete hospital operations management system",
      achievements: ["40% task reduction", "99.9% uptime", "AI-powered chatbot"],
      github: "#"
    }
  ];

  const skills = {
    "Languages": [
      { name: "Java", icon: "☕", color: "text-orange-400" },
      { name: "Python", icon: "🐍", color: "text-yellow-400" },
      { name: "C++", icon: "⚡", color: "text-blue-400" },
      { name: "JavaScript", icon: "🟨", color: "text-yellow-300" },
      { name: "Kotlin", icon: "🎯", color: "text-purple-400" },
      { name: "Dart", icon: "🎯", color: "text-cyan-400" },
      { name: "Rust", icon: "🦀", color: "text-orange-500" }
    ],
    "Frameworks": [
      { name: "React", icon: "⚛️", color: "text-cyan-400" },
      { name: "Next.js", icon: "▲", color: "text-white" },
      { name: "Flask", icon: "🌶️", color: "text-red-400" },
      { name: "PyTorch", icon: "🔥", color: "text-orange-400" },
      { name: "Flutter", icon: "💙", color: "text-blue-400" }
    ],
    "Databases": [
      { name: "PostgreSQL", icon: "🐘", color: "text-blue-500" },
      { name: "MongoDB", icon: "🍃", color: "text-green-400" },
      { name: "Redis", icon: "🔴", color: "text-red-500" }
    ],
    "DevOps": [
      { name: "Git", icon: "🌿", color: "text-orange-400" },
      { name: "Azure", icon: "☁️", color: "text-blue-400" },
      { name: "Docker", icon: "🐳", color: "text-blue-500" },
      { name: "GitLab CI/CD", icon: "🔄", color: "text-orange-500" }
    ],
    "AI/ML": [
      { name: "Machine Learning", icon: "🤖", color: "text-purple-400" },
      { name: "Deep Learning", icon: "🧠", color: "text-pink-400" },
      { name: "NLP", icon: "💬", color: "text-green-400" },
      { name: "Computer Vision", icon: "👁️", color: "text-cyan-400" }
    ]
  };

  const experience = [
    {
      role: "Software Developer Intern",
      company: "Bank of New York",
      period: "May 2025 - July 2025",
      achievements: [
        "Hardened test coverage by 45%, reducing production incidents",
        "Optimized CI/CD pipelines, reducing build time by 30%",
        "Remediated critical security vulnerabilities"
      ]
    }
  ];

  const publications = [
    {
      title: "Waves Don't Lie: Leveraging Test-Time Training and Kolmogorov Arnold Networks for EEG-Based Biometrics",
      venue: "ICBSII Conference Proceedings",
      award: "Best Paper in Track",
      date: "March 2025"
    },
    {
      title: "Political Sentiment Analysis of Tamil X(Twitter) Comments using LaBSE and SVM",
      venue: "Fifth Workshop on Speech, Vision, and Language Technologies",
      award: "Rank 5 in Shared Task",
      date: "May 2025"
    }
  ];

  return (
    <div className="min-h-screen transition-colors duration-500 bg-gray-900">
      {/* Enhanced Comet Particle System */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Comet connections */}
        <svg className="absolute inset-0 w-full h-full">
          {connections.map((connection, i) => (
            <line
              key={i}
              x1={connection.x1}
              y1={connection.y1}
              x2={connection.x2}
              y2={connection.y2}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1"
              opacity={connection.opacity}
            />
          ))}
        </svg>
        
        {/* Moving comets with trails */}
        {particles.map(comet => (
          <div key={comet.id} className="absolute">
            {/* Simplified comet trail */}
            {comet.trail.map((trailPoint, index) => (
              <div
                key={index}
                className="absolute rounded-full"
                style={{
                  transform: `translate3d(${trailPoint.x - (comet.size * (index + 1)) / (comet.trail.length * 2)}px, ${trailPoint.y - (comet.size * (index + 1)) / (comet.trail.length * 2)}px, 0) scale(${comet.depth})`,
                  width: `${(comet.size * (index + 1)) / comet.trail.length}px`,
                  height: `${(comet.size * (index + 1)) / comet.trail.length}px`,
                  background: comet.color,
                  opacity: trailPoint.opacity,
                  willChange: 'transform'
                }}
              />
            ))}
            
            {/* Main comet */}
            <div
              className="absolute rounded-full"
              style={{
                transform: `translate3d(${comet.x - comet.size/2}px, ${comet.y - comet.size/2}px, 0) rotate(${comet.angle}rad) scale(${comet.depth})`,
                width: `${comet.size}px`,
                height: `${comet.size}px`,
                background: `radial-gradient(circle, ${comet.color} 0%, transparent 70%)`,
                opacity: comet.opacity,
                boxShadow: `0 0 ${comet.size * 2}px ${comet.color}`,
                willChange: 'transform'
              }}
            />
          </div>
        ))}
        
        {/* Additional floating elements with scroll animation */}
        <div 
          className="absolute top-20 left-10 w-2 h-2 bg-white rounded-full animate-pulse opacity-80"
          style={{ transform: `translateY(${scrollY * 0.2}px) rotate(${scrollY * 0.3}deg)` }}
        ></div>
        <div 
          className="absolute top-40 right-20 w-1 h-1 bg-white rounded-full animate-ping opacity-60"
          style={{ transform: `translateY(${scrollY * -0.15}px) translateX(${Math.sin(scrollY * 0.01) * 10}px)` }}
        ></div>
        <div 
          className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-white rounded-full animate-bounce opacity-70"
          style={{ transform: `translateY(${scrollY * 0.1}px) scale(${1 + Math.sin(scrollY * 0.02) * 0.3})` }}
        ></div>
        <div 
          className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse opacity-50"
          style={{ transform: `translateY(${scrollY * -0.25}px) rotate(${scrollY * 0.5}deg)` }}
        ></div>
        
        {/* Cursor Trail Effect */}
        {cursorTrail.map((point, index) => (
          <div
            key={point.id}
            className="absolute rounded-full pointer-events-none cursor-trail-point"
            style={{
              left: point.x - 4,
              top: point.y - 4,
              width: '8px',
              height: '8px',
              background: `radial-gradient(circle, rgba(139, 92, 246, ${1 - (index / cursorTrail.length)}) 0%, transparent 70%)`,
              transform: `scale(${1 - (index / cursorTrail.length) * 0.8})`,
              transition: 'all 0.15s ease-out',
              zIndex: 9998,
              mixBlendMode: 'screen',
              boxShadow: `0 0 ${12 - (index * 1.5)}px rgba(139, 92, 246, ${0.8 - (index / cursorTrail.length) * 0.6})`,
              animationDelay: `${index * 0.05}s`
            }}
          />
        ))}
        
      </div>

      <div className="text-white relative z-10 min-h-screen">
        {/* Navigation */}
        <nav className="fixed top-0 w-full bg-gray-900/95 backdrop-blur-md z-40 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="font-mono text-lg font-bold text-blue-400">
                &lt;NithishAriyha /&gt;
              </div>
              <div className="hidden md:flex space-x-8">
                {['Home', 'About', 'Experience', 'Projects', 'Publications', 'Contact'].map(item => (
                  <button
                    key={item}
                    className="hover:text-blue-400 transition-colors font-medium"
                    onClick={() => document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section id="home" className="min-h-screen flex items-center justify-center px-4 relative">
          <div className="text-center max-w-4xl">
            <div className="mb-8">
              <div className="bg-gray-800 dark:bg-gray-800 rounded-lg p-6 font-mono text-left max-w-2xl mx-auto shadow-2xl border border-gray-700">
                <div className="flex items-center mb-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="ml-4 text-gray-400 text-sm">terminal.js</span>
                </div>
                <div className="text-green-400">
                  <span className="text-blue-400">$</span> {typedText}
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-poppins">
              Nithish Ariyha K
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 font-inter font-medium">
              AI Researcher & Full-Stack Developer
            </p>
            <div className="flex justify-center space-x-6 mb-12">
              <a 
                href="https://github.com/ariyha" 
                className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25 group"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Github size={24} className="group-hover:text-blue-400 transition-colors" />
              </a>
              <a 
                href="https://linkedin.com/in/nithishariyha" 
                className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25 group"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Linkedin size={24} className="group-hover:text-blue-400 transition-colors" />
              </a>
              <a 
                href="mailto:nithishariyha02467@gmail.com" 
                className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25 group"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Mail size={24} className="group-hover:text-blue-400 transition-colors" />
              </a>
            </div>
            <div className="animate-bounce">
              <ChevronDown size={32} className="mx-auto text-blue-400" />
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 px-4 observe-section">
          <div className="max-w-6xl mx-auto bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            <div className="bg-gray-800 rounded-lg p-6 font-mono text-left max-w-3xl mx-auto shadow-2xl border border-gray-600 mb-12">
              <div className="flex items-center mb-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="ml-4 text-gray-400 text-sm">about.js</span>
              </div>
              <div className="text-green-400">
                <span className="text-blue-400">const</span> <span className="text-purple-400">developer</span> = {'{'}
                <br />
                &nbsp;&nbsp;<span className="text-yellow-400">name</span>: <span className="text-green-300">"Nithish Ariyha K"</span>,
                <br />
                &nbsp;&nbsp;<span className="text-yellow-400">role</span>: <span className="text-green-300">"AI Researcher & Full-Stack Developer"</span>,
                <br />
                &nbsp;&nbsp;<span className="text-yellow-400">location</span>: <span className="text-green-300">"India"</span>,
                <br />
                &nbsp;&nbsp;<span className="text-yellow-400">status</span>: <span className="text-green-300">"Open to opportunities"</span>
                <br />
                {'}'};
              </div>
            </div>
            <h2 className="text-4xl font-bold mb-12 text-center font-poppins">
              <span className="text-blue-400">&lt;</span>
              <User className="inline mx-2" />
              <span className="text-green-400">About</span>
              <span className="text-blue-400"> /&gt;</span>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-6">
                <p className="text-lg text-gray-300 mb-6 font-inter">
                  I'm a passionate AI researcher and full-stack developer pursuing B.Tech in Computer Science 
                  with specialization in Artificial Intelligence at Amrita Vishwa Vidyapeetham.
                  I've been exploring the intersection of AI and practical applications.
                </p>
                <p className="text-lg text-gray-300 mb-6 font-inter">
                  My journey spans from developing real-time sign language recognition systems to building 
                  enterprise-grade applications. I've secured AIR 178 in GATE 2025 (Data Science) and have 
                  multiple publications in international conferences.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center font-mono border border-blue-500/50 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/25 group hover:scale-105"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Download className="mr-2 group-hover:animate-bounce" size={20} />
                    Download Resume
                  </button>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-gray-800/90 p-6 rounded-lg shadow-lg border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 group">
                  <div className="flex items-center mb-4">
                    <GraduationCap className="text-blue-400 mr-3 flex-shrink-0" size={24} />
                    <h3 className="text-xl font-bold font-mono">// Education</h3>
                  </div>
                  <div className="space-y-3 font-mono">
                    <div className="pl-4 border-l-2 border-blue-500/30 group-hover:border-blue-500/60 transition-colors">
                      <p className="font-semibold text-green-400">B.Tech Computer Science (AI)</p>
                      <p className="text-gray-400 text-sm">Amrita Vishwa Vidyapeetham</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-800/90 p-6 rounded-lg shadow-lg border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group">
                  <div className="flex items-center mb-4">
                    <Award className="text-purple-400 mr-3 flex-shrink-0" size={24} />
                    <h3 className="text-xl font-bold font-mono">// Achievements</h3>
                  </div>
                  <div className="space-y-2 font-mono">
                    <p className="flex items-center pl-4 border-l-2 border-purple-500/30 group-hover:border-purple-500/60 transition-colors text-sm">
                      <span className="text-green-400 mr-2 flex-shrink-0">✓</span>GATE 2025 AIR <span className="text-yellow-400 mx-1">178</span> (Data Science)
                    </p>
                    <p className="flex items-center pl-4 border-l-2 border-purple-500/30 group-hover:border-purple-500/60 transition-colors text-sm">
                      <span className="text-green-400 mr-2 flex-shrink-0">✓</span><span className="text-yellow-400">200+</span> LeetCode Problems
                    </p>
                    <p className="flex items-center pl-4 border-l-2 border-purple-500/30 group-hover:border-purple-500/60 transition-colors text-sm">
                      <span className="text-green-400 mr-2 flex-shrink-0">✓</span>Best Paper Award <span className="text-blue-400"> &nbsp;(ICBSII)</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="py-20 px-4 observe-section">
          <div className="max-w-6xl mx-auto bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-600/50">
            <div className="bg-gray-800 rounded-lg p-6 font-mono text-left max-w-2xl mx-auto shadow-2xl border border-gray-600 mb-12">
              <div className="flex items-center mb-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="ml-4 text-gray-400 text-sm">skills.json</span>
              </div>
              <div className="text-green-400">
                <span className="text-blue-400">$</span> cat skills.json | jq '.languages[]'
                <br />
                <span className="animate-pulse text-yellow-400">|</span>
              </div>
            </div>
            <h2 className="text-4xl font-bold mb-12 text-center font-poppins">
              <span className="text-blue-400">&lt;</span>
              <Code className="inline mx-2" />
              <span className="text-green-400">Technical Skills</span>
              <span className="text-blue-400"> /&gt;</span>
            </h2>
            <div className="space-y-8">
              {Object.entries(skills).map(([category, items], index) => (
                <div key={category} className="bg-gray-900/90 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-600/30 hover:border-blue-500/50 group">
                  <div className="flex items-center mb-6">
                    <span className="text-green-400 font-mono mr-3 text-lg">{index + 1}.</span>
                    <h3 className="text-xl font-bold text-blue-400 font-mono">/{category.toLowerCase()}</h3>
                  </div>
                  <div className="flex flex-wrap gap-4 justify-start">
                    {items.map((skill, skillIndex) => (
                      <div 
                        key={skill.name} 
                        className="bg-gray-800/70 p-4 rounded-lg hover:bg-gray-700/70 transition-all duration-300 group-hover:transform group-hover:scale-105 border border-gray-600/30 hover:border-blue-400/50 flex flex-col items-center justify-center text-center cursor-pointer aspect-square"
                        style={{
                          width: '100px',
                          height: '100px',
                          minWidth: '80px',
                          minHeight: '80px'
                        }}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                        title={skill.name}
                      >
                        <div className={`text-2xl mb-1 ${skill.color} group-hover:scale-110 transition-transform duration-300`}>
                          {skill.icon}
                        </div>
                        <span className="text-gray-300 text-xs font-mono leading-tight truncate w-full text-center">
                          {skill.name.split(' ').length > 1 ? skill.name.split(' ')[0] : skill.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-20 px-4 observe-section">
          <div className="max-w-6xl mx-auto bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            <div className="bg-gray-800 rounded-lg p-6 font-mono text-left max-w-2xl mx-auto shadow-2xl border border-gray-600 mb-12">
              <div className="flex items-center mb-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="ml-4 text-gray-400 text-sm">experience.log</span>
              </div>
              <div className="text-green-400">
                <span className="text-blue-400">$</span> grep -r "achievements" work_history/
                <br />
                <span className="animate-pulse text-yellow-400">|</span>
              </div>
            </div>
            <h2 className="text-4xl font-bold mb-12 text-center font-poppins">
              <span className="text-blue-400">&lt;</span>
              <Briefcase className="inline mx-2" />
              <span className="text-green-400">Experience</span>
              <span className="text-blue-400"> /&gt;</span>
            </h2>
            <div className="space-y-8">
              {experience.map((exp, index) => (
                <div key={index} className="bg-gray-800/90 p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-green-500/20 hover:border-green-500/40 group">
                  <div className="bg-gray-900/50 rounded-lg p-4 mb-6 font-mono border-l-4 border-green-500">
                    <div className="flex items-center mb-2">
                      <span className="text-green-400 mr-2">➜</span>
                      <span className="text-blue-400">class</span>
                      <span className="text-white ml-2">{exp.role.replace(/\s+/g, '')}</span>
                      <span className="text-purple-400 ml-2">extends</span>
                      <span className="text-yellow-400 ml-2">Developer</span>
                    </div>
                    <div className="text-gray-400 text-sm">
                      <span className="text-green-400">//</span> {exp.company} | {exp.period}
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold font-mono text-blue-400">{exp.role}</h3>
                      <p className="text-xl text-green-400 font-mono">@{exp.company}</p>
                    </div>
                    <span className="bg-blue-900/50 text-blue-200 px-4 py-2 rounded-full text-sm font-medium font-mono border border-blue-500/30">
                      {exp.period}
                    </span>
                  </div>
                  <div className="bg-gray-900/30 rounded-lg p-4 font-mono">
                    <div className="text-green-400 mb-2">console.log("achievements:");</div>
                    <ul className="space-y-3">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-start group-hover:transform group-hover:translate-x-2 transition-transform duration-300">
                          <span className="text-green-400 mr-3 mt-1 font-mono">✓</span>
                          <span className="text-gray-300">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20 px-4 observe-section">
          <div className="max-w-6xl mx-auto bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-600/50">
            <div className="bg-gray-800 rounded-lg p-6 font-mono text-left max-w-2xl mx-auto shadow-2xl border border-gray-600 mb-12">
              <div className="flex items-center mb-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="ml-4 text-gray-400 text-sm">projects.md</span>
              </div>
              <div className="text-green-400">
                <span className="text-blue-400">$</span> ls -la ./projects/ | grep "featured"
                <br />
                <span className="animate-pulse text-yellow-400">|</span>
              </div>
            </div>
            <h2 className="text-4xl font-bold mb-12 text-center font-poppins">
              <span className="text-blue-400">&lt;</span>
              <Terminal className="inline mx-2" />
              <span className="text-green-400">Featured Projects</span>
              <span className="text-blue-400"> /&gt;</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <div key={index} className="bg-gray-900/90 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-600/30 hover:border-purple-500/50 flex flex-col">
                  <div className="bg-gray-800 p-4 border-b border-gray-600 flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-gray-400 text-xs font-mono truncate ml-2">{project.title.toLowerCase().replace(/\s+/g, '-')}.repo</span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold font-mono text-blue-400 truncate flex-1 mr-2">{project.title}</h3>
                      <a 
                        href={project.github} 
                        className="text-gray-400 hover:text-green-400 transition-colors group-hover:animate-pulse flex-shrink-0 hover:scale-110 transition-transform duration-300"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                      >
                        <Github size={20} />
                      </a>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3 mb-4 font-mono border-l-4 border-purple-500 flex-shrink-0">
                      <span className="text-green-400">// </span>
                      <span className="text-gray-300 text-sm">{project.description}</span>
                    </div>
                    <div className="space-y-2 mb-4 flex-1">
                      <div className="text-green-400 font-mono text-sm mb-2">Features:</div>
                      {project.achievements.map((achievement, i) => (
                        <p key={i} className="text-sm flex items-start font-mono group-hover:transform group-hover:translate-x-1 transition-transform duration-200">
                          <span className="text-green-500 mr-2 mt-1 flex-shrink-0">→</span>
                          <span className="text-gray-300">{achievement}</span>
                        </p>
                      ))}
                    </div>
                    <div className="border-t border-gray-600 pt-4 flex-shrink-0">
                      <div className="text-yellow-400 font-mono text-xs mb-2">Tech Stack:</div>
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech, techIndex) => (
                          <span key={tech} className="bg-blue-900/50 text-blue-200 px-2 py-1 rounded text-xs font-medium font-mono border border-blue-500/30 hover:border-blue-500/60 transition-colors">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Publications Section */}
        <section id="publications" className="py-20 px-4 observe-section">
          <div className="max-w-6xl mx-auto bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            <div className="bg-gray-800 rounded-lg p-6 font-mono text-left max-w-2xl mx-auto shadow-2xl border border-gray-600 mb-12">
              <div className="flex items-center mb-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="ml-4 text-gray-400 text-sm">research.bib</span>
              </div>
              <div className="text-green-400">
                <span className="text-blue-400">$</span> bibtex publications.bib && pdflatex research.tex
                <br />
                <span className="animate-pulse text-yellow-400">|</span>
              </div>
            </div>
            <h2 className="text-4xl font-bold mb-12 text-center font-poppins">
              <span className="text-blue-400">&lt;</span>
              <FileText className="inline mx-2" />
              <span className="text-green-400">Research & Publications</span>
              <span className="text-blue-400"> /&gt;</span>
            </h2>
            <div className="space-y-6">
              {publications.map((pub, index) => (
                <div key={index} className="bg-gray-800/90 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-yellow-500/20 hover:border-yellow-500/40 group">
                  <div className="bg-gray-900/50 rounded-lg p-4 mb-4 font-mono border-l-4 border-yellow-500">
                    <div className="flex items-center mb-2">
                      <span className="text-yellow-400 mr-2">@article{'{'}paper{index + 1},</span>
                    </div>
                    <div className="pl-4 text-sm text-gray-400">
                      <div>title = {`{${pub.title}}`},</div>
                      <div>venue = {`{${pub.venue}}`},</div>
                      <div>year = {`{${pub.date.split(' ')[1]}}`}</div>
                      <div>{'}'}</div>
                    </div>
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2 text-blue-400 group-hover:text-blue-300 transition-colors">{pub.title}</h3>
                      <p className="text-gray-300 mb-3 font-mono text-sm">
                        <span className="text-green-400">📄</span> {pub.venue}
                      </p>
                      {pub.award && (
                        <div className="inline-flex items-center bg-yellow-900/50 text-yellow-200 px-3 py-1 rounded-full text-sm font-medium font-mono border border-yellow-500/30">
                          <span className="mr-2">🏆</span>
                          {pub.award}
                        </div>
                      )}
                    </div>
                    <span className="text-gray-500 text-sm font-mono bg-gray-800/50 px-3 py-1 rounded-full border border-gray-600/30">
                      {pub.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-600/50">
            <div className="bg-gray-800 rounded-lg p-6 font-mono text-left max-w-2xl mx-auto shadow-2xl border border-gray-600 mb-12">
              <div className="flex items-center mb-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="ml-4 text-gray-400 text-sm">contact.sh</span>
              </div>
              <div className="text-green-400">
                <span className="text-blue-400">$</span> ./connect.sh --developer nithish_ariyha
                <br />
                <span className="text-gray-400">Establishing connection...</span>
                <br />
                <span className="animate-pulse text-yellow-400">|</span>
              </div>
            </div>
            <h2 className="text-4xl font-bold mb-12 font-poppins">
              <span className="text-blue-400">&lt;</span>
              <Mail className="inline mx-2" />
              <span className="text-green-400">Let's Connect</span>
              <span className="text-blue-400"> /&gt;</span>
            </h2>
            <div className="bg-gray-900/50 rounded-lg p-6 mb-8 font-mono border border-green-500/30">
              <div className="text-green-400 mb-4">
                <span className="text-blue-400">const</span> <span className="text-purple-400">contact</span> = {'{'}
              </div>
              <div className="pl-4 space-y-2 text-left">
                <div><span className="text-yellow-400">email</span>: <span className="text-green-300">"nithishariyha02467@gmail.com"</span>,</div>
                <div><span className="text-yellow-400">linkedin</span>: <span className="text-green-300">"linkedin.com/in/nithishariyha"</span>,</div>
                <div><span className="text-yellow-400">status</span>: <span className="text-green-300">"Always open to new opportunities!"</span></div>
              </div>
              <div className="text-green-400 mt-4">{'}'}</div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:nithishariyha02467@gmail.com" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center font-mono border border-blue-500/50 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/25 group hover:scale-105"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <Mail className="mr-2 group-hover:animate-bounce" size={20} />
                <span>Email Me</span>
              </a>
              <a 
                href="https://linkedin.com/in/nithishariyha" 
                className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center font-mono border border-gray-500/50 hover:border-gray-400 hover:shadow-lg hover:shadow-gray-500/25 group hover:scale-105"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <Linkedin className="mr-2 group-hover:animate-pulse" size={20} />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 text-center text-gray-400 border-t border-gray-700 bg-gray-900/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800/50 rounded-lg p-4 mb-4 font-mono border border-gray-600/30">
              <div className="text-green-400">
                <span className="text-blue-400">console.log</span>(<span className="text-green-300">"Thanks for visiting! Built with ❤️ and lots of ☕"</span>);
              </div>
            </div>
            <p className="font-mono">&copy; 2025 Nithish Ariyha K. Built with React & Tailwind CSS.</p>
            <p className="text-sm mt-2 font-mono">
              <span className="text-yellow-400">Tip:</span> Try the Konami code to unlock a surprise! 🎉
            </p>
          </div>
        </footer>
      </div>

      {/* Easter Egg Modal */}
      {showEasterEgg && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-lg max-w-md mx-4 text-center">
            <div className="text-green-400 font-mono text-sm mb-4">
              <div>SYSTEM BREACH DETECTED...</div>
              <div className="animate-pulse">INITIATING EASTER EGG PROTOCOL...</div>
              <div>ACCESS GRANTED 🐰</div>
            </div>
            <h3 className="text-white text-xl font-bold mb-4">You found the easter egg! 🎉</h3>
            <p className="text-gray-300 mb-6">
              Thanks for exploring! Here's a fun fact: This portfolio was built with love, 
              coffee, and way too many late-night prompting sessions.
            </p>
            <button 
              onClick={() => setShowEasterEgg(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              Close Terminal
            </button>
          </div>
        </div>
      )}

      {/* Simple linear cursor */}
      <div
        className="fixed w-4 h-4 pointer-events-none z-[999999] rounded-full transition-colors duration-200"
        style={{
          left: cursorPosition.x - 8,
          top: cursorPosition.y - 8,
          backgroundColor: isHovering 
            ? 'rgba(59, 130, 246, 0.9)'
            : 'rgba(255, 255, 255, 0.9)',
          transform: isHovering ? 'scale(0.5)' : 'scale(1)',
          boxShadow: isHovering 
            ? '0 0 25px rgba(59, 130, 246, 0.8), 0 0 50px rgba(147, 51, 234, 0.4)'
            : '0 0 15px rgba(255, 255, 255, 0.7)',
        }}
      />
      
      <style jsx>{`
        html {
          scroll-behavior: smooth;
          cursor: none;
        }

        body {
          cursor: none;
        }

        * {
          cursor: none !important;
        }

        /* Cursor trail animations */
        @keyframes trailFade {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.3);
          }
        }

        .cursor-trail-point {
          animation: trailFade 0.6s ease-out forwards;
        }

        /* Ensure cursor is always on top */
        .cursor-top {
          position: fixed !important;
          z-index: 999999 !important;
          pointer-events: none !important;
        }

        .observe-section {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }

        .observe-section.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }


        @keyframes cometTrail {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.3);
          }
        }

        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.8;
          }
          25% { 
            transform: translateY(-10px) rotate(90deg); 
            opacity: 1;
          }
          50% { 
            transform: translateY(-15px) rotate(180deg); 
            opacity: 0.6;
          }
          75% { 
            transform: translateY(-5px) rotate(270deg); 
            opacity: 0.9;
          }
        }
      `}</style>
    </div>
  );
};

export default Portfolio;
