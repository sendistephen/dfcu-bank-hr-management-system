import StaffService from "@/services/staffServices";

describe('StaffService', () => {
  it('should generate a unique staff 10-digit code', () => {
    const code = StaffService['generateUniqueCode']();
    expect(code).toHaveLength(10);
    expect(Number(code)).toBeGreaterThan(1000000000);
  });
});
