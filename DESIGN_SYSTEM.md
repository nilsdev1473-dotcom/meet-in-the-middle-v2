+-----------------------------------------------------------------------------------------+
|  TARGET: meet-in-the-middle-v2 - RECOMMENDED DESIGN SYSTEM                              |
+-----------------------------------------------------------------------------------------+
|                                                                                          |
|  PATTERN: Marketplace / Directory                                                       |
|     Conversion:  map hover pins,  card carousel, Search bar is the CTA. Reduce friction to search. Popular searches suggestions.|
|     CTA: Hero Search Bar + Navbar 'List your item'                                      |
|     Sections:                                                                           |
|       1. 1. Hero (Search focused), 2. Categories, 3. Featured Listings, 4. Trust/Safety, 5. CTA (Become a host/seller)|
|                                                                                          |
|  STYLE: AI-Native UI                                                                    |
|     Keywords: Chatbot, conversational, voice, assistant, agentic, ambient, minimal      |
|     chrome, streaming text, AI interactions                                             |
|     Best For: AI products, chatbots, voice assistants, copilots, AI-powered tools,      |
|     conversational interfaces                                                           |
|     Performance: ⚡ Excellent | Accessibility: ✓ WCAG AA                                 |
|                                                                                          |
|  COLORS:                                                                                |
|     Primary:    #4F46E5                                                                 |
|     Secondary:  #818CF8                                                                 |
|     CTA:        #F97316                                                                 |
|     Background: #EEF2FF                                                                 |
|     Text:       #1E1B4B                                                                 |
|     Notes: Playful indigo + energetic orange                                            |
|                                                                                          |
|  TYPOGRAPHY: Inter / Inter                                                              |
|     Mood: minimal, clean, swiss, functional, neutral, professional                      |
|     Best For: Dashboards, admin panels, documentation, enterprise apps, design systems  |
|     Google Fonts: https://fonts.google.com/share?selection.family=Inter:wght@300;400;500;600;700|
|     CSS Import: @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;4...|
|                                                                                          |
|  KEY EFFECTS:                                                                           |
|     Typing indicators (3-dot pulse), streaming text animations, pulse animations,       |
|     context cards, smooth reveals                                                       |
|                                                                                          |
|  AVOID (Anti-patterns):                                                                 |
|     Heavy chrome + Slow response feedback                                               |
|                                                                                          |
|  PRE-DELIVERY CHECKLIST:                                                                |
|     [ ] No emojis as icons (use SVG: Heroicons/Lucide)                                  |
|     [ ] cursor-pointer on all clickable elements                                        |
|     [ ] Hover states with smooth transitions (150-300ms)                                |
|     [ ] Light mode: text contrast 4.5:1 minimum                                         |
|     [ ] Focus states visible for keyboard nav                                           |
|     [ ] prefers-reduced-motion respected                                                |
|     [ ] Responsive: 375px, 768px, 1024px, 1440px                                        |
|                                                                                          |
+-----------------------------------------------------------------------------------------+
# DESIGN SYSTEM — MANDATORY STANDARDS
## Spacing
- Strict 4px/8px grid. Min touch targets: 44px. Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8.
## Typography
- Max 2 font families via next/font/google. NEVER Inter/Roboto/Arial.
- Heading: text-3xl+ font-bold tracking-tight. Body: text-sm/base leading-relaxed.
## Color
- Max 5 colors + opacity variants as CSS variables. Dark bg: #09090B not #000000. Text: #FAFAFA not #FFFFFF.
## Corners & Borders
- Cards: rounded-xl/2xl. Buttons: rounded-lg. Dark borders: border-white/5 or /10.
## Glassmorphism
- backdrop-blur-xl bg-white/5 border border-white/10. Never bg-white/20+.
## Animations (Framer Motion required)
- Page load: stagger fadeInUp. Hover: scale(1.02) 150-200ms. Active: scale(0.98).
## Icons
- Lucide React ONLY. Never emoji. Nav: w-5 h-5, inline: w-4 h-4, hero: w-8 h-8.
## Responsive
- Mobile-first: 375px base, sm:640, md:768, lg:1024, xl:1440.
## Interactive States (EVERY element)
- Default, Hover, Active, Focus, Disabled. Focus: ring-2 ring-accent.
## Required Deps
- framer-motion, lucide-react, recharts (if charts needed)
