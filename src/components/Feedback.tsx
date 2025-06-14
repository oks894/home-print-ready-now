
import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const questions = [
    "How was your overall experience?",
    "Was the pickup/delivery on time?", 
    "How would you rate the print quality?",
    "Would you recommend us to others?"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Please provide a rating",
        description: "Select a star rating before submitting",
        variant: "destructive"
      });
      return;
    }

    const feedbackData = {
      rating,
      feedback,
      timestamp: new Date().toISOString(),
      id: Date.now().toString()
    };

    const existingFeedback = JSON.parse(localStorage.getItem('customerFeedback') || '[]');
    localStorage.setItem('customerFeedback', JSON.stringify([...existingFeedback, feedbackData]));

    setIsSubmitted(true);
    toast({
      title: "Thank you for your feedback!",
      description: "Your review helps us improve our service",
    });

    setTimeout(() => {
      setRating(0);
      setFeedback('');
      setIsSubmitted(false);
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <section className="py-8 sm:py-12 px-4 bg-green-50">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="border-green-200">
            <CardContent className="p-6 sm:p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-green-600 fill-current" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-green-600 mb-2">Thank You!</h3>
              <p className="text-gray-600">Your feedback has been submitted successfully.</p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-12 px-4 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">
              Share Your Experience
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Help us improve by sharing your feedback
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="text-center">
                <p className="text-sm sm:text-base font-medium text-gray-700 mb-3">Rate your experience:</p>
                <div className="flex justify-center gap-1 sm:gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded p-1"
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                    >
                      <Star
                        className={`w-7 h-7 sm:w-8 sm:h-8 ${
                          star <= (hoveredRating || rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-4 sm:p-6 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Quick Questions:</h4>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                  {questions.map((question, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      {question}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <label htmlFor="feedback" className="block text-sm font-medium text-gray-700">
                  Additional Comments (Optional)
                </label>
                <Textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us about your experience, suggestions for improvement, or any issues you faced..."
                  rows={4}
                  className="text-base resize-none"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 text-base font-semibold"
                disabled={rating === 0}
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Feedback
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Feedback;
