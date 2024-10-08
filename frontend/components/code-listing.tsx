import { getRemainingTime } from '@/lib/utils';
import { Check, XIcon } from 'lucide-react';
import moment from 'moment';

interface CodeListingProps {
  codes: {
    code: string;
    createdAt: string;
    used: boolean;
    employee: {
      id: string;
      employeeNumber: string;
      surname: string;
      otherNames: string;
    };
    expiresAt: string;
  }[];
}

const CodeListing = ({ codes }: CodeListingProps) => {
  return (
    <div className="mt-10 overflow-auto">
      <h2 className="text-lg font-bold mb-4">Generated Codes</h2>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-left text-sm text-gray-600">
            <th className="py-2 px-2 border-b uppercase text-xs font-semibold">
              Code
            </th>
            <th className="py-2 px-2 border-b uppercase text-xs font-semibold">
              Created At
            </th>
            <th className="py-2 px-2 border-b uppercase text-xs font-semibold">
              Is Used
            </th>
            <th className="py-2 px-2 border-b uppercase text-xs font-semibold">
              Employee
            </th>
            <th className="py-2 px-2 border-b uppercase text-xs font-semibold">
              Expires In
            </th>
          </tr>
        </thead>
        <tbody>
          {codes.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="py-4 px-4 text-center text-gray-500 text-sm font-medium"
              >
                No data available.
              </td>
            </tr>
          ) : (
            codes.map((code) => (
              <tr key={code.code} className="border-b hover:bg-gray-50 text-sm">
                <td className="py-1 px-2 font-semibold text-gray-700">
                  {code.code}
                </td>
                <td className="py-1 px-2 text-gray-500">
                  {moment(code.createdAt).format('MM/DD/YYYY')}
                </td>
                <td className="py-1 px-2 text-gray-500">
                  {code.used ? (
                    <Check className="text-green-500 h-4 w-4" />
                  ) : (
                    <XIcon className="text-rose-500 h-4 w-4" />
                  )}
                </td>
                <td className="py-1 px-2 text-gray-500">
                  {code.employee ? code.employee!.surname : 'N/A'}
                </td>
                <td className="py-1 px-2 text-gray-500">
                  {(() => {
                    const { hours, minutes, seconds } = getRemainingTime(
                      code.expiresAt
                    );
                    return `${hours}h ${minutes}m ${seconds}s`;
                  })()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
export default CodeListing;
