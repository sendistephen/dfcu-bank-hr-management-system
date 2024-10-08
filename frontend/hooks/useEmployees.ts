import { useState, useEffect, useCallback, useRef } from 'react';
import axios, { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';

const useEmployees = (searchQuery: string) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { data: session, status } = useSession();
  const accessToken = session?.accessToken;

  const hasFetchedRef = useRef(false);

  const fetchEmployees = useCallback(async () => {
    if (!accessToken || status !== 'authenticated' || hasFetchedRef.current)
      return;
    hasFetchedRef.current = true;

    setLoading(true);
    setError('');

    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/staff`, {
        params: searchQuery ? { employeeNumber: searchQuery } : {},
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setEmployees(Array.isArray(res.data) ? res.data : [res.data]);
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data.message);
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken, searchQuery, status]);

  useEffect(() => {
    if (accessToken && status === 'authenticated') {
      hasFetchedRef.current = false;
      fetchEmployees();
    }
  }, [accessToken, fetchEmployees, status]);

  return { employees, loading, error };
};

export default useEmployees;
