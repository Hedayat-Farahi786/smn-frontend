import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  MessageSquare,
  Send,
  Bot,
  FileText,
  Upload,
  Mic,
  MicOff,
  Paperclip,
  Trash2,
  Copy,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

const ChatPage: React.FC = () => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const chatHistory = [
    {
      id: 1,
      type: "user",
      message:
        "Can you explain the termination clause in my employment contract?",
      timestamp: "2:30 PM",
      document: "Employment Agreement - John Smith",
    },
    {
      id: 2,
      type: "ai",
      message:
        "I'd be happy to help explain the termination clause. Based on your employment contract, here are the key points:\n\n1. **Notice Period**: Either party can terminate with 30 days written notice\n2. **Immediate Termination**: The company can terminate immediately for cause (misconduct, violation of policies)\n3. **Severance**: You're entitled to 2 weeks severance pay if terminated without cause\n4. **Non-compete**: 6-month non-compete clause applies after termination\n\nWould you like me to elaborate on any of these points?",
      timestamp: "2:31 PM",
      suggestions: [
        "Explain non-compete clause",
        "What constitutes 'cause'?",
        "Severance calculation",
      ],
    },
    {
      id: 3,
      type: "user",
      message: "What constitutes 'cause' for immediate termination?",
      timestamp: "2:32 PM",
    },
    {
      id: 4,
      type: "ai",
      message:
        "According to your contract, 'cause' for immediate termination includes:\n\n• **Gross misconduct** or violation of company policies\n• **Criminal activity** or behavior that damages company reputation\n• **Negligence** that results in significant financial loss\n• **Breach of confidentiality** or non-disclosure agreements\n• **Insubordination** or refusal to follow reasonable directives\n• **Substance abuse** that affects job performance\n\nThese are fairly standard provisions, but they must be clearly documented and follow due process. Would you like me to explain your rights if you believe a termination was wrongful?",
      timestamp: "2:33 PM",
      suggestions: [
        "Wrongful termination rights",
        "Documentation requirements",
        "Legal recourse options",
      ],
    },
  ];

  const recentDocuments = [
    { name: "Employment Agreement - John Smith", lastAccessed: "2 hours ago" },
    { name: "NDA - TechCorp Partnership", lastAccessed: "1 day ago" },
    { name: "Service Contract - ABC Corp", lastAccessed: "3 days ago" },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle sending message
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            AI Chat Assistant
          </h1>
          <p className="text-muted-foreground">
            Get instant answers about your documents and contracts
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
          <Button variant="outline">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Chat
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Chat Header */}
              <div className="p-4 border-b">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Assistant</h3>
                    <p className="text-xs text-muted-foreground">
                      Online • Ready to help
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatHistory.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] ${
                        msg.type === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      } rounded-lg p-3`}
                    >
                      {msg.type === "ai" && (
                        <div className="flex items-center space-x-2 mb-2">
                          <Bot className="h-4 w-4" />
                          <span className="text-xs font-medium">
                            AI Assistant
                          </span>
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-wrap">
                        {msg.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs opacity-70">
                          {msg.timestamp}
                        </span>
                        {msg.type === "ai" && (
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                            >
                              <ThumbsUp className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                            >
                              <ThumbsDown className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                      {msg.suggestions && (
                        <div className="mt-3 space-y-1">
                          {msg.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs mr-2"
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about your documents..."
                      className="w-full p-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      rows={3}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Button variant="outline" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsRecording(!isRecording)}
                    >
                      {isRecording ? (
                        <MicOff className="h-4 w-4" />
                      ) : (
                        <Mic className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Documents */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Recent Documents</h3>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-3">
                {recentDocuments.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.lastAccessed}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Analyze Document
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contract Review
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Bot className="h-4 w-4 mr-2" />
                  Legal Q&A
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
