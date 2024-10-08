'use client';

import { Search, Loader2, X } from 'lucide-react';
import { useState, useMemo } from 'react';
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

const Employees = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { employees, loading, error } = useEmployees(searchQuery);

  const filteredEmployees = useMemo(() => {
    if (!searchQuery) return employees;
    return employees.filter((employee) =>
      employee.employeeNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [employees, searchQuery]);

  const clearSearch = () => setSearchQuery('');

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
              placeholder="Search employees..."
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
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
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
                  <TableRow key={employee.id}>
                    <TableCell>
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={employee.photoId as string}
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
