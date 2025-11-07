import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Download, 
  Save, 
  Printer, 
  Upload,
  Eye,
  EyeOff
} from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ResumeData {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  skills: string[];
  projects: Array<{
    name: string;
    description: string;
  }>;
}

interface Customization {
  colorTheme: string;
  font: string;
  lineSpacing: string;
  sectionSpacing: string;
}

const ResumeEditor = () => {
  const { templateId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userEmail = searchParams.get('email') || '';

  const [showPreview, setShowPreview] = useState(true);
  const [resumeData, setResumeData] = useState<ResumeData>({
    name: '',
    email: userEmail,
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    summary: '',
    experience: [{ title: '', company: '', duration: '', description: '' }],
    education: [{ degree: '', institution: '', year: '' }],
    skills: [],
    projects: [{ name: '', description: '' }]
  });

  const [customization, setCustomization] = useState<Customization>({
    colorTheme: 'navy',
    font: 'Inter',
    lineSpacing: 'normal',
    sectionSpacing: 'medium'
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userEmail || !templateId) {
      toast.error('Missing email or template ID');
      navigate('/resume-lab');
      return;
    }
    loadSavedResume();
  }, [templateId, userEmail]);

  const loadSavedResume = async () => {
    try {
      const { data } = await supabase
        .from('resume_profiles')
        .select('resume_data, customization')
        .eq('template_id', templateId)
        .eq('user_email', userEmail)
        .single();

      if (data) {
        if (data.resume_data) setResumeData(data.resume_data as unknown as ResumeData);
        if (data.customization) setCustomization(data.customization as unknown as Customization);
      }
    } catch (error) {
      console.error('Error loading resume:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('resume_profiles')
        .upsert({
          user_email: userEmail,
          template_id: templateId!,
          resume_data: resumeData as any,
          customization: customization as any
        });

      if (error) throw error;
      toast.success('Resume saved successfully!');
    } catch (error) {
      console.error('Error saving resume:', error);
      toast.error('Failed to save resume');
    } finally {
      setSaving(false);
    }
  };

  const handleExportPDF = () => {
    toast.info('PDF export feature coming soon!');
    // TODO: Implement PDF generation using pdf-lib or jsPDF
  };

  const handleOrderPrint = () => {
    toast.info('Redirecting to Ellio Prints...');
    navigate('/ellio-prints');
  };

  const colorThemes = {
    navy: { primary: '#1e3a8a', secondary: '#3b82f6' },
    black: { primary: '#000000', secondary: '#374151' },
    teal: { primary: '#0f766e', secondary: '#14b8a6' },
    royal: { primary: '#4338ca', secondary: '#6366f1' },
    charcoal: { primary: '#1f2937', secondary: '#4b5563' },
    sand: { primary: '#92400e', secondary: '#d97706' }
  };

  const getThemeColor = () => {
    return colorThemes[customization.colorTheme as keyof typeof colorThemes] || colorThemes.navy;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Editor Toolbar */}
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/resume-lab')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Templates
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              className="gap-2"
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPreview ? 'Hide' : 'Show'} Preview
            </Button>
            
            <Button
              variant="outline"
              onClick={handleSave}
              disabled={saving}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save'}
            </Button>

            <Button
              variant="outline"
              onClick={handleExportPDF}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </Button>

            <Button
              onClick={handleOrderPrint}
              className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600"
            >
              <Printer className="w-4 h-4" />
              Order Print
            </Button>
          </div>
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-grow">
        <div className="max-w-7xl mx-auto p-4">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Editor Panel */}
            <div className="space-y-6">
              <Card className="p-6">
                <Tabs defaultValue="content">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="customize">Customize</TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="space-y-6 mt-6">
                    {/* Personal Info */}
                    <div className="space-y-4">
                      <h3 className="font-bold text-lg">Personal Information</h3>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label>Full Name *</Label>
                          <Input
                            value={resumeData.name}
                            onChange={(e) => setResumeData({ ...resumeData, name: e.target.value })}
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <Label>Email *</Label>
                          <Input
                            value={resumeData.email}
                            onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
                            placeholder="john@example.com"
                          />
                        </div>
                        <div>
                          <Label>Phone</Label>
                          <Input
                            value={resumeData.phone}
                            onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })}
                            placeholder="+91 98765 43210"
                          />
                        </div>
                        <div>
                          <Label>Location</Label>
                          <Input
                            value={resumeData.location}
                            onChange={(e) => setResumeData({ ...resumeData, location: e.target.value })}
                            placeholder="Mumbai, India"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Professional Summary</Label>
                        <Textarea
                          value={resumeData.summary}
                          onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                          placeholder="Brief overview of your experience and skills..."
                          rows={4}
                        />
                      </div>
                    </div>

                    {/* Experience */}
                    <div className="space-y-4">
                      <h3 className="font-bold text-lg">Experience</h3>
                      {resumeData.experience.map((exp, index) => (
                        <Card key={index} className="p-4 bg-gray-50">
                          <div className="space-y-3">
                            <Input
                              value={exp.title}
                              onChange={(e) => {
                                const newExp = [...resumeData.experience];
                                newExp[index].title = e.target.value;
                                setResumeData({ ...resumeData, experience: newExp });
                              }}
                              placeholder="Job Title"
                            />
                            <div className="grid md:grid-cols-2 gap-3">
                              <Input
                                value={exp.company}
                                onChange={(e) => {
                                  const newExp = [...resumeData.experience];
                                  newExp[index].company = e.target.value;
                                  setResumeData({ ...resumeData, experience: newExp });
                                }}
                                placeholder="Company Name"
                              />
                              <Input
                                value={exp.duration}
                                onChange={(e) => {
                                  const newExp = [...resumeData.experience];
                                  newExp[index].duration = e.target.value;
                                  setResumeData({ ...resumeData, experience: newExp });
                                }}
                                placeholder="Jan 2020 - Present"
                              />
                            </div>
                            <Textarea
                              value={exp.description}
                              onChange={(e) => {
                                const newExp = [...resumeData.experience];
                                newExp[index].description = e.target.value;
                                setResumeData({ ...resumeData, experience: newExp });
                              }}
                              placeholder="Key responsibilities and achievements..."
                              rows={3}
                            />
                          </div>
                        </Card>
                      ))}
                      <Button
                        variant="outline"
                        onClick={() => setResumeData({
                          ...resumeData,
                          experience: [...resumeData.experience, { title: '', company: '', duration: '', description: '' }]
                        })}
                        className="w-full"
                      >
                        + Add Experience
                      </Button>
                    </div>

                    {/* Education */}
                    <div className="space-y-4">
                      <h3 className="font-bold text-lg">Education</h3>
                      {resumeData.education.map((edu, index) => (
                        <Card key={index} className="p-4 bg-gray-50">
                          <div className="space-y-3">
                            <Input
                              value={edu.degree}
                              onChange={(e) => {
                                const newEdu = [...resumeData.education];
                                newEdu[index].degree = e.target.value;
                                setResumeData({ ...resumeData, education: newEdu });
                              }}
                              placeholder="Degree"
                            />
                            <div className="grid md:grid-cols-2 gap-3">
                              <Input
                                value={edu.institution}
                                onChange={(e) => {
                                  const newEdu = [...resumeData.education];
                                  newEdu[index].institution = e.target.value;
                                  setResumeData({ ...resumeData, education: newEdu });
                                }}
                                placeholder="Institution"
                              />
                              <Input
                                value={edu.year}
                                onChange={(e) => {
                                  const newEdu = [...resumeData.education];
                                  newEdu[index].year = e.target.value;
                                  setResumeData({ ...resumeData, education: newEdu });
                                }}
                                placeholder="Year"
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                      <Button
                        variant="outline"
                        onClick={() => setResumeData({
                          ...resumeData,
                          education: [...resumeData.education, { degree: '', institution: '', year: '' }]
                        })}
                        className="w-full"
                      >
                        + Add Education
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="customize" className="space-y-6 mt-6">
                    <div className="space-y-4">
                      <h3 className="font-bold text-lg">Customization</h3>

                      <div>
                        <Label>Color Theme</Label>
                        <Select
                          value={customization.colorTheme}
                          onValueChange={(value) => setCustomization({ ...customization, colorTheme: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="navy">Navy Blue</SelectItem>
                            <SelectItem value="black">Classic Black</SelectItem>
                            <SelectItem value="teal">Teal</SelectItem>
                            <SelectItem value="royal">Royal Purple</SelectItem>
                            <SelectItem value="charcoal">Charcoal</SelectItem>
                            <SelectItem value="sand">Sand</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Font Family</Label>
                        <Select
                          value={customization.font}
                          onValueChange={(value) => setCustomization({ ...customization, font: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Inter">Inter (Modern)</SelectItem>
                            <SelectItem value="Poppins">Poppins (Friendly)</SelectItem>
                            <SelectItem value="Garamond">Garamond (Classic)</SelectItem>
                            <SelectItem value="Source Sans">Source Sans (Clean)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Profile Photo (Optional)</Label>
                        <div className="mt-2">
                          <Button variant="outline" className="w-full gap-2">
                            <Upload className="w-4 h-4" />
                            Upload Photo
                          </Button>
                          <p className="text-xs text-gray-500 mt-1">
                            Recommended: Square image, at least 300x300px
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>

            {/* Live Preview */}
            {showPreview && (
              <div className="lg:sticky lg:top-24 h-fit">
                <Card className="p-8 bg-white shadow-lg" style={{ aspectRatio: '1/1.414' }}>
                  <div className="space-y-6" style={{ fontFamily: customization.font }}>
                    {/* Header */}
                    <div className="text-center pb-4 border-b-2" style={{ borderColor: getThemeColor().primary }}>
                      <h1 className="text-3xl font-bold mb-2" style={{ color: getThemeColor().primary }}>
                        {resumeData.name || 'Your Name'}
                      </h1>
                      <div className="text-sm text-gray-600 space-y-1">
                        {resumeData.email && <p>{resumeData.email}</p>}
                        {resumeData.phone && <p>{resumeData.phone}</p>}
                        {resumeData.location && <p>{resumeData.location}</p>}
                      </div>
                    </div>

                    {/* Summary */}
                    {resumeData.summary && (
                      <div>
                        <h2 className="text-lg font-bold mb-2" style={{ color: getThemeColor().primary }}>
                          Professional Summary
                        </h2>
                        <p className="text-sm text-gray-700 leading-relaxed">{resumeData.summary}</p>
                      </div>
                    )}

                    {/* Experience */}
                    {resumeData.experience.some(exp => exp.title) && (
                      <div>
                        <h2 className="text-lg font-bold mb-3" style={{ color: getThemeColor().primary }}>
                          Experience
                        </h2>
                        <div className="space-y-3">
                          {resumeData.experience.filter(exp => exp.title).map((exp, index) => (
                            <div key={index}>
                              <h3 className="font-semibold text-sm">{exp.title}</h3>
                              <p className="text-xs text-gray-600">{exp.company} • {exp.duration}</p>
                              {exp.description && (
                                <p className="text-xs text-gray-700 mt-1">{exp.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Education */}
                    {resumeData.education.some(edu => edu.degree) && (
                      <div>
                        <h2 className="text-lg font-bold mb-3" style={{ color: getThemeColor().primary }}>
                          Education
                        </h2>
                        <div className="space-y-2">
                          {resumeData.education.filter(edu => edu.degree).map((edu, index) => (
                            <div key={index}>
                              <h3 className="font-semibold text-sm">{edu.degree}</h3>
                              <p className="text-xs text-gray-600">{edu.institution} • {edu.year}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
                <p className="text-xs text-center text-gray-500 mt-2">
                  Live Preview • A4 Size (210mm × 297mm)
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;
