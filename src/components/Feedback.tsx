
import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState({
    name: '',
    email: '',
    service: '',
    comments: ''
  });
  const { toast } = useToast();

  const questions = [
    "How satisfied are you with our printing quality?",
    "How would you rate our delivery service?",
    "How likely are you to recommend us to others?",
    "How was your overall experience with PrintReady?"
  ];

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please provide a star rating",
        variant: "destructive"
      });
      return;
    }

    const feedbackData = {
      ...feedback,
      rating,
      timestamp: new Date().toISOString(),
      id: Date.now().toString()
    };

    const existingFeedback = JSON.parse(localStorage.getItem('feedback') || '[]');
    localStorage.setItem('feedback', JSON.stringify([...existingFeedback, feedbackData]));

    toast({
      title: "Thank you for your feedback!",
      description: "Your review helps us improve our services.",
    });

    // Reset form
    setRating(0);
    setFeedback({ name: '', email: '', service: '', comments: '' });
  };

  return (
    <section className="py-16 px-4 bg-blue-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            We Value Your Feedback
          </h2>
          <p className="text-xl text-gray-600">
            Help us serve you better by sharing your experience
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Rate Our Service</CardTitle>
            <CardDescription>
              Your feedback helps us improve and serve you better
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitFeedback} className="space-y-6">
              <div className="text-center">
                <p className="text-lg font-medium mb-4">Overall Rating</p>
                <div className="flex justify-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="text-3xl transition-colors"
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                    >
                      <Star 
                        className={`w-8 h-8 ${
                          star <= (hoveredRating || rating) 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-300'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="feedback-name">Name</Label>
                  <Input
                    id="feedback-name"
                    value={feedback.name}
                    onChange={(e) => setFeedback(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="feedback-email">Email</Label>
                  <Input
                    id="feedback-email"
                    type="email"
                    value={feedback.email}
                    onChange={(e) => setFeedback(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="feedback-service">Service Used</Label>
                <Input
                  id="feedback-service"
                  value={feedback.service}
                  onChange={(e) => setFeedback(prev => ({ ...prev, service: e.target.value }))}
                  placeholder="e.g., Document printing, Color printing"
                />
              </div>

              <div>
                <Label htmlFor="feedback-comments">Comments</Label>
                <Textarea
                  id="feedback-comments"
                  value={feedback.comments}
                  onChange={(e) => setFeedback(prev => ({ ...prev, comments: e.target.value }))}
                  placeholder="Tell us about your experience..."
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full">
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
