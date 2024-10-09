import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createJSONStorage, persist } from 'zustand/middleware';

interface EmployeeStore {
  selectedEmployee: Employee | null;
  setSelectedEmployee: (employee: Employee | null) => void;
  clearSelectedEmployee: () => void;
}

export const useEmployeeStore = create(
  persist(
    immer<EmployeeStore>((set) => ({
      selectedEmployee: null,
      setSelectedEmployee: (employee: Employee | null) =>
        set((draft) => {
          draft.selectedEmployee = employee;
        }),
      clearSelectedEmployee: () =>
        set((draft) => {
          draft.selectedEmployee = null;
        }),
    })),
    {
      name: 'employee-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
