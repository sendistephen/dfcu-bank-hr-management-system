'use client';

import { Search, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
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
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Employees = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError('');

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/staff`,
          {
            params: searchQuery ? { employeeNumber: searchQuery } : {},
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setEmployees(Array.isArray(res.data) ? res.data : [res.data]);
      } catch (err) {
        setError('Failed to fetch employees. Please try again.');
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [accessToken, searchQuery]);

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
              className="pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          {loading ? (
            <div className="flex justify-center items-center my-10">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : error ? (
            <p>{error}</p>
          ) : employees.length > 0 ? (
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
                {employees.map((employee: Employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={employee.photoId as string}
                          alt={employee.surname.charAt(0).toUpperCase()}
                        />
                        <AvatarFallback>{employee.surname}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      {employee.surname} {employee.otherNames}
                    </TableCell>
                    <TableCell>{employee.employeeNumber}</TableCell>
                    <TableCell>
                      {moment(employee.dateOfBirth).format('YYYY-MMMM-DD')}
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
