import {
  Component, OnInit, OnDestroy, signal, computed,
  AfterViewInit, ElementRef, ViewChild, HostListener, PLATFORM_ID, Inject
} from '@angular/core';
import { isPlatformBrowser, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';

interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  current: boolean;
  bullets: string[];
}

interface Education {
  degree: string;
  institution: string;
  location: string;
  year: string;
  type: string;
}

interface Certification {
  name: string;
  issuer: string;
  year: string;
  code?: string;
}

interface SkillGroup {
  category: string;
  icon: string;
  tags: string[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(40px)' }),
        animate('0.6s cubic-bezier(0.4,0,0.2,1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadeInLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-40px)' }),
        animate('0.6s cubic-bezier(0.4,0,0.2,1)', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('0.5s cubic-bezier(0.4,0,0.2,1)', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('bounceIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.3)' }),
        animate('0.6s cubic-bezier(0.68,-0.55,0.265,1.55)', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('staggerIn', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger('80ms', [
            animate('0.5s cubic-bezier(0.4,0,0.2,1)', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

  // ── Typewriter ──────────────────────────────────────────────────────────────
  readonly typewriterTitles = [
    'AI Software Development Engineer',
    'Multi-Agent AI Developer',
    'Full-Stack Developer & AI Builder',
    'Cybersecurity MSc · Cloud Engineer'
  ];
  typewriterText = signal('');
  typewriterIndex = signal(0);
  private twTitleIdx = 0;
  private twCharIdx = 0;
  private twDeleting = false;
  private twTimer: ReturnType<typeof setTimeout> | null = null;

  // ── Nav ─────────────────────────────────────────────────────────────────────
  scrolled = signal(false);
  menuOpen = signal(false);
  activeSection = signal('home');

  // ── Sections visibility (Intersection Observer) ──────────────────────────
  visibleSections = signal<Record<string, boolean>>({});

  // ── Contact form ──────────────────────────────────────────────────────────
  contactForm = { name: '', email: '', message: '' };
  formSent = signal(false);
  formError = signal(false);

  // ── Data ──────────────────────────────────────────────────────────────────
  readonly stats = [
    { num: '5+', label: 'Years of Experience' },
    { num: '4', label: 'Companies' },
    { num: '15+', label: 'Technologies' },
    { num: 'MSc', label: 'Cybersecurity · UCM Madrid' }
  ];

  readonly experiences: Experience[] = [
    {
      title: 'AI Software Development Engineer · Mid Software Developer',
      company: 'NICE CXone',
      location: 'Cochabamba, Bolivia & Salt Lake City, USA',
      period: '2021 — Present',
      current: true,
      bullets: [
        'Designed and developed full-stack solutions in C#, Python, TypeScript, and Java with a strong backend focus on .NET / ASP.NET.',
        'Built AI-powered systems and multi-agent architectures using Claude (Opus, Sonnet, Haiku), MCP Servers, and modern LLM tooling.',
        'Implemented backend business logic including data normalization, duplicate-prevention rules, and robust database integration (SQL Server, PostgreSQL, MySQL).',
        'Automated engineering workflows with Atlassian tools (Jira, Confluence) and CI/CD pipelines (GitHub Actions, Jenkins).',
        'Refactored and stabilized legacy systems to improve maintainability, data integrity, and production reliability.'
      ]
    },
    {
      title: 'Head of IT Commission · Technical Lead',
      company: 'Junior Chamber International (JCI) Bolivia',
      location: 'Bolivia & St. Louis, Missouri, USA',
      period: '2025 — Present',
      current: true,
      bullets: [
        'Led the IT Commission, defining the technological strategy for digital initiatives at national and international level.',
        'Acted as technical and architectural authority, aligning business objectives with software and AI-driven solutions.',
        'Oversaw digital platforms, web management, and internal systems for the organization.',
        'Provided technical leadership combining software development expertise, cloud knowledge, and IT governance.'
      ]
    },
    {
      title: 'Digital Administrator & Technology Instructor',
      company: 'Tekhne Academy',
      location: 'Cochabamba, Bolivia',
      period: '2019 — 2021',
      current: false,
      bullets: [
        'Administered digital learning platforms and managed web-based educational systems.',
        'Taught IT fundamentals, networking, and systems concepts to students at various levels.',
        'Supported Cisco Networking Academy programs (CCNA v7, IT Essentials v7) and hands-on technical labs.',
        'Combined technical work with mentoring and instruction, bridging theory and practice.'
      ]
    },
    {
      title: 'Coordinator & IT Instructor',
      company: 'Academy Xperts Bolivia',
      location: 'Cochabamba, Bolivia',
      period: '2018 — 2019',
      current: false,
      bullets: [
        'Coordinated academic activities and managed technology training programs.',
        'Delivered courses on networking, systems administration, and IT infrastructure.',
        'Supported students pursuing Cisco and technology certifications.'
      ]
    },
    {
      title: 'IT & Information Systems Instructor',
      company: 'EMI · Universidad Mayor de San Simón',
      location: 'Cochabamba, Bolivia',
      period: '2019',
      current: false,
      bullets: [
        'Delivered courses in Information Systems Auditing, Networks, Cybersecurity, and IT Infrastructure.',
        'Covered information security, system architectures, and governance frameworks.',
        'Supported undergraduate and postgraduate technology programs at EMI and UMSS.'
      ]
    },
    {
      title: 'Systems Maintenance & Software Engineer',
      company: 'Autonomous Municipal Government of Sacaba',
      location: 'Sacaba, Cochabamba, Bolivia',
      period: '2013 — 2017',
      current: false,
      bullets: [
        'Maintained and enhanced information systems for health, education, and public security institutions.',
        'Developed custom software systems, databases, and internal web platforms for municipal operations.',
        'Supported IT infrastructure, networking, and system administration across government departments.',
        'Participated in digital transformation initiatives within public administration environments.'
      ]
    }
  ];

  readonly education: Education[] = [
    {
      degree: 'Master en Ciberseguridad',
      institution: 'Universidad Complutense de Madrid',
      location: 'Madrid, España',
      year: '2022',
      type: 'Master / Maestría'
    },
    {
      degree: 'Ingeniería de Sistemas',
      institution: 'Universidad Mayor de San Simón',
      location: 'Cochabamba, Bolivia',
      year: '2013',
      type: 'Pre-grado Universitario'
    },
    {
      degree: 'Diplomado en Docencia para la Educación Superior',
      institution: 'Universidad Mayor de San Simón',
      location: 'Cochabamba, Bolivia',
      year: '2017',
      type: 'Post-Grado'
    },
    {
      degree: 'Experto en Tecnologías de Transmisión de Datos',
      institution: 'Universidad México Blanco – UMB',
      location: 'Distrito Federal, México',
      year: '2019',
      type: 'Especialidad'
    },
    {
      degree: 'Diplomado en Planificación y Desarrollo de Competencias Profesionales',
      institution: 'Escuela Militar de Ingeniería – EMI',
      location: 'Cochabamba, Bolivia',
      year: '2020',
      type: 'Post-Grado'
    }
  ];

  readonly certifications: Certification[] = [
    {
      name: 'Introduction to Subagents',
      issuer: 'Anthropic',
      year: 'May 2026',
      code: 'tjdwn9yxpum8'
    },
    {
      name: 'Introduction to Model Context Protocol',
      issuer: 'Anthropic',
      year: 'May 2026',
      code: '3n5a9kp7gc6s'
    },
    {
      name: 'Introduction to Agent Skills',
      issuer: 'Anthropic',
      year: 'May 2026',
      code: 'jrynw92u5wzs'
    },
    {
      name: 'Claude Code in Action',
      issuer: 'Anthropic',
      year: 'May 2026',
      code: '3k7zhpwk97xb'
    },
    {
      name: 'Curso de GitHub Copilot',
      issuer: 'Platzi',
      year: 'Apr 2025',
      code: 'f89be2a2-4d61-47c4-95e6-99e7b8808afb'
    },
    {
      name: 'AWS Educate Introduction to Generative AI',
      issuer: 'Amazon Web Services (AWS)',
      year: 'Apr 2025'
    },
    {
      name: 'Cybersecurity Awareness Learner',
      issuer: 'CertiProf',
      year: 'Dec 2024'
    },
    {
      name: 'Curso de Introducción a la Nube',
      issuer: 'Platzi',
      year: 'Jul 2024',
      code: '4f6f33fb-adb8-451f-b194-23347b625bc1'
    },
    {
      name: 'Instructor 5 Years of Service',
      issuer: 'Cisco',
      year: 'Jan 2024'
    },
    {
      name: 'C# Essential Training 1: Types and Control Flow',
      issuer: 'LinkedIn Learning',
      year: 'May 2023'
    },
    {
      name: 'C# Essential Training 2: Flow Control, Arrays & Exception Handling',
      issuer: 'LinkedIn Learning',
      year: 'Jan 2022'
    },
    {
      name: 'CSS Essential Training',
      issuer: 'LinkedIn Learning',
      year: 'Jan 2022'
    },
    {
      name: 'Git: Branches, Merges, and Remotes',
      issuer: 'LinkedIn Learning',
      year: 'Dec 2021'
    },
    {
      name: 'Experto en Ethical Hacking (I, II, III)',
      issuer: 'Seguridad Cero – Perú',
      year: '2021'
    },
    {
      name: 'Instructor 1 Year of Service',
      issuer: 'Cisco',
      year: 'Jan 2021'
    },
    {
      name: 'CCNA: Enterprise Networking, Security & Automation',
      issuer: 'Cisco Networking Academy',
      year: 'Aug 2020'
    },
    {
      name: 'Introduction to Cybersecurity',
      issuer: 'Cisco',
      year: 'Apr 2020'
    },
    {
      name: 'PCAP: Programming Essentials in Python',
      issuer: 'Cisco / LATAM',
      year: '2020'
    },
    {
      name: 'AWS Fundamentals: Going Cloud-Native',
      issuer: 'Coursera / AWS',
      year: '2020'
    },
    {
      name: 'AWS Fundamentals: Addressing Security Risk',
      issuer: 'Coursera / AWS',
      year: '2020'
    },
    {
      name: 'MTCNA – Mikrotik Certified Network Associate',
      issuer: 'Mikrotik',
      year: '2018',
      code: '1811NA5929'
    },
    {
      name: 'MTCUME – Mikrotik Certified User Management Engineer',
      issuer: 'Mikrotik',
      year: '2018',
      code: '1812UME8110'
    }
  ];

  readonly skillGroups: SkillGroup[] = [
    {
      category: 'AI & LLM Technologies',
      icon: '🤖',
      tags: ['Claude (Opus/Sonnet/Haiku)', 'GPT-4o', 'Gemini', 'LLaMA', 'RAG Architectures', 'Prompt Engineering', 'Embeddings & Vector Search', 'Fine-tuning']
    },
    {
      category: 'AI Agent & Automation',
      icon: '⚡',
      tags: ['Multi-Agent Orchestration', 'MCP Servers', 'Claude Agent SDK', 'Tool Use / Function Calling', 'GitHub Actions', 'CI/CD Pipelines']
    },
    {
      category: 'Development',
      icon: '💻',
      tags: ['Python', 'C#', 'TypeScript', 'Java', 'PHP', '.NET / ASP.NET', 'Angular', 'HTML/CSS']
    },
    {
      category: 'Cloud & Infrastructure',
      icon: '☁️',
      tags: ['AWS Lambda', 'AWS SageMaker', 'AWS Bedrock', 'Azure OpenAI', 'Azure DevOps', 'Docker', 'Terraform']
    },
    {
      category: 'Databases',
      icon: '🗄️',
      tags: ['PostgreSQL', 'MySQL', 'SQL Server']
    },
    {
      category: 'Networking & Security',
      icon: '🔒',
      tags: ['Mikrotik (MTCNA/MTCUME)', 'Cisco CCNA', 'Ethical Hacking', 'Cybersecurity', 'GPON / Fiber Optic', 'Linux Administration']
    },
    {
      category: 'Tools & DevOps',
      icon: '🛠️',
      tags: ['Claude Code CLI', 'VS Code', 'Docker', 'Jenkins', 'Grafana', 'Git', 'Jira', 'Confluence']
    }
  ];

  private observers: IntersectionObserver[] = [];
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.startTypewriter();
    }
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.initIntersectionObserver();
  }

  ngOnDestroy(): void {
    if (this.twTimer) clearTimeout(this.twTimer);
    this.observers.forEach(o => o.disconnect());
  }

  // ── Typewriter logic ────────────────────────────────────────────────────────
  private startTypewriter(): void {
    const current = this.typewriterTitles[this.twTitleIdx];
    const speed = this.twDeleting ? 40 : 80;
    const pauseEnd = 1800;
    const pauseStart = 400;

    if (!this.twDeleting && this.twCharIdx < current.length) {
      this.typewriterText.set(current.slice(0, ++this.twCharIdx));
      this.twTimer = setTimeout(() => this.startTypewriter(), speed);
    } else if (!this.twDeleting && this.twCharIdx === current.length) {
      this.twDeleting = true;
      this.twTimer = setTimeout(() => this.startTypewriter(), pauseEnd);
    } else if (this.twDeleting && this.twCharIdx > 0) {
      this.typewriterText.set(current.slice(0, --this.twCharIdx));
      this.twTimer = setTimeout(() => this.startTypewriter(), speed);
    } else {
      this.twDeleting = false;
      this.twTitleIdx = (this.twTitleIdx + 1) % this.typewriterTitles.length;
      this.typewriterIndex.set(this.twTitleIdx);
      this.twTimer = setTimeout(() => this.startTypewriter(), pauseStart);
    }
  }

  // ── Scroll ──────────────────────────────────────────────────────────────────
  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 30);
    const sections = ['home', 'about', 'skills', 'experience', 'education', 'contact'];
    for (const id of sections) {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom >= 120) {
          this.activeSection.set(id);
          break;
        }
      }
    }
  }

  toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  // ── Intersection Observer ───────────────────────────────────────────────────
  private initIntersectionObserver(): void {
    const ids = ['about', 'skills', 'experience', 'education', 'contact'];
    const obs = new IntersectionObserver(entries => {
      const current: Record<string, boolean> = { ...this.visibleSections() };
      entries.forEach(e => { current[e.target.id] = e.isIntersecting; });
      this.visibleSections.set(current);
    }, { threshold: 0.1 });

    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    this.observers.push(obs);
  }

  isVisible(id: string): boolean {
    return !!this.visibleSections()[id];
  }

  // ── Contact form ────────────────────────────────────────────────────────────
  submitForm(): void {
    const { name, email, message } = this.contactForm;
    if (!name || !email || !message) return;
    const mailto = `mailto:jmanrock@hotmail.com?subject=Portfolio Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(message + '\n\nFrom: ' + name + '\nEmail: ' + email)}`;
    window.location.href = mailto;
    this.formSent.set(true);
    this.contactForm = { name: '', email: '', message: '' };
    setTimeout(() => this.formSent.set(false), 4000);
  }

  scrollToSection(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    this.closeMenu();
  }
}
