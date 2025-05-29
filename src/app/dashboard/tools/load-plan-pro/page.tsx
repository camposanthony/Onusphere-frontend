'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { addToolToSaved } from '@/lib/utils/tool-manager';

export default function LoadPlanProPage() {
  const router = useRouter();

  useEffect(() => {
    // Add this tool to saved tools when accessed for the first time
    addToolToSaved('load-plan-pro');
    
    // Redirect to the customer page
    router.push('/dashboard/tools/load-plan-pro/customer');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-300">Loading Load Plan Pro...</p>
      </div>
    </div>
  );
}
