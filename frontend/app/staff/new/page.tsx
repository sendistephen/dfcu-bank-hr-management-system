import StaffForm from '@/components/staff-form';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';

const StaffRegisterForm = () => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      }
    >
      <StaffForm />
    </Suspense>
  );
};

export default StaffRegisterForm;
