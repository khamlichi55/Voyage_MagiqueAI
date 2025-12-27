// chatinterface.tsx

import { useState, useRef, useEffect } from 'react';
import { useTravel } from '@/context/TravelContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { ChatMessage } from '@/types/travel';
import { cn } from '@/lib/utils';
import { sendMessageToLLM } from "@/services/llmService";
// IMPORTATION AJOUTÉE : Pour le rendu du Markdown
import ReactMarkdown from 'react-markdown'; 

const suggestedQuestions = [
  "Ajoute plus d'activités culturelles",
  "Recommande des restaurants locaux",
  "Propose une journée détente",
  "Optimise le budget transport",
];



const ChatInterface = () => {
  const { chatMessages, addChatMessage, itinerary } = useTravel();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // LIGNE SUPPRIMÉE : console.log(import.meta.env.VITE_GEMINI_API_KEY);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);


  const handleSend = async (message: string = input) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    addChatMessage(userMessage);
    setInput("");
    setIsTyping(true);

    try {
      // 🧠 MODIFICATION MAJEURE : Sérialisation complète de l'itinéraire en JSON pour un contexte précis
      const itineraryContext = itinerary
        ? JSON.stringify(itinerary, null, 2)
        : "Aucun itinéraire créé pour le moment.";

      const historyText = chatMessages
        .map((m) => `${m.role === "user" ? "Utilisateur" : "Assistant"}: ${m.content}`)
        .join("\n");

      // Prompt optimisé pour inclure le contexte JSON
      const prompt = `Tu es un assistant de voyage expert.
Tu aides à améliorer et personnaliser un itinéraire touristique.
Réponds de manière claire, structurée et utile, en utilisant le Markdown (titres, listes à puces) pour faciliter la lecture.

DONNÉES ACTUELLES DE L'ITINÉRAIRE (JSON pour référence) :
${itineraryContext}

Historique de la conversation :
${historyText}

Nouvelle demande utilisateur :
${message}

Réponds en français.`;

      const aiResponse = await sendMessageToLLM(prompt);

      addChatMessage({
        id: `msg-${Date.now()}-response`,
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      });
    } catch (error) {
      addChatMessage({
        id: `msg-${Date.now()}-error`,
        role: "assistant",
        content: "❌ Erreur lors de la communication avec l’IA.",
        timestamp: new Date(),
      });
    }

    setIsTyping(false);
  };


  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Chat header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border mb-4">
        <div className="w-12 h-12 rounded-xl bg-current flex items-center justify-center shadow-soft">
          <Bot className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold">Assistant Voyage</h2>
          <p className="text-sm text-muted-foreground">Ajustez et personnalisez votre itinéraire</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {chatMessages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-ocean/10 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-ocean" />
            </div>
            <h3 className="font-display text-lg font-semibold mb-2">
              Comment puis-je vous aider ?
            </h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
              Je peux modifier votre itinéraire, ajouter des activités, recommander des restaurants, 
              ou répondre à toutes vos questions sur votre voyage.
            </p>
            
            {/* Suggested questions */}
            <div className="flex flex-wrap justify-center gap-2">
              {suggestedQuestions.map((question) => (
                <button
                  key={question}
                  onClick={() => handleSend(question)}
                  className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm hover:bg-sand-dark transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {chatMessages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3 animate-fade-up",
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-ocean/10 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-ocean" />
              </div>
            )}
            
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3",
                message.role === 'user'
                  ? 'bg-ocean text-primary-foreground rounded-br-md'
                  : 'bg-card shadow-soft rounded-bl-md'
              )}
            >
              {/* MODIFICATION MAJEURE : Utilisation de ReactMarkdown pour le rendu des réponses de l'IA */}
              <div className="text-sm prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            </div>
            
            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-coral/10 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-coral" />
              </div>
            )}
          </div>
        ))}
        

        {isTyping && (
          <div className="flex gap-3 animate-fade-up">
            <div className="w-8 h-8 rounded-lg bg-ocean/10 flex items-center justify-center">
              <Bot className="w-4 h-4 text-ocean" />
            </div>
            <div className="bg-card shadow-soft rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.1s' }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
        
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="pt-4 border-t border-border mt-4">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-3"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question ou demandez une modification..."
            className="flex-1 h-12"
            disabled={isTyping}
          />
          <Button 
            type="submit" 
            variant="hero" 
            size="icon" 
            className="h-12 w-12"
            disabled={!input.trim() || isTyping}
          >
            {isTyping ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </form>
        
      </div>
    </div>
  );
};

export default ChatInterface;