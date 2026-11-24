import { Blocks, LayoutDashboard, Globe, ShoppingCart, RefreshCw, LifeBuoy, PenTool, Compass } from "lucide-react";

/* The only services Codefloor IT offers. Do not add to this list without approval. */
export const services = [
  {
    slug: "custom-software-development",
    seoTitle: "Custom Software Development Company in Ahmedabad",
    seoDescription:
      "Custom software built around how your business works: CRMs, dashboards, booking and internal tools. Codefloor IT, Ahmedabad. Discuss your project.",
    icon: Blocks,
    title: "Custom Software Development",
    short: "Software tailored to your business workflows and requirements.",
    intro:
      "Off-the-shelf software is built for the average of many businesses. When an important part of how you work is specific to you, generic tools create workarounds and side spreadsheets. We build software that fits the process you already have.",
    build: [
      "Client and record management systems",
      "Booking, scheduling and appointment systems",
      "Admin and operations dashboards",
      "Inventory, order and record tracking",
      "Role-based internal platforms",
      "Reporting built on your own data",
    ],
    approach: [
      { h: "Map the current process", p: "We document how the work happens today — the steps, people, decisions and edge cases — before designing anything." },
      { h: "Model the data", p: "We define the records, relationships and states the system needs, so reporting and future features are possible from day one." },
      { h: "Roles and permissions", p: "Different people need different views. Each user gets the information and actions relevant to them." },
    ],
    problems: [
      "Work tracked across spreadsheets, notebooks and WhatsApp groups, with no single up-to-date record",
      "Off-the-shelf tools that force your team into workarounds because your process does not fit their template",
      "Reports that take hours to put together by hand because the data sits in several places",
      "No clear view of who is responsible for a task, or which job is stuck and why",
      "Several disconnected products that each hold part of the picture",
    ],
    stack: ["React", "Node.js", "Express", "PostgreSQL", "MySQL"],
    local:
      "Codefloor IT is based in Ahmedabad, so for businesses in the city the first step is usually an in-person meeting where we walk through how your work runs today: the forms, the spreadsheets, the approvals and the exceptions. Custom software depends on getting those details right, and seeing the work first-hand is the quickest way to learn them. For businesses elsewhere in Gujarat or India, we run the same discovery over video calls, with screen-sharing in place of a visit.",
    reading: ["when-to-build-custom-software", "custom-vs-ready-made-software", "custom-software-cost", "choose-software-company"],
    faqs: [
      { q: "When does custom software make sense over a ready-made product?", a: "When your core workflow is unusual, when existing tools force awkward workarounds, or when you need one connected system instead of several disconnected products." },
      { q: "Can custom software replace our spreadsheets?", a: "That is one of the most common starting points. We turn the logic living in spreadsheets into a structured system with validation, history, roles and reporting." },
      { q: "Do you build custom software for businesses in Ahmedabad?", a: "Yes. We are an Ahmedabad-based team and build custom software for businesses in the city, across Gujarat and in the rest of India. Clients in Ahmedabad can meet us in person to map their workflow; others work with us over video calls, email and WhatsApp." },
      { q: "What do you need from us to get started?", a: "A description of the process you want to improve, examples of the spreadsheets, forms or reports you use today, and an idea of who will use the system. From that we propose a scope you can review before any build starts." },
      { q: "Can the software grow after the first version?", a: "Yes. We model the data and user roles so new features can be added later without a rewrite, and we usually start with the workflow that matters most before extending the system step by step." },
    ],
    projects: ["leadhunter-crm", "patient-handling-system", "aranya-palace"],
  },
  {
    slug: "web-application-development",
    seoTitle: "Custom Web Application Development in Ahmedabad",
    seoDescription:
      "Web applications for businesses in Ahmedabad and across India: dashboards, customer portals, booking systems and business platforms by Codefloor IT.",
    icon: LayoutDashboard,
    title: "Web Application Development",
    short: "Scalable dashboards, portals, booking systems and business platforms.",
    intro:
      "A web application is software people log in to and get work done with — in any browser, on any device. We build dashboards, portals, booking systems and interactive platforms with the structure to grow as usage does.",
    build: [
      "Customer and partner portals",
      "Admin dashboards and internal tools",
      "Booking and reservation systems",
      "Multi-role business platforms",
      "Interactive, data-driven interfaces",
      "Search, filtering and status tracking",
    ],
    approach: [
      { h: "Start with the core task", p: "We identify the main job each user comes to do and design the shortest reliable path to it." },
      { h: "Structure for growth", p: "Clear separation between interface, logic and data keeps new features from turning into rewrites." },
      { h: "Build in increments", p: "You see working software early and often, not one big reveal at the end." },
    ],
    problems: [
      "Customers phoning or messaging for information they could look up themselves",
      "Bookings and requests arriving by call, email and chat, with no single list to work from",
      "Staff who need different views of the same data, with no control over who sees what",
      "Desktop-only tools that do not work on the phones your team carries",
      "Manual status updates that leave customers asking where their request stands",
    ],
    stack: ["React", "Vite", "Node.js", "Express", "PostgreSQL", "MySQL"],
    local:
      "Because a web application runs in the browser, your office in Ahmedabad, a branch elsewhere in Gujarat and customers anywhere in India can all work from the same live data with nothing to install. Being based in Ahmedabad, we can review working versions with local clients in person as the application takes shape. For teams outside the city, the same reviews happen over video calls, so you see progress at every stage wherever you are.",
    reading: ["website-vs-web-application", "hotel-booking-system", "doctor-appointment-software"],
    faqs: [
      { q: "What is the difference between a website and a web application?", a: "A website mainly communicates information. A web application supports tasks: accounts, data entry, dashboards, bookings or business processes. Many projects need elements of both." },
      { q: "Will it work on phones and tablets?", a: "Yes. We design responsive interfaces and test them across phone, tablet and desktop screen sizes." },
      { q: "Can customers and staff use the same web application?", a: "Yes. Role-based access gives each type of user, for example customers, staff and administrators, their own screens and permissions within one system, so everyone sees only what is relevant to them." },
      { q: "Do we also need a mobile app?", a: "Often not. A responsive web application works in the phone's browser and can be used on the move without an app store download. If you later need something only a native app can do, we discuss it as a separate decision." },
      { q: "Do you work on web applications for companies outside Ahmedabad?", a: "Yes. We are based in Ahmedabad and offer in-person reviews here, while companies elsewhere in Gujarat and India work with us through video calls, email and WhatsApp throughout the build." },
    ],
    projects: ["leadhunter-crm", "patient-handling-system", "aranya-palace"],
  },
  {
    slug: "business-website-development",
    seoTitle: "Website Development Company in Ahmedabad",
    seoDescription:
      "Business websites that explain what you do, build trust and bring in enquiries. Designed and developed by Codefloor IT in Ahmedabad, Gujarat.",
    icon: Globe,
    title: "Business Website Development",
    short: "Professional websites focused on clarity, credibility, usability and conversion.",
    intro:
      "A website is often the first serious impression a business makes. We build professional sites that explain what you do in plain language, earn trust quickly and make the next step obvious.",
    build: [
      "Business and corporate websites",
      "Service and practice-area pages",
      "Content your team can update in-house",
      "Contact and enquiry flows",
      "Landing pages for campaigns",
      "Search-friendly page structure",
    ],
    approach: [
      { h: "Structure before styling", p: "We map pages, content and visitor journeys first, so the site stands on a clear information architecture." },
      { h: "Written for your visitor", p: "Every page answers what a prospective customer is actually asking, and ends with a clear next step." },
      { h: "Fast and findable", p: "Semantic markup, correct headings, metadata and performance work are part of the build, not an afterthought." },
    ],
    problems: [
      "A dated website that makes the business look smaller or less established than it is",
      "Visitors who cannot tell quickly what you do, who you serve or how to contact you",
      "Pages that are slow or awkward on a phone, where many people first find you",
      "Content that needs a developer every time a service, price or photo changes",
      "A site that does not appear when people search for the services you offer",
    ],
    stack: ["React", "Vite", "Node.js"],
    local:
      "People choosing a legal adviser or a hotel usually look the business up online before they call, and a clear, credible website often decides whether they do. Our portfolio includes demo builds of a legal consultancy website and a hotel website with a booking flow, designed for exactly that moment. Businesses in Ahmedabad can plan the site with us in person; companies elsewhere in Gujarat and India work with us over video calls, email and WhatsApp.",
    reading: ["professional-business-website", "business-website-cost-india", "business-website-timeline", "modern-hotel-website"],
    faqs: [
      { q: "What does business website development include?", a: "Planning the pages and content structure, designing and building responsive pages, contact and enquiry flows, search-friendly titles, headings and metadata, and — where content changes often — a way for your team to edit it. The exact scope is agreed before the build starts." },
      { q: "What affects the cost of a business website?", a: "Mainly the number of unique page layouts, how much of the content is ready, custom functionality such as bookings or payments, and any integrations. Our Starter Website package (5–10 pages) is ₹15,999 and our Business Website package (10–15 pages) is ₹26,999, both GST included; anything beyond those packages is quoted once we understand the scope." },
      { q: "Can our team update the content ourselves?", a: "Yes. Where content changes often we add a simple admin area or content system so you can update text and images without a developer." },
      { q: "How long does a business website take?", a: "It depends on the number of unique pages, how ready the content is and any custom functionality. We give a realistic timeline once we understand the scope." },
      { q: "Do you build business websites for companies in Ahmedabad?", a: "Yes. We are based in Ahmedabad and build websites for businesses here and across Gujarat and India. Local clients can meet us in person to plan the pages and content." },
      { q: "Will the website help us appear in local search results?", a: "We build the foundations search engines rely on: clear page structure, correct headings, titles and descriptions, and fast mobile pages. Rankings also depend on things outside the website, such as your Google Business Profile and reviews, so no one can honestly guarantee positions, but the site itself will not hold you back." },
    ],
    projects: ["oracle-legal-consultancy", "aranya-palace"],
  },
  {
    slug: "ecommerce-development",
    seoTitle: "E-commerce Website Development in Ahmedabad",
    seoDescription:
      "E-commerce websites with product catalogs, cart, checkout and online payments, built by Codefloor IT in Ahmedabad for businesses across India.",
    icon: ShoppingCart,
    title: "E-commerce Development",
    short: "Online shopping experiences and commerce systems with suitable payment options.",
    intro:
      "Selling online is more than a product grid and a checkout button. A store needs a catalog that is easy to maintain, an order process your team can manage and a checkout customers actually finish.",
    build: [
      "Product catalogs and categories",
      "Cart, checkout and online payments",
      "Order and fulfilment management",
      "Customer accounts and order history",
      "Offers and discount rules",
      "Store admin dashboards",
    ],
    approach: [
      { h: "A catalog that scales", p: "Products, variants and categories are structured so adding stock later is quick and consistent." },
      { h: "A checkout people finish", p: "We keep the path to purchase short and clear, with as few steps and surprises as possible." },
      { h: "The back office too", p: "Orders, stock and customers are manageable by your team, so running the store does not depend on a developer." },
    ],
    problems: [
      "Orders taken over phone and WhatsApp, tracked by hand and easy to lose",
      "A catalog that is hard to keep current as products, prices and stock change",
      "Customers who abandon a checkout that is slow, confusing or asks for too much",
      "No simple way for your team to see new orders, update their status and manage stock",
      "A ready-made store that cannot handle your pricing, product options or delivery rules",
    ],
    stack: ["WooCommerce", "WordPress", "Shopify", "React", "Node.js"],
    local:
      "Selling online lets a shop or brand in Ahmedabad reach customers across Gujarat and the rest of India without opening another outlet. We help you choose the right route: a WooCommerce or Shopify store when your catalog and checkout are fairly standard, or a custom-built store when your products, pricing or order process are not. Ahmedabad businesses can plan the store with us in person; others work with us over video calls, email and WhatsApp.",
    reading: ["ecommerce-website-benefits-india", "business-website-cost-india", "website-vs-web-application"],
    faqs: [
      { q: "Do you build custom stores or use an existing platform?", a: "Either, depending on the requirement. A platform-based store is faster to launch for standard catalogs; a custom build makes sense when products, pricing or checkout logic are unusual." },
      { q: "Can you set up payment gateways used in India?", a: "Yes. We set up the payment provider that suits your business, along with the order and confirmation flow around it." },
      { q: "Should we use WooCommerce, Shopify or a custom store?", a: "WooCommerce suits businesses that want a store on a WordPress site they control and can extend. Shopify is quicker to set up and manages more for you, for a monthly fee. A custom store makes sense when your products, pricing or checkout logic do not fit either. We recommend one after understanding your catalog and how you sell." },
      { q: "What should we prepare before the store is built?", a: "A product list with names, prices, variants such as size or colour, and stock levels; clear product photos; your delivery areas and charges; and your return, refund and cancellation policies. Payment providers in India verify your business and bank details before they pay out, so it helps to start that application early." },
      { q: "Can our team manage products and orders without a developer?", a: "Yes. Whichever route you choose, your team gets an admin area to add products, change prices and stock, and process orders day to day." },
    ],
    projects: [],
  },
  {
    slug: "website-modernization",
    seoTitle: "Website Redesign & Modernization in Ahmedabad",
    seoDescription:
      "Redesign an outdated website: faster pages, layouts that work on phones, clearer structure and a maintainable codebase. Codefloor IT, Ahmedabad.",
    icon: RefreshCw,
    title: "Website Modernization",
    short: "Better architecture, performance, usability and maintainability for existing sites.",
    intro:
      "An ageing website costs you quietly: slow pages, layouts that break on phones, content nobody can edit. We improve what you already have — or rebuild it where that is the more sensible route.",
    build: [
      "Performance and loading improvements",
      "Responsive redesign of existing pages",
      "Moving to a maintainable codebase",
      "Clearer navigation and content structure",
      "Accessibility and usability fixes",
      "Search-friendly markup and metadata",
    ],
    approach: [
      { h: "Review what exists", p: "We look at the current site's structure, speed and content to see what is worth keeping and what is holding it back." },
      { h: "Improve in priority order", p: "The changes with the most effect on visitors come first, so you see value before the whole job is done." },
      { h: "Keep what works", p: "Existing content, URLs and search visibility are carried over carefully rather than thrown away." },
    ],
    problems: [
      "Pages that load slowly, especially on mobile data",
      "Layouts that break or become hard to use on phones",
      "An old codebase or theme where every small change is risky or expensive",
      "Navigation and content that grew without a plan, so visitors cannot find what they need",
      "Accessibility problems that shut some visitors out",
    ],
    stack: ["React", "Vite", "Node.js"],
    local:
      "Plenty of established businesses still rely on a website built years ago: the business has moved on, the site has not. If that sounds like yours, we can review it with you in person in Ahmedabad, or over a video call if you are elsewhere in Gujarat or India, and show you what is holding it back before recommending targeted fixes or a rebuild. Existing URLs and search visibility are planned for from the start, so a redesign does not undo what the old site had earned.",
    reading: ["professional-business-website", "business-website-timeline"],
    faqs: [
      { q: "How is an existing website modernized?", a: "We review the current site's speed, structure, content and code, then fix what affects visitors most first — loading speed, mobile layout, navigation, accessibility and metadata. If the foundation makes every change expensive, we recommend a rebuild that keeps your content and URLs." },
      { q: "Do we need a full rebuild?", a: "Not always. Sometimes targeted fixes are enough; sometimes the foundation makes every change expensive and a rebuild is cheaper in the long run. We tell you which we think applies and why." },
      { q: "Will we lose our search rankings?", a: "We plan the change to protect them: existing URLs are preserved or redirected, and titles, headings and content are carried across." },
      { q: "How long does a website redesign take?", a: "It depends on how many pages and templates the site has, how much of the content changes, and whether we improve the current code or rebuild. After reviewing the site we give you a timeline for each stage." },
      { q: "Can you modernize a website for a business outside Ahmedabad?", a: "Yes. The review, planning and progress updates all work over video calls, email and WhatsApp. Businesses in Ahmedabad can also meet us in person." },
    ],
    projects: [],
  },
  {
    slug: "maintenance-technical-support",
    seoTitle: "Website Maintenance & Support in Ahmedabad",
    seoDescription:
      "Website maintenance and technical support after launch: fixes, updates and steady improvements from Codefloor IT, a development team in Ahmedabad.",
    icon: LifeBuoy,
    title: "Maintenance & Technical Support",
    short: "Ongoing technical assistance, fixes and improvements after launch.",
    intro:
      "Software is never finished the day it goes live. Content changes, browsers update and new needs appear. We keep your website or application healthy and moving forward.",
    build: [
      "Bug fixes and troubleshooting",
      "Content and layout updates",
      "Software and dependency updates",
      "Small features and refinements",
      "Performance checks",
      "Help for your team when questions come up",
    ],
    approach: [
      { h: "Agree the scope", p: "We define what support covers and how requests are raised, so expectations are clear on both sides." },
      { h: "Fix the cause", p: "We look for why a problem happened, not just the quickest patch over the symptom." },
      { h: "Improve steadily", p: "Regular small improvements keep a product current and avoid the need for a costly overhaul later." },
    ],
    problems: [
      "Small bugs and broken pages that stay broken because no one is responsible for them",
      "Outdated software and dependencies that slow the site down or leave it vulnerable",
      "Content changes that pile up because no one on your team can make them",
      "A developer who built the site and can no longer be reached",
      "Gradual slowdowns that go unnoticed until visitors complain",
      "No clear record of who holds the logins for the server, domain and code",
    ],
    stack: ["React", "Node.js", "Express", "MySQL", "PostgreSQL"],
    local:
      "Support is simpler when your developer is close by. Businesses in Ahmedabad can meet us in person to agree what support covers and to review the site together, while clients elsewhere in Gujarat and India raise requests and get updates through email, WhatsApp and video calls. What support includes, and how requests are prioritised, is agreed with each client before it starts.",
    reading: ["website-maintenance-security", "choose-software-company"],
    faqs: [
      { q: "What is included in website maintenance?", a: "Typically bug fixes, content and layout updates, software and dependency updates, performance checks and small improvements. The exact scope, and how requests are raised, is agreed with each client before support starts." },
      { q: "Can you maintain a site you did not build?", a: "Usually, yes. We first review the existing code to understand its condition, then tell you honestly what we can take on." },
      { q: "How is support arranged?", a: "That is agreed per client — it depends on how much change you expect and how quickly you need responses. We set it out clearly before starting." },
      { q: "What do you need from us to take over an existing site?", a: "Access to the server or platform the site runs on, the domain account, the code and any admin logins, plus details of the third-party services it relies on, such as email or payments. Before changing anything, we review the code and setup and tell you what we found." },
      { q: "Do you maintain web applications as well as websites?", a: "Yes. We support websites and web applications, including fixes, updates to the software they depend on and small new features. The scope is agreed with each client." },
    ],
    projects: [],
  },
  {
    slug: "ui-ux-design",
    seoTitle: "UI/UX Design Services in Ahmedabad",
    seoDescription:
      "UI/UX design for websites and web applications: user journeys, wireframes and interface design that make the next step obvious. Codefloor IT, Ahmedabad.",
    icon: PenTool,
    title: "UI/UX Design",
    short: "Clear user journeys and interfaces for websites, web apps and business software.",
    intro:
      "Good design is how quickly someone understands what to do next. We work out who uses the product and what they came to do, then design screens that make that obvious, whether we build the product ourselves or hand the designs to your developers.",
    build: [
      "User journeys and page structure",
      "Wireframes for key screens",
      "Interface design for websites and web apps",
      "Dashboard and admin screen design",
      "Responsive layouts for phone, tablet and desktop",
      "Usability and accessibility reviews of existing screens",
    ],
    approach: [
      { h: "Start from the task", p: "We list who uses the product and the main job each of them comes to do, so every screen has a clear purpose." },
      { h: "Structure, then style", p: "Wireframes settle what goes where and in what order before any colours or visual details are decided." },
      { h: "Designed to be built", p: "Because we also develop software, designs stay realistic to build and are handed over with the states and edge cases developers need." },
    ],
    problems: [
      "Visitors who land on the site and cannot tell what to do next",
      "Software your team avoids because the screens are confusing or slow to use",
      "Forms and checkouts that people start but do not finish",
      "Dashboards crowded with data but short on the numbers people actually need",
      "Screens that work on a desktop but are awkward on a phone",
    ],
    stack: ["React", "Vite", "Responsive UI"],
    local:
      "Design decisions are easier to make together. Businesses in Ahmedabad can review wireframes and screens with us in person, walking through each step as their customers or staff would. Clients elsewhere in Gujarat and India get the same reviews over video calls with screen-sharing, so feedback is collected while it is still cheap to change.",
    reading: ["professional-business-website", "website-vs-web-application"],
    faqs: [
      { q: "What is the difference between UI and UX design?", a: "UX (user experience) design is about the journey: what a person needs to do, in what order, and what could stop them. UI (user interface) design is how each screen looks and behaves. We do both, because a good-looking screen in the wrong place in the journey still fails." },
      { q: "Can you design without building?", a: "Yes. We can design the screens and hand them to your own developers, with the states and edge cases they need. Most clients ask us to build as well, so the design and the build stay in one team." },
      { q: "Can you improve the design of software we already use?", a: "Yes. We review the existing screens, find where people get stuck, and redesign those parts first rather than starting over." },
      { q: "Will the design work on mobile?", a: "Yes. We design layouts for phone, tablet and desktop, and check that buttons, forms and text stay usable on small screens." },
      { q: "Do you offer UI/UX design to businesses outside Ahmedabad?", a: "Yes. Design reviews work well over video calls with screen-sharing, so businesses across Gujarat and India work with us the same way. Clients in Ahmedabad can also meet us in person." },
    ],
    projects: ["oracle-legal-consultancy", "aranya-palace", "leadhunter-crm"],
  },
  {
    slug: "it-consulting",
    seoTitle: "IT Consulting for Businesses in Ahmedabad",
    seoDescription:
      "Independent advice before you build: ready-made vs custom software, project scope, technology choices and reviews of existing websites. Codefloor IT, Ahmedabad.",
    icon: Compass,
    title: "IT Consulting",
    short: "Practical advice on what to build, what to buy and how to plan it.",
    intro:
      "Before spending on software, most businesses need a straight answer to a few questions: do we need custom software or will an existing product do, what should the first version include, and what will it take to run? We help you answer them, with advice based on building and maintaining real projects.",
    build: [
      "Ready-made vs custom software assessments",
      "Scoping a first version and a phased plan",
      "Technology recommendations for a new project",
      "Reviews of an existing website or application",
      "Second opinions on proposals and quotes",
      "Requirement documents your team can share",
    ],
    approach: [
      { h: "Understand the business first", p: "We look at how the work happens today and what has to change before talking about any technology." },
      { h: "Honest options", p: "We set out the realistic routes, including off-the-shelf tools when they are the better fit, with the trade-offs of each." },
      { h: "Something you can act on", p: "You get a written recommendation and scope you can use with us or with any other team." },
    ],
    problems: [
      "Not knowing whether to buy an existing product or build something custom",
      "Quotes from different vendors that are impossible to compare",
      "A project idea that keeps growing and has no clear first version",
      "An existing website or system that nobody on the team can assess",
      "Technology decisions made on what is new rather than what fits",
    ],
    stack: ["React", "Node.js", "PostgreSQL", "MySQL", "WordPress", "Shopify"],
    local:
      "Consulting starts with conversation, so businesses in Ahmedabad can meet us in person to talk through the problem, the current tools and the options. For companies elsewhere in Gujarat and India we run the same sessions over video calls and follow up with a written summary.",
    reading: ["custom-vs-ready-made-software", "when-to-build-custom-software", "choose-software-company", "custom-software-cost"],
    faqs: [
      { q: "Will you just recommend building custom software?", a: "No. If an existing product does the job, we will say so. Custom software makes sense only when your workflow does not fit the ready-made options, and we explain why either way." },
      { q: "What do we get at the end of a consultation?", a: "A written summary of the options, our recommendation and, where you are going ahead, a scope for the first version that you can use with us or with another team." },
      { q: "Can you review a proposal or quote from another company?", a: "Yes. We can read through a proposal and tell you what is clear, what is missing and which questions to ask before you sign." },
      { q: "Can you assess our existing website or software?", a: "Yes. We review its speed, structure, code and day-to-day use, and tell you what is worth keeping, what to fix first and whether a rebuild is justified." },
      { q: "Do you offer IT consulting outside Ahmedabad?", a: "Yes. Sessions run over video calls for businesses across Gujarat and India, with in-person meetings available in Ahmedabad." },
    ],
    projects: [],
  },
];

export const getService = (slug) => services.find((s) => s.slug === slug);
