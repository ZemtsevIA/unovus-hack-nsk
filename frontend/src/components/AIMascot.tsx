import { X } from "./Icons";
import { useState } from "react";
import mascotImage from "figma:asset/626422e9504966fb4e6a96ef8565bf9e6cd78804.png";

interface AIMascotProps {
  message?: string;
}

export function AIMascot({ message = "Привет! Я здесь, чтобы помочь вам." }: AIMascotProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "bot"; text: string }[]>([
    { role: "bot", text: message },
    { role: "bot", text: "Я могу помочь вам с:\n• Интерпретацией результатов\n• Персональными рекомендациями\n• Ресурсами для благополучия" },
  ]);

  const handleMascotClick = () => {
    if (isMinimized) {
      setIsMinimized(false);
    } else {
      setShowChat(!showChat);
    }
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;

    
    setChatHistory((prev) => [...prev, { role: "user", text: chatMessage }]);
    setChatMessage(""); 

    try {
      
      const response = await fetch("https://dodoswrkflw.app.n8n.cloud/webhook/f70949fd-7e82-450c-b382-f6988cf18c0b", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatInput: chatMessage }),
      });

      if (!response.ok) throw new Error("Ошибка запроса");

      const data = await response.json();
      
      setChatHistory((prev) => [...prev, { role: "bot", text: data[0].answer || "Извините, произошла ошибка." }]);
    } catch (error) {
      console.error(error);
      setChatHistory((prev) => [...prev, { role: "bot", text: "Ошибка связи с сервером." }]);
    }
  };

  if (isMinimized) {
    return (
      <button
        onClick={handleMascotClick}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform z-50"
        aria-label="Open AI Assistant"
      >
        <img src={mascotImage} alt="AI Assistant" className="w-16 h-16" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div className="flex flex-col items-end gap-3">
        {showChat && (
          <div className="bg-card rounded-2xl shadow-xl border-2 border-primary/30 w-80 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-primary p-4">
              <h3 className="text-sm text-primary-foreground">AI Ассистент</h3>
              <p className="text-xs text-primary-foreground/80">Чем могу помочь?</p>
            </div>
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto bg-card">
              {chatHistory.map((msg, index) => (
                <div key={index} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className="w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center">
                    <img src={mascotImage} alt={msg.role === "bot" ? "AI" : "User"} className="w-8 h-8" />
                  </div>
                  <div
                    className={`rounded-2xl p-3 flex-1 border border-primary/20 ${
                      msg.role === "user" ? "bg-secondary/10 rounded-tr-none" : "bg-primary/10 rounded-tl-none"
                    }`}
                  >
                    <p className="text-sm text-foreground whitespace-pre-line">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-border bg-card">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Напишите сообщение..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} // Отправка по Enter
                  className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Отправить
                </button>
              </div>
            </div>
          </div>
        )}
        {!showChat && message && (
          <div className="bg-card rounded-2xl shadow-lg p-4 max-w-xs border-2 border-primary/30 backdrop-blur-sm">
            <p className="text-sm text-foreground leading-relaxed">{message}</p>
          </div>
        )}
        <div className="relative">
          <button
            onClick={() => setIsMinimized(true)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center hover:bg-accent transition-colors shadow-md z-10"
            aria-label="Minimize AI Assistant"
          >
            <X className="w-3 h-3 text-muted-foreground" />
          </button>
          <button
            onClick={handleMascotClick}
            className="w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
            aria-label="Chat with AI Assistant"
          >
            <img src={mascotImage} alt="AI Assistant" className="w-16 h-16" />
          </button>
        </div>
      </div>
    </div>
  );
}