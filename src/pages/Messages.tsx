
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { fetchAllProducts } from "@/integrations/supabase/products";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Search, 
  ChevronLeft, 
  MoreVertical, 
  Send, 
  Smile, 
  Image as ImageIcon, 
  Mic, 
  Clock, 
  Check, 
  CheckCheck,
  Phone,
  Video
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Updated Message interface with optional reactions
interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  read: boolean;
  avatar: string;
  reactions?: { type: string; count: number; }[];
}

interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  avatar: string;
  isVendor?: boolean;
  isVerified?: boolean;
}

export default function Messages() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchAllProducts,
  });

  const isMobile = useIsMobile();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [message, setMessage] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationsFilter, setConversationsFilter] = useState("");
  const [navbarHidden, setNavbarHidden] = useState(false);

  // Initialize sample data
  useEffect(() => {
    if (isMobile !== undefined) {
      setIsReady(true);
      
      // Sample conversations
      setConversations([
        {
          id: 1,
          name: "TechGadgets Store",
          lastMessage: "Your order #45782 has been shipped!",
          timestamp: "09:45 AM",
          unread: 2,
          online: true,
          avatar: "https://picsum.photos/id/1/100",
          isVendor: true,
          isVerified: true
        },
        {
          id: 2,
          name: "Fashion Outlet",
          lastMessage: "Thank you for your recent purchase",
          timestamp: "Yesterday",
          unread: 0,
          online: false,
          avatar: "https://picsum.photos/id/20/100",
          isVendor: true
        },
        {
          id: 3,
          name: "Customer Support",
          lastMessage: "How can we assist you today?",
          timestamp: "Yesterday",
          unread: 0,
          online: true,
          avatar: "https://picsum.photos/id/30/100"
        },
        {
          id: 4,
          name: "Beauty Products",
          lastMessage: "New arrivals in stock now!",
          timestamp: "Mon",
          unread: 1,
          online: false,
          avatar: "https://picsum.photos/id/40/100",
          isVendor: true
        },
        {
          id: 5,
          name: "Home Decor Store",
          lastMessage: "Check out our summer sale collection",
          timestamp: "Sun",
          unread: 0,
          online: true,
          avatar: "https://picsum.photos/id/50/100",
          isVendor: true,
          isVerified: true
        }
      ]);
    }
  }, [isMobile]);

  // Load messages when a conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      // Sample messages for the selected conversation
      setMessages([
        {
          id: 1,
          sender: selectedConversation.name,
          content: "Hello there! How can I help you today?",
          timestamp: "09:30 AM",
          isOwn: false,
          read: true,
          avatar: selectedConversation.avatar
        },
        {
          id: 2,
          sender: "You",
          content: "I have a question about my recent order #45782",
          timestamp: "09:32 AM",
          isOwn: true,
          read: true,
          avatar: "https://picsum.photos/id/100/100"
        },
        {
          id: 3,
          sender: selectedConversation.name,
          content: "Of course, I'd be happy to help with that. Let me check the status for you.",
          timestamp: "09:33 AM",
          isOwn: false,
          read: true,
          avatar: selectedConversation.avatar
        },
        {
          id: 4,
          sender: selectedConversation.name,
          content: "I can see that your order has been processed and is now being prepared for shipment. It should be dispatched within the next 24 hours.",
          timestamp: "09:34 AM",
          isOwn: false,
          read: true,
          avatar: selectedConversation.avatar
        },
        {
          id: 5,
          sender: "You",
          content: "Great! When can I expect delivery?",
          timestamp: "09:36 AM",
          isOwn: true,
          read: true,
          avatar: "https://picsum.photos/id/100/100"
        },
        {
          id: 6,
          sender: selectedConversation.name,
          content: "Based on your location, delivery should take 3-5 business days after dispatch. You'll receive a tracking number via email once it's on the way.",
          timestamp: "09:38 AM",
          isOwn: false,
          read: true,
          avatar: selectedConversation.avatar,
          reactions: [{ type: "👍", count: 1 }]
        },
        {
          id: 7,
          sender: "You",
          content: "Perfect, thank you for your help!",
          timestamp: "09:40 AM",
          isOwn: true,
          read: true,
          avatar: "https://picsum.photos/id/100/100"
        },
        {
          id: 8,
          sender: selectedConversation.name,
          content: "You're welcome! Is there anything else you would like to know?",
          timestamp: "09:41 AM",
          isOwn: false,
          read: true,
          avatar: selectedConversation.avatar
        },
        {
          id: 9,
          sender: selectedConversation.name,
          content: "By the way, your order #45782 has been shipped! You should receive the tracking information shortly.",
          timestamp: "09:45 AM",
          isOwn: false,
          read: false,
          avatar: selectedConversation.avatar
        },
        {
          id: 10,
          sender: selectedConversation.name,
          content: "We've included a small gift as a token of appreciation for being our valued customer.",
          timestamp: "09:45 AM",
          isOwn: false,
          read: false,
          avatar: selectedConversation.avatar
        }
      ]);
      
      // Scroll to bottom when messages change
      scrollToBottom();
    }
  }, [selectedConversation]);

  // Auto scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Hide bottom nav when conversation is selected
  useEffect(() => {
    // Get the navigation element
    const bottomNav = document.querySelector('[class*="fixed bottom-0 left-0 right-0 bg-white"]');
    
    if (bottomNav) {
      if (selectedConversation && isMobile) {
        // Hide the navigation when conversation is selected on mobile
        bottomNav.classList.add('hidden');
        setNavbarHidden(true);
      } else {
        // Show the navigation otherwise
        bottomNav.classList.remove('hidden');
        setNavbarHidden(false);
      }
    }

    // Clean up when component unmounts
    return () => {
      if (bottomNav) {
        bottomNav.classList.remove('hidden');
      }
    };
  }, [selectedConversation, isMobile]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      sender: "You",
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      read: false,
      avatar: "https://picsum.photos/id/100/100"
    };

    setMessages([...messages, newMessage]);
    setMessage("");

    // Simulate reply after a short delay
    setTimeout(() => {
      const replyMessage: Message = {
        id: messages.length + 2,
        sender: selectedConversation?.name || "Unknown",
        content: "Thank you for your message. Our team will get back to you shortly.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: false,
        read: false,
        avatar: selectedConversation?.avatar || "https://picsum.photos/id/200/100"
      };
      setMessages(prevMessages => [...prevMessages, replyMessage]);
    }, 2000);
  };

  const handleMessageKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = conversationsFilter 
    ? conversations.filter(conv => 
        conv.name.toLowerCase().includes(conversationsFilter.toLowerCase()) || 
        conv.lastMessage.toLowerCase().includes(conversationsFilter.toLowerCase())
      )
    : conversations;

  if (!isReady) {
    return <div>Loading...</div>;
  }

  const handleBackButton = () => {
    setSelectedConversation(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 overscroll-none overflow-x-hidden">
      {/* Main content */}
      <div className={`${selectedConversation ? 'pt-0' : 'pt-0'} ${navbarHidden ? 'pb-0' : 'pb-16'} flex flex-1 overflow-hidden`}>
        <div className={`flex ${navbarHidden ? 'h-screen' : 'h-[calc(100vh-56px)]'} w-full`}>
          {/* Conversations list - always visible on desktop, or visible on mobile when no conversation is selected */}
          {(!isMobile || !selectedConversation) && (
            <div className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col">
              {/* Conversations header */}
              <div className="p-3 border-b border-gray-100">
                <h2 className="text-lg font-semibold mb-2">Messages</h2>
                <div className="relative">
                  <Input 
                    type="text" 
                    placeholder="Search conversations..." 
                    className="pl-8 pr-4 py-1 text-sm"
                    value={conversationsFilter}
                    onChange={(e) => setConversationsFilter(e.target.value)}
                  />
                  <Search className="absolute left-2.5 top-[9px] h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              {/* Conversations list */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No conversations found
                  </div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <div 
                      key={conversation.id}
                      className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        selectedConversation?.id === conversation.id ? 'bg-gray-50' : ''
                      }`}
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <div className="flex items-start">
                        <div className="relative flex-shrink-0">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={conversation.avatar} alt={conversation.name} />
                            <AvatarFallback>{conversation.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          {conversation.online && (
                            <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></span>
                          )}
                        </div>
                        <div className="ml-3 flex-1 overflow-hidden">
                          <div className="flex justify-between items-baseline">
                            <div className="flex items-center">
                              <h3 className={`font-medium text-sm truncate ${conversation.unread > 0 ? 'text-black' : 'text-gray-700'}`}>
                                {conversation.name}
                              </h3>
                              {conversation.isVendor && (
                                <Badge variant="outline" className="ml-1 py-0 px-1 text-[8px] h-3.5 border-orange-500 text-orange-500">
                                  Store
                                </Badge>
                              )}
                              {conversation.isVerified && (
                                <Badge className="ml-1 py-0 px-1 text-[8px] h-3.5 bg-blue-500">
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                          </div>
                          <p className={`text-xs truncate mt-1 ${conversation.unread > 0 ? 'font-medium text-black' : 'text-gray-500'}`}>
                            {conversation.lastMessage}
                          </p>
                        </div>
                      </div>
                      {conversation.unread > 0 && (
                        <div className="flex justify-end mt-1">
                          <span className="bg-red-500 text-white text-[10px] rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                            {conversation.unread}
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          
          {/* Chat area - visible only when a conversation is selected on mobile, or always visible on desktop */}
          {(selectedConversation || !isMobile) && (
            <div className={`flex-1 flex flex-col ${!selectedConversation && !isMobile ? 'items-center justify-center bg-gray-50' : 'bg-gray-100'}`}>
              {!selectedConversation && !isMobile ? (
                <div className="text-center p-6">
                  <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Your Messages</h3>
                  <p className="text-gray-500 text-sm max-w-sm">
                    Select a conversation from the list to view messages
                  </p>
                </div>
              ) : (
                <>
                  {/* Chat header */}
                  <div className="bg-white p-3 border-b flex items-center">
                    {isMobile && (
                      <Button variant="ghost" size="icon" onClick={handleBackButton} className="mr-1">
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                    )}
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedConversation?.avatar} alt={selectedConversation?.name} />
                      <AvatarFallback>{selectedConversation?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center">
                        <h3 className="font-medium text-sm">{selectedConversation?.name}</h3>
                        {selectedConversation?.isVendor && (
                          <Badge variant="outline" className="ml-1 py-0 px-1 text-[8px] h-3.5 border-orange-500 text-orange-500">
                            Store
                          </Badge>
                        )}
                        {selectedConversation?.isVerified && (
                          <Badge className="ml-1 py-0 px-1 text-[8px] h-3.5 bg-blue-500">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {selectedConversation?.online ? 'Online' : 'Offline'}
                      </p>
                    </div>
                    <div className="flex">
                      <Button variant="ghost" size="icon" className="text-gray-500">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-gray-500">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-gray-500">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-3">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex ${msg.isOwn ? 'flex-row-reverse' : 'flex-row'} max-w-[80%]`}>
                          {!msg.isOwn && (
                            <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                              <AvatarImage src={msg.avatar} alt={msg.sender} />
                              <AvatarFallback>{msg.sender.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                          )}
                          <div className={`mx-2 ${msg.isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                            <div 
                              className={`rounded-lg px-3 py-2 ${
                                msg.isOwn 
                                  ? 'bg-blue-500 text-white rounded-br-none'
                                  : 'bg-white text-gray-800 rounded-tl-none'
                              }`}
                            >
                              {msg.content}
                            </div>
                            <div className="flex items-center mt-1">
                              <span className="text-[10px] text-gray-500">{msg.timestamp}</span>
                              {msg.isOwn && (
                                <span className="ml-1">
                                  {msg.read ? 
                                    <CheckCheck className="h-3 w-3 text-blue-500" /> : 
                                    <Check className="h-3 w-3 text-gray-400" />
                                  }
                                </span>
                              )}
                            </div>
                            {msg.reactions && msg.reactions.length > 0 && (
                              <div className="flex mt-1">
                                {msg.reactions.map((reaction, idx) => (
                                  <div key={idx} className="bg-white rounded-full px-1 py-0.5 text-xs flex items-center shadow-sm">
                                    <span>{reaction.type}</span>
                                    <span className="ml-0.5 text-[8px] text-gray-500">{reaction.count}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  
                  {/* Message input */}
                  <div className="bg-white p-3 border-t">
                    <div className="flex items-center">
                      <Button variant="ghost" size="icon" className="rounded-full text-gray-500">
                        <Smile className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="rounded-full text-gray-500">
                        <ImageIcon className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="rounded-full text-gray-500">
                        <Mic className="h-5 w-5" />
                      </Button>
                      <div className="flex-1 mx-2">
                        <Input 
                          type="text" 
                          placeholder="Type a message..." 
                          className="bg-gray-100 border-0"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={handleMessageKeyDown}
                        />
                      </div>
                      <Button 
                        onClick={handleSendMessage} 
                        disabled={!message.trim()}
                        className="rounded-full bg-blue-500 hover:bg-blue-600"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// A simple message icon for the empty state
function MessageIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}