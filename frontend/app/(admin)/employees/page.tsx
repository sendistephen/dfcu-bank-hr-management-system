'use client';

import { Search, Loader2, X } from 'lucide-react';
import { useState, useMemo, useCallback } from 'react';
import moment from 'moment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useEmployees from '@/hooks/useEmployees';
import { useRouter } from 'next/navigation';
import { useEmployeeStore } from '@/lib/store';

const Employees = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { employees, loading, error } = useEmployees(searchQuery);
  const { setSelectedEmployee } = useEmployeeStore();

  const router = useRouter();

  const filteredEmployees = useMemo(() => {
    if (!searchQuery) return employees;
    return employees.filter((employee) =>
      employee.employeeNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [employees, searchQuery]);

  const clearSearch = useCallback(() => setSearchQuery(''), []);

  const handleRowClick = useCallback(
    (employee: Employee) => {
      setSelectedEmployee(employee);
      router.push(`/staff/edit?employeeId=${employee.employeeNumber}`);
    },
    [router, setSelectedEmployee]
  );

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Employees</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 relative">
            <Input
              type="text"
              placeholder="Search employees by employee number e.g DFCU123..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

            {searchQuery && (
              <X
                onClick={clearSearch}
                className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 cursor-pointer"
              />
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center my-10">
              <Loader2 className="h-4 w-4 animate-spin text-gray-500" />{' '}
              <span className="text-neutral-500 text-xs">Loading...</span>
            </div>
          ) : error ? (
            <p className="text-rose-600 leading-loose">{error}</p>
          ) : filteredEmployees.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Photo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Employee Number</TableHead>
                  <TableHead>Date of Birth</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee: Employee) => (
                  <TableRow
                    className="cursor-pointer"
                    key={employee.id}
                    onClick={() => handleRowClick(employee)}
                  >
                    <TableCell>
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          className="object-cover"
                          src={
                            employee.photoId
                              ? `data:image/png;base64,${employee.photoId}`
                              : undefined
                          }
                          alt={employee.surname.charAt(0).toUpperCase()}
                        />
                        <AvatarFallback>
                          {employee.surname.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      {employee.surname} {employee.otherNames}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {employee.employeeNumber}
                    </TableCell>
                    <TableCell>
                      {moment(employee.dateOfBirth).format('YYYY-MM-DD')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No employees found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Employees;
