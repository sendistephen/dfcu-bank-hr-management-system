import { Button } from '@/components/ui/button';

interface ModalProps {
  data: RegisterSuccess;
  onClose: () => void;
}

const SuccessModal = ({ data, onClose }: ModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md mx-auto w-full">
        <h2 className="text-lg font-bold mb-4">
          Success{' '}
          <span className="animate-bounce duration-1000 text-green-500">
            🎉
          </span>
        </h2>
        <p className="text-sm text-neutral-600">
          Dear James, your employeee number is{' '}
          <span className="font-bold">{data.employeeNumber}</span>
        </p>

        <Button onClick={onClose} className="mt-4" variant="outline">
          Close
        </Button>
      </div>
    </div>
  );
};

export default SuccessModal;
