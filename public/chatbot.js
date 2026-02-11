// Simple, reliable chatbot script
console.log('=== CHATBOT.JS LOADED ===');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded fired');
    
    // Get elements
    const toggle = document.getElementById('chatbotToggle');
    const window = document.getElementById('chatbotWindow');
    const closeBtn = document.getElementById('chatbotClose');
    const form = document.getElementById('chatbotForm');
    const input = document.getElementById('chatInput');
    const messagesDiv = document.getElementById('chatbotMessages');
    
    console.log('Elements:', {
        toggle: !!toggle,
        window: !!window,
        closeBtn: !!closeBtn,
        form: !!form,
        input: !!input,
        messagesDiv: !!messagesDiv
    });
    
    // Toggle chatbot
    function toggleChat() {
        console.log('toggleChat called');
        if (!toggle || !window) return;
        
        toggle.classList.toggle('active');
        window.classList.toggle('active');
        
        if (window.classList.contains('active') && input) {
            input.focus();
        }
    }
    
    if (toggle) {
        toggle.addEventListener('click', toggleChat);
        console.log('✅ Toggle click listener added');
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', toggleChat);
        console.log('✅ Close button listener added');
    }
    
    // Add message
    function addMessage(text, isUser) {
        console.log('addMessage:', {text, isUser, hasMsgDiv: !!messagesDiv});
        
        if (!messagesDiv) {
            console.error('messagesDiv not found');
            return;
        }
        
        const msg = document.createElement('div');
        msg.className = `flex gap-2 chat-message ${isUser ? 'user-message' : ''}`;
        
        if (isUser) {
            msg.innerHTML = `<div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl rounded-br-sm px-4 py-3 max-w-xs"><p class="text-sm">${text}</p></div>`;
        } else {
            msg.innerHTML = `<div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0"><span class="text-blue-600 text-sm font-bold">M</span></div><div class="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-3 max-w-xs"><p class="text-gray-800 text-sm">${text}</p></div>`;
        }
        
        messagesDiv.appendChild(msg);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        console.log('✅ Message added');
    }
    
    // Get response
    function getResponse(msg) {
        const lower = msg.toLowerCase();
        
        if (lower.includes('service') || lower.includes('offer')) {
            return 'We offer website development, mobile apps, and custom software solutions tailored to your business needs.';
        }
        if (lower.includes('price') || lower.includes('cost')) {
            return 'Pricing varies based on project complexity. Get in touch for a custom quote!';
        }
        if (lower.includes('timeline') || lower.includes('how long')) {
            return 'Most projects take 4-12 weeks depending on scope. We\'ll discuss timelines during consultation.';
        }
        if (lower.includes('support')) {
            return 'Yes! We provide ongoing support and maintenance after launch. Your success is our priority.';
        }
        if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
            return 'Hey! Welcome to MartialDev. How can I help you today? 😊';
        }
        if (lower.includes('about') || lower.includes('who')) {
            return 'MartialDev is a digital studio building products designed to grow with your business. We specialize in web and mobile development.';
        }
        if (lower.includes('contact') || lower.includes('reach')) {
            return 'You can reach us via the form below or chat with us on WhatsApp. We respond within 24 hours!';
        }
        
        return 'That\'s a great question! For more details, feel free to reach out on WhatsApp or use the contact form. We\'re here to help! 💬';
    }
    
    // Handle form submit
    if (form && input) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const msg = input.value.trim();
            console.log('Form submitted with message:', msg);
            
            if (!msg) return;
            
            addMessage(msg, true);
            input.value = '';
            
            // Simulate typing delay
            setTimeout(() => {
                const response = getResponse(msg);
                addMessage(response, false);
            }, 500);
        });
        console.log('✅ Form submit listener added');
    } else {
        console.error('Form or input not found');
    }
    
    // Quick replies
    const quickBtns = document.querySelectorAll('.quick-reply');
    console.log('Quick reply buttons count:', quickBtns.length);
    
    quickBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const msg = this.getAttribute('data-message');
            console.log('Quick reply clicked:', msg);
            addMessage(msg, true);
            
            setTimeout(() => {
                const response = getResponse(msg);
                addMessage(response, false);
            }, 500);
        });
    });
    
    console.log('=== CHATBOT INITIALIZATION COMPLETE ===');
});
