interface CodeListingProps {
  codes: any[];
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
              <tr key={code.id} className="border-b hover:bg-gray-50 text-sm">
                <td className="py-1 px-2 font-semibold text-gray-700">
                  {code.code}
                </td>
                <td className="py-1 px-2 text-gray-500">
                  {new Date(code.createdAt).toLocaleString()}
                </td>
                <td className="py-1 px-2 text-gray-500">
                  {code.isUsed ? 'Yes' : 'No'}
                </td>
                <td className="py-1 px-2 text-gray-500">
                  {code.employee ? code.employee.surname : 'N/A'}
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
