import StaffService from '@/services/staffServices';
import prisma from '../setup';
import { AppError } from '@/utils/customErrors';

describe('StaffService Integration Tests(with real database)', () => {
  afterEach(async () => {
    await prisma.staffCode.deleteMany();
    await prisma.staff.deleteMany();
  });

  describe('createStaffCode', () => {
    it('should generate a unique staff code and save it sucessfully to the database', async () => {
      const newStaffCode = await StaffService.createStaffCode();
      // verify that the code has been created
      expect(newStaffCode).toHaveProperty('code');
      // verify that the code has a length of 10
      expect(newStaffCode.code).toHaveLength(10);
      // checke if the code exists in the database
      const savedStaffCode = await prisma.staffCode.findUnique({ where: { code: newStaffCode.code } });
      expect(savedStaffCode).toBeDefined();
    });
  });

  describe('registerNewStaff', () => {
    it('should register a new staff member with a valid unique 10-digit code', async () => {
      // create a valid staff code.
      const staffCode = await StaffService.createStaffCode();
      // register a new staff with the generated code.
      const newStaff = await StaffService.registerNewStaff({
        surname: 'John',
        otherNames: 'Doe',
        dateOfBirth: '1990-01-01',
        code: staffCode.code,
      });
      // verify that a new staff has been created -> will have an employee number generated.
      expect(newStaff).toHaveProperty('employeeNumber');
      expect(newStaff.surname).toBe('John');

      // verify that the staff memember exists in the db
      const savedStaff = await prisma.staff.findUnique({
        where: { employeeNumber: newStaff.employeeNumber },
      });
      expect(savedStaff).toBeDefined();
    }, 10000);

    it('should throw an error if the staff registers with an invalid code', async () => {
      // try creating a new staff with an invalid code
      await expect(
        StaffService.registerNewStaff({
          surname: 'John',
          otherNames: 'Doe',
          dateOfBirth: '1990-01-01',
          code: 'invalid-code',
        })
      ).rejects.toThrow('Invalid code');

      const allStaff = await prisma.staff.findMany();
      expect(allStaff).toHaveLength(0);
    });

    it('should throw an error if the code is already used', async () => {
      // create a valid staff code
      const staffCode = await StaffService.createStaffCode();

      // mark the code as used in the database
      await prisma.staffCode.update({
        where: { code: staffCode.code },
        data: { used: true },
      });

      // try creating a new staff with the same code
      await expect(
        StaffService.registerNewStaff({
          surname: 'John',
          otherNames: 'Doe',
          dateOfBirth: '1990-01-01',
          code: staffCode.code,
        })
      ).rejects.toThrow(AppError);

      // check if the correct error message is thrown
      try {
        await StaffService.registerNewStaff({
          surname: 'John',
          otherNames: 'Doe',
          dateOfBirth: '1990-01-01',
          code: staffCode.code,
        });
      } catch (error: any) {
        expect(error.message).toBe('This code has already been used');
        expect(error.statusCode).toBe(400);
      }
    });

    it('should throw an error if the code is expired', async () => {
      const staffCode = await StaffService.createStaffCode();
      // mark the code as expired in the database
      await prisma.staffCode.update({
        where: { code: staffCode.code },
        data: { expiresAt: new Date(Date.now() - 10000) },
      });

      // try creating a new staff with the same code
      await expect(
        StaffService.registerNewStaff({
          surname: 'John',
          otherNames: 'Doe',
          dateOfBirth: '1990-01-01',
          code: staffCode.code,
        })
      ).rejects.toThrow(AppError);

      // check if the current error message is thrown
      try {
        await StaffService.registerNewStaff({
          surname: 'John',
          otherNames: 'Doe',
          dateOfBirth: '1990-01-01',
          code: staffCode.code,
        });
      } catch (error) {
        if (error instanceof AppError) {
          expect(error.message).toBe('This code has expired');
          expect(error.statusCode).toBe(400);
        } else {
          throw error;
        }
      }
    });

    it('should throw an error if the unique code is missing', async () => {
      await expect(
        StaffService.registerNewStaff({
          surname: 'John',
          otherNames: 'Doe',
          dateOfBirth: '1990-01-01',
          code: '',
        })
      ).rejects.toThrow('Unique code is required for registration');
    });
  });

  describe('getStaffByEmployeeNumber', () => {
    it('should return a staff member if they exist', async () => {
      // create a new staff member to use for search.
      const staffCode = await StaffService.createStaffCode();

      const newStaff = await StaffService.registerNewStaff({
        surname: 'John',
        otherNames: 'Doe',
        dateOfBirth: '1990-01-01',
        code: staffCode.code,
      });
      // check if the employee number is generated
      const staff = await StaffService.getStaffByEmployeeNumber(newStaff.employeeNumber);
      expect(staff).toBeDefined();
      expect(staff?.surname).toBe('John');
    });

    it('should return null if the staff member does not exist', async () => {
      const staff = await StaffService.getStaffByEmployeeNumber('DFCU999');
      expect(staff).toBeNull();
    });
  });

  describe('getAllStaff', () => {
    it('should return all staff members', async () => {
      const staffCode1 = await StaffService.createStaffCode();
      await StaffService.registerNewStaff({
        surname: 'John',
        otherNames: 'Doe',
        dateOfBirth: '1990-01-01',
        code: staffCode1.code,
      });

      const staffCode2 = await StaffService.createStaffCode();
      await StaffService.registerNewStaff({
        surname: 'Jane',
        otherNames: 'Doe',
        dateOfBirth: '1990-01-01',
        code: staffCode2.code,
      });

      const allStaff = await StaffService.getAllStaff();
      expect(allStaff).toHaveLength(2);
    }, 10000);

    it('should return an empty array if there are no staff members found', async () => {
      const allStaff = await StaffService.getAllStaff();
      expect(allStaff).toEqual([]);
    });
  });

  describe('updateStaffByEmployeeNumber', () => {
    it('should update a staff member by thier dateOfBirth and photoId', async () => {
      const staffCode = await StaffService.createStaffCode();

      const newStaff = await StaffService.registerNewStaff({
        surname: 'John',
        otherNames: 'Doe',
        dateOfBirth: '1990-01-01',
        code: staffCode.code,
      });

      // update the staff member registered above
      const updatedStaff = await StaffService.updateStaffByEmployeeNumber(newStaff.employeeNumber, {
        dateOfBirth: '2000-01-01',
        photoId: 'newPhotoId',
      });

      expect(updatedStaff.dateOfBirth.toISOString()).toBe(new Date('2000-01-01').toISOString());
      expect(updatedStaff.photoId).toBe('newPhotoId');
    });

    it('should throw an error if the staff memeber to update is not found', async () => {
      await expect(
        StaffService.updateStaffByEmployeeNumber('DFCU999', {
          dateOfBirth: '2000-01-01',
          photoId: 'newPhotoId',
        })
      ).rejects.toThrow('Staff member with employee number DFCU999 not found.');
    });
  });

  describe('getAllGeneratedCodes', () => {
    it('should return all generated staff codes', async () => {
      const code1 = await StaffService.createStaffCode();
      const code2 = await StaffService.createStaffCode();

      // mark code1 as used
      await prisma.staffCode.update({
        where: { code: code1.code },
        data: { used: true },
      });

      // mark code2 as expired
      await prisma.staffCode.update({
        where: { code: code2.code },
        data: { expiresAt: new Date(Date.now() - 10000) },
      });

      const allcodes = await StaffService.getAllGeneratedCodes();
      expect(allcodes).toHaveLength(2);
      expect(allcodes[0]).toHaveProperty('code');
    });
  });
});
