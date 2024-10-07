'use client';

import { useEffect, useState, useTransition } from 'react';

import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import CodeListing from '@/components/code-listing';

const GenerateCode = () => {
  const [codes, setCodes] = useState<any>([]);

  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const handleGenerateCode = () => {
    startTransition(() => {});
  };

  return (
    <div>
      <h2 className="text-lg font-bold">Generate a unique 10-digit code</h2>
      <small className="text-neutral-400">
        The code generated is sent to the new staff member ahead of registration
      </small>

      <div className="mt-4">
        <Button onClick={handleGenerateCode} disabled={isPending}>
          {isPending ? (
            <span className="flex gap-1 items-center">
              <Loader2 className="w-4 h-4 animate-spin" /> Generating...
            </span>
          ) : (
            'Generate code'
          )}
        </Button>
      </div>

      {/* list of generated codes */}
      {loading ? (
        <div className="flex justify-center items-center mt-10">
          <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
        </div>
      ) : (
        <CodeListing codes={codes} />
      )}
    </div>
  );
};

export default GenerateCode;
