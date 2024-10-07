import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

const FormErrorMessage = ({ message }: { message: string | undefined }) => {
  if (!message) return null;

  return (
    <div className="bg-destructive/15 text-xs text-destructive p-2 flex space-x-2 rounded">
      <ExclamationTriangleIcon className="w-4 h-4" />
      <span>{message}</span>
    </div>
  );
};
export default FormErrorMessage;
