import prisma from '../utils/prisma';

/**
 * Generates a random, unique 10-digit code as a string.
 *
 * This is used for generating unique codes for staff members to be used prior to registering.
 *
 * @returns a 10-digit code as a string
 */
function generateUniqueCode(): string {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

/**
 * Generates a unique employee number in the format DFCUXXX where XXX are three random digits.
 * @returns a unique employee number as a string
 */
function generateEmployeeNumber(): string {
  const randomDigits = Math.floor(100 + Math.random() * 900);
  return `DFCU${randomDigits}`;
}

export const createStaffCode = async () => {
  let code: string;
  let isUnique = false;

  // Ensure the generated code is unique
  do {
    code = generateUniqueCode();
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
};

/**
 * Registers a new staff member with the given details and unique staff code.
 * @param data The staff data to register
 * @throws {Error} if the code is invalid, expired, or has already been used
 * @returns the newly registered staff with their generated employee number
 */
export const registerNewStaff = async (data: {
  surname: string;
  otherNames: string;
  dateOfBirth: string; // Expected in ISO 8601 format from the client
  photoId?: string;
  code: string;
}) => {
  // Parse the dateOfBirth to ensure it's ISO 8601 and then a valid Date object
  const parsedDateOfBirth = new Date(data.dateOfBirth);

  if (isNaN(parsedDateOfBirth.getTime())) {
    throw new Error('Invalid date format. Date of birth must be in ISO 8601 format.');
  }

  // Validate the staff code
  const staffCode = await prisma.staffCode.findUnique({
    where: { code: data.code },
  });

  if (!staffCode) {
    throw new Error('Invalid code');
  }

  if (staffCode.used) {
    throw new Error('This code has already been used');
  }

  if (new Date() > staffCode.expiresAt) {
    throw new Error('This code has expired');
  }

  // Generate the employee number (e.g., DFCU123)
  const employeeNumber = generateEmployeeNumber();

  // Register the staff in the database with the parsed Date object
  const newStaff = await prisma.staff.create({
    data: {
      surname: data.surname,
      otherNames: data.otherNames,
      dateOfBirth: parsedDateOfBirth, // Use the JavaScript Date object
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
      staff: { connect: { id: newStaff.id } }, // Link the staff to the staff code
    },
  });

  return newStaff;
};

/**
 * Retrieves a staff member by their unique employee number.
 * @param {string} employeeNumber The 7-digit employee number of the staff member
 * @returns The staff member object if found, else null
 */
export const getStaffByEmployeeNumber = async (employeeNumber: string) => {
  return prisma.staff.findUnique({
    where: { employeeNumber },
  });
};

/**
 * Retrieves a list of all registered staff members.
 * @returns an array of staff member objects
 */

export const getAllStaff = async () => {
  return prisma.staff.findMany();
};

/**
 * Updates a staff member by their employee number.
 * @param {string} employeeNumber The 7-digit employee number of the staff member
 * @param {Object} data The data to update (dateOfBirth and photoId)
 * @returns The updated staff member object
 */
export const updateStaffByEmployeeNumber = async (employeeNumber: string, data: { dateOfBirth?: string; photoId?: string }) => {
  const parsedDateOfBirth = data.dateOfBirth ? new Date(data.dateOfBirth) : undefined;

  // Update the staff details
  return prisma.staff.update({
    where: { employeeNumber },
    data: {
      dateOfBirth: parsedDateOfBirth,
      photoId: data.photoId,
    },
  });
};
