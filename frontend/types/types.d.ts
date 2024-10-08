interface PerformanceLog {
  id: number;
  endpoint: string;
  method: string;
  success: boolean;
  statusCode: number;
  responseTime: number;
  createdAt: string;
}

interface PerformanceData {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  performanceLogs: PerformanceLog[];
}

interface Employee {
  id: number;
  surname: string;
  otherNames: string;
  dateOfBirth: string;
  photoId: string | null;
  uniqueCode: string;
  employeeNumber: string;
  createdAt: string;
  updatedAt: string;
}

interface RegisterSuccess {
  surname: string;
  success: boolean;
  employeeNumber: string;
}
