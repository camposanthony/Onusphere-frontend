// src/app/(auth)/register/page.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Truck } from 'lucide-react';
import { signup, saveToken } from '@/lib/services/auth';
import { useAuth } from '@/lib/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { setAuthenticated } = useAuth();
  const [registrationType, setRegistrationType] = useState<'business' | 'member'>('business');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company_name: '',
    company_email: '',
    company_code: '',
    phone: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }

    // Validate email domains match for business registration
    if (registrationType === 'business') {
      const userEmailDomain = formData.email.split('@')[1];
      const companyEmailDomain = formData.company_email.split('@')[1];
      if (userEmailDomain !== companyEmailDomain) {
        setError("Your email domain must match your company email domain");
        setIsLoading(false);
        return;
      }
    }
    
    try {
      // Call signup API with registration type
      const response = await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        company_name: registrationType === 'business' ? formData.company_name : undefined,
        company_email: registrationType === 'business' ? formData.company_email : undefined,
        company_code: registrationType === 'member' ? formData.company_code : undefined,
        phone: formData.phone,
        registration_type: registrationType
      });
      
      // Save the token
      saveToken(response.access_token);
      
      // Update auth state
      setAuthenticated(true);
      
      // On success, redirect to the main dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : 'Registration failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex flex-col items-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Image src="/movomintlogo.png" alt="Movomint Logo" width={48} height={48} />
            </div>
            <span className="mt-2 text-2xl font-bold">movomint</span>
          </div>
          <CardDescription>
            Join the movomint platform to access logistics tools
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <Tabs defaultValue="business" className="w-full" onValueChange={(value) => setRegistrationType(value as 'business' | 'member')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="business">Create Business Account</TabsTrigger>
                <TabsTrigger value="member">Join Existing Business</TabsTrigger>
              </TabsList>
              <TabsContent value="business" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company_name">Company Name</Label>
                  <Input 
                    id="company_name" 
                    placeholder="Your Company Inc." 
                    value={formData.company_name}
                    onChange={handleChange}
                    required={registrationType === 'business'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company_email">Business Email</Label>
                  <Input 
                    id="company_email" 
                    type="email"
                    placeholder="business@company.com" 
                    value={formData.company_email}
                    onChange={handleChange}
                    required={registrationType === 'business'}
                  />
                </div>
              </TabsContent>
              <TabsContent value="member" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company_code">Company Code</Label>
                  <Input 
                    id="company_code" 
                    placeholder="Enter your company's invitation code" 
                    value={formData.company_code}
                    onChange={handleChange}
                    required={registrationType === 'member'}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                placeholder="John Doe" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="your@email.com" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Create a strong password" 
                value={formData.password}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                placeholder="Confirm your password" 
                value={formData.confirmPassword}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                placeholder="+1 (555) 123-4567" 
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            
            <div className="flex items-center space-x-2 mb-4">
              <input 
                type="checkbox" 
                id="terms" 
                className="rounded border-gray-300 text-primary focus:ring-primary" 
                required
              />
              <Label htmlFor="terms" className="text-sm cursor-pointer">
                I agree to the{' '}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating account...' : registrationType === 'business' ? 'Create Business Account' : 'Join Business Account'}
            </Button>
            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link 
                href="/auth/login" 
                className="text-primary hover:underline"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}