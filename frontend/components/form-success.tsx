import { CircleCheck } from "lucide-react";

const FormSucessMessage = ({ message }: { message: string | undefined }) => {
  if (!message) return null;

  return (
    <div className="bg-green-500/15 text-xs text-green-500 p-2 flex space-x-2 rounded">
      <CircleCheck className="w-4 h-4" />
      <span>{message}</span>
    </div>
  );
};
export default FormSucessMessage;
