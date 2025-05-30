'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  MessageSquare,
  Mail,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  Upload,
  X,
  FileText,
  Image,
  Paperclip
} from 'lucide-react';
import { getToken } from '@/lib/services/auth';

interface ContactFormData {
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
}

interface AttachedFile {
  file: File;
  id: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    subject: '',
    message: '',
    priority: 'medium'
  });
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        id: Math.random().toString(36).substr(2, 9)
      }));
      setAttachedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (fileId: string) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const token = getToken();
      if (!token) {
        throw new Error('You must be logged in to send a message');
      }

      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('subject', formData.subject);
      formDataToSend.append('message', formData.message);
      formDataToSend.append('priority', formData.priority);

      // Add files to form data
      attachedFiles.forEach(({ file }) => {
        formDataToSend.append('attachments', file);
      });

      const response = await fetch('http://localhost:8000/contact/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to send message');
      }

      const result = await response.json();
      setSuccessMessage(result.message || 'Your message has been sent successfully!');
      
      // Reset form
      setFormData({
        subject: '',
        message: '',
        priority: 'medium'
      });
      setAttachedFiles([]);

    } catch (error) {
      console.error('Error sending contact message:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'admin@movomint.com',
      description: 'Direct email for urgent matters'
    },
    {
      icon: Clock,
      label: 'Response Time',
      value: '24-48 hours',
      description: 'Typical response time for inquiries'
    },
    {
      icon: MessageSquare,
      label: 'Support',
      value: 'Dashboard Contact Form',
      description: 'Preferred method with attachments'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                Contact Us
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Get in touch with our team for support and inquiries
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-none border border-slate-200 dark:border-slate-700">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700">
                <CardTitle className="text-xl text-slate-900 dark:text-white">Send Message</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400 mt-1">
                  Fill out the form below and we'll get back to you as soon as possible
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {successMessage && (
                  <div className="p-4 mb-6 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Message Sent Successfully!</p>
                      <p className="text-sm">{successMessage}</p>
                    </div>
                  </div>
                )}

                {errorMessage && (
                  <div className="p-4 mb-6 text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Error Sending Message</p>
                      <p className="text-sm">{errorMessage}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="priority" className="text-slate-700 dark:text-slate-300 font-medium">
                        Priority Level
                      </Label>
                      <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        className="w-full h-11 px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 dark:text-white"
                        required
                      >
                        <option value="low">Low - General inquiry</option>
                        <option value="medium">Medium - Standard support</option>
                        <option value="high">High - Urgent issue</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-slate-700 dark:text-slate-300 font-medium">
                        Subject
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Brief description of your inquiry"
                        className="bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-primary h-11"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-slate-700 dark:text-slate-300 font-medium">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Please provide details about your inquiry or issue..."
                      rows={6}
                      className="bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-primary resize-none"
                      required
                    />
                  </div>

                  {/* File Upload Section */}
                  <div className="space-y-2">
                    <Label className="text-slate-700 dark:text-slate-300 font-medium">
                      Attachments (Optional)
                    </Label>
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center hover:border-primary transition-colors">
                      <input
                        type="file"
                        id="file-upload"
                        multiple
                        accept="image/*,.pdf,.doc,.docx,.txt"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                          <Upload className="h-6 w-6 text-slate-500" />
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          <span className="font-medium text-primary">Click to upload</span> or drag and drop
                        </div>
                        <div className="text-xs text-slate-500">
                          Images, PDFs, Documents (Max 10MB each)
                        </div>
                      </label>
                    </div>

                    {/* Attached Files List */}
                    {attachedFiles.length > 0 && (
                      <div className="space-y-2 mt-4">
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Attached Files ({attachedFiles.length})
                        </div>
                        <div className="space-y-2">
                          {attachedFiles.map(({ file, id }) => (
                            <div
                              key={id}
                              className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                            >
                              <div className="flex items-center gap-3">
                                <div className="text-slate-500">
                                  {getFileIcon(file)}
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-slate-900 dark:text-white">
                                    {file.name}
                                  </div>
                                  <div className="text-xs text-slate-500">
                                    {formatFileSize(file.size)}
                                  </div>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(id)}
                                className="text-slate-500 hover:text-red-500"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-full">
                        <Paperclip className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                          Enhanced Support
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                          You can now attach screenshots, documents, or other files to help us better understand and resolve your inquiry.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={isSubmitting || !formData.subject || !formData.message}
                      className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 h-11 px-6 transition-all duration-200"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white mr-2"></div>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Details */}
            <Card className="shadow-none border border-slate-200 dark:border-slate-700">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700">
                <CardTitle className="text-xl text-slate-900 dark:text-white">Contact Information</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400 mt-1">
                  Multiple ways to reach our support team
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {contactInfo.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                      <div className="bg-white dark:bg-slate-700 p-2 rounded-lg border border-slate-200 dark:border-slate-600">
                        <item.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-900 dark:text-white">
                          {item.label}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {item.value}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="shadow-none border border-slate-200 dark:border-slate-700">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700">
                <CardTitle className="text-xl text-slate-900 dark:text-white">Support Tips</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400 mt-1">
                  Get faster responses with these tips
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2"></div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Include screenshots or error messages when reporting issues
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2"></div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Describe the issue in detail with steps to reproduce
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2"></div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Set appropriate priority level for faster routing
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2"></div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Attach relevant files like documents or images
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 