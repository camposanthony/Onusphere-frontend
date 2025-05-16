'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function TruckLoadingHelperPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard/tools/truck-loading-helper/customer');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-300">Loading Truck Loading Helper...</p>
      </div>
    </div>
  );
}
