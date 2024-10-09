import { PrismaClient, StaffCode, Staff } from '@prisma/client';
import { AppError, NotFoundError } from '../utils/customErrors';

const prisma = new PrismaClient();

class StaffService {
  /**
   * Generates a random, unique 10-digit code as a string.
   * @returns a 10-digit code as a string
   */
  private static generateUniqueCode(): string {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
  }

  /**
   * Generates a unique employee number in the format DFCUXXX where XXX are three random digits.
   * @returns a unique employee number as a string
   */
  private static generateEmployeeNumber(): string {
    const randomDigits = Math.floor(100 + Math.random() * 900);
    return `DFCU${randomDigits}`;
  }

  /**
   * Generates a new unique staff code and returns it.
   * @returns {Promise<{ code: string }>} - The new staff code
   */
  public static async createStaffCode(): Promise<{ code: string }> {
    let code: string;
    let isUnique = false;

    // Ensure the generated code is unique
    do {
      code = this.generateUniqueCode();
      const existingCode = await prisma.staffCode.findUnique({ where: { code } });
      if (!existingCode) {
        isUnique = true;
      }
    } while (!isUnique);

    // Set the code expiration (24 hours from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1);

    // Create the new staff code in the database
    const newStaffCode = await prisma.staffCode.create({
      data: {
        code,
        expiresAt,
      },
    });

    return newStaffCode;
  }

  /**
   * Registers a new staff member with the given details and unique staff code.
   * @param data The staff data to register
   * @throws {Error} if the code is invalid, expired, or has already been used
   * @returns the newly registered staff with their generated employee number
   */
  public static async registerNewStaff(data: {
    surname: string;
    otherNames: string;
    dateOfBirth: string;
    photoId?: string;
    code: string;
  }): Promise<Staff> {
    const parsedDateOfBirth = new Date(data.dateOfBirth);

    if (!data.code) {
      throw new AppError('Unique code is required for registration', 400);
    }

    // Validate the staff code
    const staffCode = await prisma.staffCode.findUnique({
      where: { code: data.code },
    });

    if (!staffCode) {
      throw new AppError('Invalid code', 400);
    }

    if (staffCode.used) {
      throw new AppError('This code has already been used', 400);
    }

    if (new Date() > staffCode.expiresAt) {
      throw new AppError('This code has expired', 400);
    }

    // Generate the employee number (e.g., DFCU123)
    const employeeNumber = this.generateEmployeeNumber();

    // Register the staff in the database
    const newStaff = await prisma.staff.create({
      data: {
        surname: data.surname,
        otherNames: data.otherNames,
        dateOfBirth: parsedDateOfBirth,
        photoId: data.photoId,
        uniqueCode: staffCode.code,
        employeeNumber,
      },
    });

    // Mark the code as used and link it to the staff
    await prisma.staffCode.update({
      where: { id: staffCode.id },
      data: {
        used: true,
        usedAt: new Date(),
        staff: { connect: { id: newStaff.id } },
      },
    });

    return newStaff;
  }

  /**
   * Retrieves a staff member by their unique employee number.
   * @param {string} employeeNumber The 7-digit employee number of the staff member
   * @returns The staff member object if found, else null
   */
  public static async getStaffByEmployeeNumber(employeeNumber: string): Promise<Staff | null> {
    return prisma.staff.findUnique({
      where: { employeeNumber },
    });
  }

  /**
   * Retrieves a list of all registered staff members.
   * @returns an array of staff member objects
   */
  public static async getAllStaff(): Promise<Staff[]> {
    return prisma.staff.findMany();
  }

  /**
   * Updates a staff member by their employee number.
   * @param {string} employeeNumber The 7-digit employee number of the staff member
   * @param {Object} data The data to update (dateOfBirth and photoId)
   * @returns The updated staff member object
   */
  public static async updateStaffByEmployeeNumber(employeeNumber: string, data: { dateOfBirth?: string; photoId?: string }): Promise<Staff> {
    const existingStaff = await prisma.staff.findUnique({
      where: { employeeNumber },
    });

    if (!existingStaff) {
      throw new NotFoundError(`Staff member with employee number ${employeeNumber} not found.`);
    }

    const parsedDateOfBirth = data.dateOfBirth ? new Date(data.dateOfBirth) : undefined;

    // Update the staff details
    return prisma.staff.update({
      where: { employeeNumber },
      data: {
        dateOfBirth: parsedDateOfBirth,
        photoId: data.photoId,
      },
    });
  }
  /**
   * Retrieves a list of all generated staff codes, including their expiration
   * status and the date they were used (if used).
   *
   * @returns An array of objects with the following properties:
   *   - code: The generated staff code
   *   - used: A boolean indicating if the code has been used
   *   - expiresAt: The expiration date of the code
   *   - usedAt: The date the code was used (if used)
   */

  public static async getAllGeneratedCodes(): Promise<Pick<StaffCode, 'code' | 'used' | 'expiresAt' | 'usedAt'>[]> {
    return prisma.staffCode.findMany({
      select: {
        code: true,
        used: true,
        expiresAt: true,
        usedAt: true,
      },
    });
  }
}

export default StaffService;
