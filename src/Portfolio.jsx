import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Github, Linkedin, Mail, ExternalLink, Award, Code, Terminal, User, Briefcase, GraduationCap, FileText, Download } from 'lucide-react';

const Portfolio = () => {
  const darkMode = true;
  const [currentSection, setCurrentSection] = useState('home');
  const [typedText, setTypedText] = useState('');
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [particles, setParticles] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [connections, setConnections] = useState([]);
  const terminalRef = useRef(null);
  const observerRef = useRef(null);

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

  // Enhanced particle system with mouse interaction
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 80 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 4 + 1,
        speedX: (Math.random() - 0.5) * 0.8,
        speedY: (Math.random() - 0.5) * 0.8,
        opacity: Math.random() * 0.6 + 0.2,
        color: Math.random() > 0.5 ? 'blue' : 'purple',
        originalSpeedX: (Math.random() - 0.5) * 0.8,
        originalSpeedY: (Math.random() - 0.5) * 0.8,
      }));
      setParticles(newParticles);
    };

    generateParticles();
    
    const animateParticles = () => {
      setParticles(prev => prev.map(p => {
        let newX = p.x + p.speedX;
        let newY = p.y + p.speedY;
        
        // Boundary collision
        if (newX < 0 || newX > window.innerWidth) {
          p.speedX *= -1;
          newX = Math.max(0, Math.min(window.innerWidth, newX));
        }
        if (newY < 0 || newY > window.innerHeight) {
          p.speedY *= -1;
          newY = Math.max(0, Math.min(window.innerHeight, newY));
        }

        return {
          ...p,
          x: newX,
          y: newY
        };
      }));

      // Generate connections between nearby particles
      setConnections(prev => {
        const newConnections = [];
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i]?.x - particles[j]?.x;
            const dy = particles[i]?.y - particles[j]?.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 120) {
              newConnections.push({
                x1: particles[i]?.x,
                y1: particles[i]?.y,
                x2: particles[j]?.x,
                y2: particles[j]?.y,
                opacity: Math.max(0, 0.3 - distance / 120)
              });
            }
          }
        }
        return newConnections.slice(0, 15); // Limit connections for performance
      });
    };

    const interval = setInterval(animateParticles, 50);
    
    // Mouse interaction
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Attract particles to mouse
      setParticles(prev => prev.map(p => {
        const dx = e.clientX - p.x;
        const dy = e.clientY - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const force = (150 - distance) / 150 * 0.02;
          return {
            ...p,
            speedX: p.speedX + (dx / distance) * force,
            speedY: p.speedY + (dy / distance) * force
          };
        }
        return p;
      }));
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', generateParticles);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', generateParticles);
    };
  }, [particles.length]);

  // Easter egg
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'f' || e.key === 'F') {
        setShowEasterEgg(true);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
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
    "Languages": ["Java", "Python", "C++", "JavaScript", "Kotlin", "Dart", "Rust"],
    "Frameworks": ["React", "Next.js", "Flask", "PyTorch", "Flutter"],
    "Databases": ["PostgreSQL", "MongoDB", "Redis"],
    "DevOps": ["Git", "Azure", "Docker", "GitLab CI/CD"],
    "AI/ML": ["Machine Learning", "Deep Learning", "NLP", "Computer Vision"]
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
      {/* Enhanced Particle System */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        {/* Particle connections */}
        <svg className="absolute inset-0 w-full h-full">
          {connections.map((connection, i) => (
            <line
              key={i}
              x1={connection.x1}
              y1={connection.y1}
              x2={connection.x2}
              y2={connection.y2}
              stroke="rgba(59, 130, 246, 0.3)"
              strokeWidth="1"
              opacity={connection.opacity}
            />
          ))}
        </svg>
        
        {/* Floating particles */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className={`absolute rounded-full transition-all duration-300 ${
              particle.color === 'blue' ? 'bg-blue-400' : 'bg-purple-400'
            }`}
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color === 'blue' ? 'rgba(59, 130, 246, 0.5)' : 'rgba(147, 51, 234, 0.5)'}`,
              animation: `float ${4 + particle.id * 0.1}s ease-in-out infinite ${particle.id * 0.1}s`
            }}
          />
        ))}
        
        {/* Mouse cursor glow effect */}
        <div
          className="absolute pointer-events-none rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-20"
          style={{
            left: `${mousePosition.x - 25}px`,
            top: `${mousePosition.y - 25}px`,
            width: '50px',
            height: '50px',
            filter: 'blur(10px)',
            transition: 'all 0.1s ease-out'
          }}
        />
        
        {/* Additional floating elements */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-300 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-purple-300 rounded-full animate-ping opacity-40"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-blue-200 rounded-full animate-bounce opacity-50"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-200 rounded-full animate-pulse opacity-30"></div>
        
        {/* Code rain effect */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-green-400 font-mono text-xs select-none"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animation: `codeRain ${5 + Math.random() * 5}s linear infinite`
              }}
            >
              {Math.random().toString(36).substring(2, 8)}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 text-white relative z-10 min-h-screen">
        {/* Navigation */}
        <nav className="fixed top-0 w-full bg-gray-900/90 backdrop-blur-md z-50 border-b border-gray-700">
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
                  <span className="animate-pulse">|</span>
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Nithish Ariyha K
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              AI Researcher & Full-Stack Developer
            </p>
            <div className="flex justify-center space-x-6 mb-12">
              <a href="https://github.com/ariyha" className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
                <Github size={24} />
              </a>
              <a href="https://linkedin.com/in/nithishariyha" className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
                <Linkedin size={24} />
              </a>
              <a href="mailto:nithishariyha02467@gmail.com" className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
                <Mail size={24} />
              </a>
            </div>
            <div className="animate-bounce">
              <ChevronDown size={32} className="mx-auto text-blue-400" />
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 px-4 observe-section">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">
              <User className="inline mr-3" />
              About Me
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg text-gray-300 mb-6">
                  I'm a passionate AI researcher and full-stack developer pursuing B.Tech in Computer Science 
                  with specialization in Artificial Intelligence at Amrita Vishwa Vidyapeetham. With a CGPA of 9.4/10.0, 
                  I've been exploring the intersection of AI and practical applications.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  My journey spans from developing real-time sign language recognition systems to building 
                  enterprise-grade applications. I've secured AIR 178 in GATE 2025 (Data Science) and have 
                  multiple publications in international conferences.
                </p>
                <div className="flex space-x-4">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center">
                    <Download className="mr-2" size={20} />
                    Download Resume
                  </button>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl font-bold mb-4">Education</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold">B.Tech Computer Science (AI)</p>
                      <p className="text-gray-400">Amrita Vishwa Vidyapeetham • CGPA: 9.4/10.0</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl font-bold mb-4">Achievements</h3>
                  <div className="space-y-2">
                    <p className="flex items-center"><Award className="mr-2" size={16} />GATE 2025 AIR 178 (Data Science)</p>
                    <p className="flex items-center"><Award className="mr-2" size={16} />200+ LeetCode Problems</p>
                    <p className="flex items-center"><Award className="mr-2" size={16} />Best Paper Award ICBSII</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="py-20 px-4 bg-gray-800 observe-section">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">
              <Code className="inline mr-3" />
              Technical Skills
            </h2>
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
              {Object.entries(skills).map(([category, items]) => (
                <div key={category} className="bg-gray-900 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                  <h3 className="text-lg font-bold mb-4 text-blue-400">{category}</h3>
                  <div className="space-y-2">
                    {items.map(skill => (
                      <span key={skill} className="block text-sm bg-gray-700 px-3 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-20 px-4 observe-section">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">
              <Briefcase className="inline mr-3" />
              Experience
            </h2>
            <div className="space-y-8">
              {experience.map((exp, index) => (
                <div key={index} className="bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold">{exp.role}</h3>
                      <p className="text-xl text-blue-400">{exp.company}</p>
                    </div>
                    <span className="bg-blue-900 text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                      {exp.period}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-blue-400 mr-2 mt-1">▸</span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20 px-4 bg-gray-800 observe-section">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">
              <Terminal className="inline mr-3" />
              Featured Projects
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <div key={index} className="bg-gray-900 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold">{project.title}</h3>
                      <a href={project.github} className="text-gray-400 hover:text-blue-400 transition-colors">
                        <Github size={20} />
                      </a>
                    </div>
                    <p className="text-gray-300 mb-4">{project.description}</p>
                    <div className="space-y-2 mb-4">
                      {project.achievements.map((achievement, i) => (
                        <p key={i} className="text-sm flex items-start">
                          <span className="text-green-500 mr-2 mt-1">✓</span>
                          {achievement}
                        </p>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map(tech => (
                        <span key={tech} className="bg-blue-900 text-blue-200 px-2 py-1 rounded text-xs font-medium">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Publications Section */}
        <section id="publications" className="py-20 px-4 observe-section">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">
              <FileText className="inline mr-3" />
              Research & Publications
            </h2>
            <div className="space-y-6">
              {publications.map((pub, index) => (
                <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2">{pub.title}</h3>
                      <p className="text-gray-300 mb-2">{pub.venue}</p>
                      {pub.award && (
                        <span className="bg-yellow-900 text-yellow-200 px-2 py-1 rounded text-sm font-medium">
                          🏆 {pub.award}
                        </span>
                      )}
                    </div>
                    <span className="text-gray-500 text-sm">{pub.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 px-4 bg-gray-800">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-12">
              <Mail className="inline mr-3" />
              Let's Connect
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Always open to discussing new opportunities and interesting projects!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:nithishariyha02467@gmail.com" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium transition-colors flex items-center justify-center">
                <Mail className="mr-2" size={20} />
                Email Me
              </a>
              <a href="https://linkedin.com/in/nithishariyha" className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-lg font-medium transition-colors flex items-center justify-center">
                <Linkedin className="mr-2" size={20} />
                LinkedIn
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 text-center text-gray-400 border-t border-gray-700">
          <p>&copy; 2025 Nithish Ariyha K. Built with React & Tailwind CSS.</p>
          <p className="text-sm mt-2">Press 'F' for a surprise! 🎉</p>
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
              coffee, and way too many late-night coding sessions.
            </p>
            <button 
              onClick={() => setShowEasterEgg(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Close Terminal
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        html {
          scroll-behavior: smooth;
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

        @keyframes codeRain {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(100vh);
          }
        }
      `}</style>
    </div>
  );
};

export default Portfolio;