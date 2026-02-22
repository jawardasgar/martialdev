document.addEventListener('DOMContentLoaded', function() {
    console.log('=== Script loaded ===');
    
    // ==================== STATS COUNTER ====================
    function startCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        console.log('Starting counter for:', element, 'target:', target);
        
        if (isNaN(target)) return;
        
        let current = 0;
        const increment = target / 60;
        
        const interval = setInterval(() => {
            current += increment;
            
            if (current >= target) {
                element.textContent = target;
                clearInterval(interval);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 30);
    }
    
    // Get all stat numbers and start counting
    setTimeout(() => {
        const statNumbers = document.querySelectorAll('.stat-number');
        console.log('Found ' + statNumbers.length + ' stat numbers');
        
        statNumbers.forEach(stat => {
            startCounter(stat);
        });
    }, 100);
    
    // ==================== PARALLAX SCROLLING ====================
    
    // Parallax effect for sections
    const parallaxSections = document.querySelectorAll('.parallax-section');
    
    const parallaxObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    parallaxSections.forEach(section => {
        parallaxObserver.observe(section);
    });
    
    // Parallax background effect on scroll
    let ticking = false;
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const parallaxBg = document.querySelector('.parallax-bg');
                
                if (parallaxBg) {
                    parallaxBg.style.transform = `translateY(${scrolled * 0.5}px)`;
                }
                
                // Navbar slide effect
                const navbar = document.getElementById('navbar');
                if (navbar) {
                    if (scrolled > lastScroll && scrolled > 100) {
                        // Scrolling down - hide navbar
                        navbar.style.transform = 'translateY(-100%)';
                    } else {
                        // Scrolling up - show navbar
                        navbar.style.transform = 'translateY(0)';
                    }
                    lastScroll = scrolled;
                }
                
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // ==================== SMOOTH SCROLLING ====================
    const navLinks = document.querySelectorAll('.nav-link, a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href;
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
    
    // ==================== NAVBAR SCROLL EFFECT ====================
    const navbar = document.getElementById('navbar');
    let lastScrollPos = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('navbar-scrolled');
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
        } else {
            navbar.classList.remove('navbar-scrolled');
            navbar.style.boxShadow = 'none';
        }
        
        lastScrollPos = currentScroll;
    });

    
    // ==================== CHATBOT ====================
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotForm = document.getElementById('chatbotForm');
    const chatInput = document.getElementById('chatInput');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const quickReplies = document.querySelectorAll('.quick-reply');

    // Debug logging
    console.log('Chatbot elements:', {
        toggle: chatbotToggle,
        window: chatbotWindow,
        close: chatbotClose,
        form: chatbotForm,
        input: chatInput,
        messages: chatbotMessages,
        quickRepliesCount: quickReplies.length
    });

    // Chatbot responses - Sri Lankan market focused
    const botResponses = {
        greeting: [
            "Hey! Great to have you here. What can I help you with today? 😊",
            "Hello! Welcome to MartialDev. How can I assist you?",
            "Hi there! Ready to build something amazing together?"
        ],
        services: [
            "We specialize in:\n\n💻 **Full Stack Web Development**\n📱 **Mobile Apps** (iOS & Android)\n🤖 **Custom AI Solutions**\n\nWhether you need a simple company website, an e-commerce platform, or a complex internal system — we've got you covered!\n\nWould you like to know about pricing?"
        ],
        pricing: [
            "Every project is unique, but we keep our pricing transparent:\n\n🌐 **Portfolio Sites:** From LKR 45,000+\n🛒 **E-commerce Platforms:** From LKR 230,000+\n📱 **App Solutions:** Custom pricing based on scale\n\nDrop us a message with your requirements, and we can give you a **free estimate**!\n\n💬 Would you prefer to chat on WhatsApp? Click the green button below!"
        ],
        techstack: [
            "We use modern, scalable tech stacks to ensure your app is fast and future-proof:\n\n**Frontend:** React, Next.js, Tailwind CSS\n**Backend:** Node.js, Python (for AI features), Firebase, Supabase\n**Hosting:** Vercel, AWS, or local SL servers if data residency is required with premium Hostinger hosting provided on request.\n\nThis means your product will be built with industry-leading tools! 🚀"
        ],
        timeline: [
            "It depends on the scope! Here's a rough idea:\n\n⚡ **Landing Pages:** 3–5 days\n🛒 **E-commerce Sites:** 2–4 weeks\n🔧 **Custom Software/MVPs:** 4–8 weeks\n\nThe time duration typically ranges between 2–3 weeks depending on scale. We always prioritise early delivery and continuous client feedback!\n\nWe work in sprints, so we'll show you updates every week."
        ],
        support: [
            "Absolutely! We provide post-launch support and maintenance for all our clients 🤝\n\n✅ **1-month FREE support** after launch to fix any bugs\n✅ **Annual Maintenance Plan (AMC)** available for ongoing updates, backups, and security\n\nYou're in safe hands with us!"
        ],
        location: [
            "We are a remote-first startup based in **Colombo** 🇱🇰\n\nWe are currently operating on an online basis only.\n\n☕ Happy to meet in person for coffee if you're nearby!\n💻 Otherwise, we can hop on a Zoom or Google Meet call.\n\n**Quick Chat:** Click the WhatsApp button below to chat with us instantly!"
        ],
        contact: [
            "You can reach us through:\n\n📱 **WhatsApp** - Click the button below for instant chat (fastest!)\n📝 **Contact Form** - Scroll down to 'Let's Talk'\n📧 **Response Time** - Within 24 hours\n\nPlease fill out the form below and one of our representatives will get in touch with you shortly!"
        ],
        whatsapp: [
            "Great choice! 📱\n\nClick here to chat with us on WhatsApp:\n👉 <a href='https://wa.me/94701387799' target='_blank' style='color: #25D366; font-weight: bold;'>Open WhatsApp Chat</a>\n\nWe typically reply within a few minutes during business hours!"
        ],
        portfolio: [
            "Check out some of our recent work! 🎨\n\n🥥 **LimaRococo** - Premium coconut products\n🌿 **CanelaCeylon** - Ceylon cinnamon e-commerce\n🍚 **RiceTerra** - Premium rice products\n\nScroll to our **'Our Work'** section to see them in action! Want to discuss a similar project?"
        ],
        about: [
            "MartialDev is a digital studio based in Colombo, focused on building products designed to grow 🚀\n\nThe name 'Martial' reflects our approach: **disciplined, intentional, and precise.**\n\nWe don't rush builds or chase trends. Every product is shaped with long-term performance in mind.\n\nWant to know more about our process or pricing?"
        ],
        quote: [
            "To get a quote for your project, please reach out to us via our contact form! 📝\n\nScroll down to the **'Let's Talk'** section and fill in your project details. We'll get back to you within 24 hours with a customized estimate.\n\n💬 Or chat with us on WhatsApp for faster response!"
        ],
        crossplatform: [
            "Yes, we support cross-platform mobile development! 📱\n\nWe work with **Flutter** and **React Native** to build apps that run seamlessly on both iOS and Android from a single codebase.\n\nThis approach saves time and cost while ensuring a native-like experience on all devices!"
        ],
        security: [
            "Security is a top priority for us! 🔒\n\nThe security of our projects is maintained via the use of mainstream verified software with inbuilt encryption and industry-leading security standards.\n\nYour data and your users' data are always protected."
        ],
        scalability: [
            "Absolutely! Our solutions are built to scale 🚀\n\nThe software we build can handle **10,000+ concurrent users** with ease. We architect our systems with scalability in mind from day one, using cloud infrastructure and best practices to ensure your application grows with your business."
        ],
        integration: [
            "Yes, integration with existing tools is entirely possible! 🔗\n\nWe can integrate your new software with platforms like Salesforce, Stripe, and more.\n\nHowever, for the Sri Lankan market, we recommend the use of **Payable** for payment processing as it's optimized for local transactions."
        ],
        hosting: [
            "Yes, we handle server setup and hosting as part of our core service! 🖥️\n\nWe offer:\n• **Vercel & AWS** for global scalability\n• **Local SL servers** if data residency is required\n• **Premium Hostinger hosting** on request\n\nYou won't have to worry about the technical infrastructure!"
        ],
        ownership: [
            "Great question about code ownership! 💻\n\nThe source code will be kept on our GitHub repository, making it easier for us to make changes as and when necessary.\n\n**Security of the source code is our highest priority.** You'll always have access to your project's codebase."
        ],
        hours: [
            "We will respond within **24 hours** of any request! ⏰\n\nFor faster response, click the WhatsApp button below to chat with us instantly!\n\n💬 Most queries are answered within minutes during business hours."
        ],
        human: [
            "Of course! We'd be happy to connect you with a real person 🙋\n\nPlease fill out the form below and one of our representatives will get in touch with you shortly.\n\nOr click the WhatsApp button for instant chat with our team!"
        ],
        default: [
            "That's a great question! For detailed information, I'd recommend chatting with us on WhatsApp — it's much easier to discuss there.\n\n💬 Would you like me to redirect you to WhatsApp?",
            "I'd love to help with that! For specific inquiries, WhatsApp is the fastest way to get answers.\n\nShall I share our WhatsApp link?",
            "Thanks for asking! Our team can give you the best answer directly.\n\n📱 Chat with us on WhatsApp or fill out the contact form below!"
        ]
    };

    // Toggle chatbot
    function toggleChatbot() {
        console.log('toggleChatbot called');
        console.log('Elements exist:', {
            toggle: !!chatbotToggle,
            window: !!chatbotWindow
        });
        
        if (!chatbotToggle || !chatbotWindow) {
            console.error('Missing chatbot elements!');
            return;
        }
        
        chatbotToggle.classList.toggle('active');
        chatbotWindow.classList.toggle('active');
        
        console.log('Classes after toggle:', {
            toggleActive: chatbotToggle.classList.contains('active'),
            windowActive: chatbotWindow.classList.contains('active')
        });
        
        if (chatbotWindow.classList.contains('active') && chatInput) {
            chatInput.focus();
        }
    }

    if (chatbotToggle) {
        console.log('Adding click listener to chatbot toggle button');
        chatbotToggle.addEventListener('click', toggleChatbot);
    } else {
        console.error('chatbotToggle element not found!');
    }
    if (chatbotClose) {
        console.log('Adding click listener to chatbot close button');
        chatbotClose.addEventListener('click', toggleChatbot);
    } else {
        console.error('chatbotClose element not found!');
    }

    // Add message to chat
    function addMessage(content, isUser = false) {
        console.log('addMessage called:', { content, isUser, messagesElement: !!chatbotMessages });
        
        if (!chatbotMessages) {
            console.error('❌ chatbotMessages element not found!');
            return;
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex gap-2 chat-message ${isUser ? 'user-message' : ''}`;
        
        if (isUser) {
            messageDiv.innerHTML = `
                <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl rounded-br-sm px-4 py-3 max-w-xs">
                    <p class="text-sm">${content.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span class="text-blue-600 text-sm font-bold">M</span>
                </div>
                <div class="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-3 max-w-xs">
                    <p class="text-gray-800 text-sm">${content.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>
                </div>
            `;
        }
        
        console.log('Appending message to chatbotMessages');
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        console.log('Message added successfully');
    }

    // Show typing indicator
    function showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'flex gap-2 typing';
        typingDiv.innerHTML = `
            <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-blue-600 text-sm font-bold">M</span>
            </div>
            <div class="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-3">
                <div class="flex gap-1">
                    <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0s"></span>
                    <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
                    <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></span>
                </div>
            </div>
        `;
        chatbotMessages.appendChild(typingDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        return typingDiv;
    }

    // Get bot response
    function getBotResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.match(/^(hi|hello|hey|greetings|ayubowan|kohomada)$/i) || lowerMessage.match(/^hi\b|^hello\b|^hey\b/)) {
            return botResponses.greeting[Math.floor(Math.random() * botResponses.greeting.length)];
        }
        if (lowerMessage.match(/service|offer|do you do|what do you|build|develop|project|handle|kind of|specialize/)) {
            return botResponses.services[0];
        }
        if (lowerMessage.match(/price|pricing|cost|budget|how much|rate|fee|lkr|rupee|dollar|charge/)) {
            return botResponses.pricing[0];
        }
        if (lowerMessage.match(/quote|estimate|get a quote|hire|hiring/)) {
            return botResponses.quote[0];
        }
        if (lowerMessage.match(/tech|technology|stack|framework|language|react|node|python|what.*use/)) {
            return botResponses.techstack[0];
        }
        if (lowerMessage.match(/cross.?platform|flutter|react native|ios|android|mobile app/)) {
            return botResponses.crossplatform[0];
        }
        if (lowerMessage.match(/security|secure|data protection|encrypt|safe|privacy/)) {
            return botResponses.security[0];
        }
        if (lowerMessage.match(/scale|scalab|concurrent|users|traffic|10.?000|thousand|performance|handle.*users/)) {
            return botResponses.scalability[0];
        }
        if (lowerMessage.match(/integrat|salesforce|stripe|payable|existing.*tool|connect.*system|api/)) {
            return botResponses.integration[0];
        }
        if (lowerMessage.match(/time|timeline|how long|duration|deadline|finish|complete|deliver|days|weeks|mvp/)) {
            return botResponses.timeline[0];
        }
        if (lowerMessage.match(/support|maintain|after|bug|update|amc|abandon|help later|post.?launch/)) {
            return botResponses.support[0];
        }
        if (lowerMessage.match(/host|server|setup|deploy|infrastructure/)) {
            return botResponses.hosting[0];
        }
        if (lowerMessage.match(/own|ownership|source code|code|github|repository|ip|intellectual/)) {
            return botResponses.ownership[0];
        }
        if (lowerMessage.match(/where|location|located|office|meet|colombo|address|visit/)) {
            return botResponses.location[0];
        }
        if (lowerMessage.match(/hour|hours|business hour|working hour|respond|response time|available|when/)) {
            return botResponses.hours[0];
        }
        if (lowerMessage.match(/real person|speak.*person|human|talk.*someone|representative|agent/)) {
            return botResponses.human[0];
        }
        if (lowerMessage.match(/whatsapp|wa\.me|chat|message you|quick chat/)) {
            return botResponses.whatsapp[0];
        }
        if (lowerMessage.match(/contact|reach|email|phone|talk|call/)) {
            return botResponses.contact[0];
        }
        if (lowerMessage.match(/portfolio|work|example|showcase|client|previous|done before|show.*app|show.*website/)) {
            return botResponses.portfolio[0];
        }
        if (lowerMessage.match(/about|who|company|team|martial|you guys/)) {
            return botResponses.about[0];
        }
        
        return botResponses.default[Math.floor(Math.random() * botResponses.default.length)];
    }

    // Handle message submission
    function handleMessage(message) {
        console.log('handleMessage called with:', message);
        if (!message.trim()) {
            console.log('Message is empty, returning');
            return;
        }
        
        console.log('Adding user message');
        addMessage(message, true);
        
        const quickRepliesEl = document.getElementById('quickReplies');
        if (quickRepliesEl) {
            quickRepliesEl.style.display = 'none';
        }
        
        console.log('Showing typing indicator');
        const typingIndicator = showTyping();
        
        setTimeout(() => {
            typingIndicator.remove();
            const response = getBotResponse(message);
            console.log('Bot response:', response);
            addMessage(response);
        }, 1000 + Math.random() * 500);
    }

    // Form submission
    if (chatbotForm && chatInput) {
        console.log('✅ Chatbot form and input found, adding submit listener');
        chatbotForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Form submitted!');
            const message = chatInput.value;
            console.log('Message:', message);
            chatInput.value = '';
            handleMessage(message);
        });
    } else {
        console.error('❌ Chatbot form or input NOT found:', { form: !!chatbotForm, input: !!chatInput });
    }

    // Quick replies
    console.log('Quick replies count:', quickReplies.length);
    quickReplies.forEach(btn => {
        btn.addEventListener('click', () => {
            const message = btn.getAttribute('data-message');
            console.log('Quick reply clicked:', message);
            handleMessage(message);
        });
    });
});
