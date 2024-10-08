'use client';

import { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import CodeListing from '@/components/code-listing';
import { generateCode, getAllGeneratedCodes } from '@/app/action/generate-code';

const GenerateCode = () => {
  const [codes, setCodes] = useState([]);

  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [shouldRefetch, setShouldRefetch] = useState(false);

  const handleGenerateCode = () => {
    startTransition(() => {
      generateCode().then((data) => {
        if (data.authorized === false) {
          toast('Authorization failed! ', {
            description: data.message,
          });
        }
        toast('Sucess! ', {
          description: data.message,
        });
        setShouldRefetch((prev) => !prev);
      });
    });
  };

  useEffect(() => {
    getAllGeneratedCodes().then((data) => {
      if (data.error) {
        toast.error(data.message);
      } else {
        setCodes(data.codes ?? []);
      }
      setLoading(false);
    });
  }, [shouldRefetch]);

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
