import React, { useState, useMemo } from 'react';
import { Search, MessageCircle, Heart, ChevronDown, Sparkles } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

// Sample Q&A data
const sampleQAItems = [
  {
    id: 1,
    question: "Does this product work with iPhone 15 Pro Max?",
    answer: "Yes, this product is fully compatible with iPhone 15 Pro Max and all recent iPhone models. I've been using it with my 15 Pro Max for 2 months with no issues.",
    askedBy: "Alex Thompson",
    answeredBy: "Seller",
    askDate: "2024-03-10",
    answerDate: "2024-03-11",
    helpful: 24,
    questionLikes: 8
  },
  {
    id: 2,
    question: "What's the battery life like?",
    answer: "Battery life is excellent! I get about 8-10 hours of continuous use, and standby time is around 2-3 days depending on usage.",
    askedBy: "Mike Chen",
    answeredBy: "Seller",
    askDate: "2024-03-08",
    answerDate: "2024-03-09",
    helpful: 18,
    questionLikes: 12
  },
  {
    id: 3,
    question: "Is it waterproof or just water-resistant?",
    askedBy: "Emma Wilson",
    askDate: "2024-03-15",
    answer: null,
    helpful: 0,
    questionLikes: 3
  }
];


// Main Questions & Answers Component
const QuestionsAnswers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { id: productId } = useParams();

  // Filter Q&A items based on search
  const filteredQAItems = useMemo(() => {
    if (!searchQuery.trim()) return sampleQAItems;
    return sampleQAItems.filter(item =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.answer && item.answer.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  const qaItems = filteredQAItems;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const handleAskQuestionClick = () => {
    navigate(`/product/${productId}/ask-question`);
  };

  // Render Main Q&A View
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Q&As</h3>
        <div className="flex gap-2">
          <button 
            className="bg-blue-100 hover:bg-blue-200 transition-colors px-4 py-2 rounded-full text-blue-600 font-medium text-sm flex items-center gap-1"
            onClick={handleAskQuestionClick}
          >
            <Sparkles className="w-3 h-3" />
            Ask AI
          </button>
          <button 
            className="bg-gray-100 hover:bg-gray-200 transition-colors px-4 py-2 rounded-full text-gray-600 font-medium text-sm"
            onClick={() => alert('This would open a regular question form')}
          >
            Ask Question
          </button>
        </div>
      </div>

      {/* All Questions */}
      <div className="space-y-4">
        {qaItems.map((item) => (
          <div key={item.id} className="border-b pb-4">
            <div className="space-y-3">
              {/* Question */}
              <div>
                <div className="flex items-start gap-2">
                  <MessageCircle className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <p className="font-medium text-gray-900 flex-1 pr-2">
                        {item.question}
                        {!item.answer && (
                          <span className="ml-2 text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full font-normal">
                            Awaiting seller response
                          </span>
                        )}
                      </p>
                      <button className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 transition-colors px-2 py-1 rounded-full text-gray-600 flex-shrink-0">
                        <Heart className="w-3 h-3" />
                        <span className="text-xs font-medium">{item.questionLikes}</span>
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 whitespace-nowrap">
                      Asked by {item.askedBy} • {formatDate(item.askDate)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Answer */}
              {item.answer && (
                <div className="ml-6 bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-700 text-sm">{item.answer}</p>
                  <div className="text-xs text-gray-500 mt-2 whitespace-nowrap">
                    Answered by {item.answeredBy} • {item.answerDate && formatDate(item.answerDate)}
                  </div>
                  <div className="flex items-center justify-start mt-2">
                    <button className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 transition-colors px-3 py-1.5 rounded-full text-gray-600">
                      <Heart className="w-3 h-3" />
                      <span className="text-xs font-medium">{item.helpful}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <button className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors py-3 rounded-full w-full text-gray-600 font-medium">
        <span>View more questions</span>
        <ChevronDown className="w-4 h-4" />
      </button>
    </div>
  );
};

export default QuestionsAnswers;