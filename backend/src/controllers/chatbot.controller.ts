import { Request, Response, NextFunction } from "express";
import Message from "../models/message.model";
import { v4 as uuidv4 } from "uuid";

export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { sessionId, message } = req.body;

    // Validate input
    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Message content is required",
      });
    }

    // Use existing sessionId or create new one
    const chatSessionId = sessionId || uuidv4();

    // Save user message
    const userMessage = new Message({
      sessionId: chatSessionId,
      role: "user",
      content: message.trim(),
    });
    await userMessage.save();

    // Generate bot response (simple rule-based for now)
    const botResponse = generateBotResponse(message);

    // Save bot response
    const assistantMessage = new Message({
      sessionId: chatSessionId,
      role: "assistant",
      content: botResponse,
    });
    await assistantMessage.save();

    res.json({
      success: true,
      data: {
        sessionId: chatSessionId,
        userMessage: userMessage.content,
        botResponse: assistantMessage.content,
        timestamp: assistantMessage.timestamp,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getChatHistory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { sessionId } = req.params;

    const messages = await Message.find({ sessionId })
      .sort({ timestamp: 1 })
      .select("-__v");

    res.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

// Simple rule-based chatbot response generator
function generateBotResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  // Greetings
  if (lowerMessage.match(/\b(hi|hello|hey|greetings)\b/)) {
    return "Hello! 🥋 Welcome to MartialDev. I'm here to help you with information about our services, pricing, or any questions you might have. How can I assist you today?";
  }

  // Services
  if (lowerMessage.match(/\b(service|services|what do you do|offer)\b/)) {
    return "At MartialDev, we offer a range of development services:\n\n• Web Development (Full-stack applications)\n• Mobile App Development (iOS & Android)\n• UI/UX Design\n• Cloud Solutions\n• Technical Consulting\n\nWhich service interests you most?";
  }

  // Pricing
  if (lowerMessage.match(/\b(price|pricing|cost|budget|how much)\b/)) {
    return "Our pricing varies based on project scope and requirements:\n\n• Small projects: Starting from $10k\n• Medium projects: $10k - $50k\n• Enterprise projects: $50k+\n\nWould you like to discuss your specific project? Feel free to use our contact form to get a detailed quote!";
  }

  // Technologies
  if (lowerMessage.match(/\b(technology|technologies|stack|tech stack)\b/)) {
    return "We work with cutting-edge technologies:\n\n• Frontend: Angular, React, Vue.js\n• Backend: Node.js, Express, NestJS\n• Databases: MongoDB, PostgreSQL, MySQL\n• Cloud: AWS, Azure, Google Cloud\n• Mobile: React Native, Flutter\n\nWe choose the best tech stack based on your project needs!";
  }

  // Timeline
  if (lowerMessage.match(/\b(timeline|time|how long|duration)\b/)) {
    return "Project timelines typically range from:\n\n• Simple websites: 2-4 weeks\n• Web applications: 2-4 months\n• Complex platforms: 4-6+ months\n\nThe exact timeline depends on project complexity and requirements. Let's discuss your project to give you a more accurate estimate!";
  }

  // Contact
  if (lowerMessage.match(/\b(contact|reach|email|phone|talk)\b/)) {
    return "I'd love to connect you with our team! You can:\n\n• Fill out our contact form on this page\n• Email us at: contact@martialdev.com\n• Schedule a consultation call\n\nOur team typically responds within 24 hours. What's the best way to reach you?";
  }

  // Thanks
  if (lowerMessage.match(/\b(thank|thanks|appreciate)\b/)) {
    return "You're very welcome! 😊 If you have any other questions or would like to start a project, feel free to ask or use our contact form. Have a great day!";
  }

  // Default response
  return "Thanks for your message! I'm here to help you learn more about MartialDev's services, pricing, technologies, and more. What would you like to know?";
}
