import { Request, Response, NextFunction } from 'express';
import { NotFoundError, UnauthorizedError } from '../utils/customErrors';
import StaffService from '../services/staffServices';
import { CustomRequest } from 'types/express';

/**
 * Generates a new unique staff code and returns it in the response.
 */
export const generateStaffCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const staffCode = await StaffService.createStaffCode();
    res.status(201).json({ code: staffCode.code });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves all generated staff codes.
 * @throws {UnauthorizedError} if the user is not an admin
 * @returns an array of all generated staff codes
 */
export const getAllCodes = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Ensure the user is an admin
    if (req.userRole !== 'ADMIN') {
      throw new UnauthorizedError('You are not authorized to access this resource');
    }

    // Get all generated codes
    const codes = await StaffService.getAllGeneratedCodes();

    res.status(200).json(codes);
  } catch (error) {
    next(error);
  }
};

/**
 * Registers a new staff member with the given details and unique staff code.
 */
export const registerStaff = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { surname, otherNames, dateOfBirth, code } = req.body;

    let photoId: string | undefined;
    if (req.file) {
      photoId = req.file.buffer.toString('base64');
    }

    const newStaff = await StaffService.registerNewStaff({
      surname,
      otherNames,
      dateOfBirth,
      photoId,
      code,
    });

    res.status(201).json({
      employeeNumber: newStaff.employeeNumber,
      surname: newStaff.surname,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves a single staff member by their employee number, or all staff if no employee number is provided.
 */
export const getStaff = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { employeeNumber } = req.query;

    // Ensure employeeNumber is a string
    if (!employeeNumber || typeof employeeNumber !== 'string') {
      const staffList = await StaffService.getAllStaff();
      res.status(200).json(staffList);
      return;
    }

    // Compare req.userId (number) with employeeNumber (string)
    if (req.userRole !== 'ADMIN' && String(req.userId) !== employeeNumber) {
      throw new UnauthorizedError('You are not authorized to access this resource');
    }

    const staff = await StaffService.getStaffByEmployeeNumber(employeeNumber);
    if (!staff) {
      throw new NotFoundError('Staff member not found');
    }
    res.status(200).json(staff);
    return;
  } catch (error) {
    next(error);
  }
};

/**
 * Updates a single staff member by their employee number.
 */
export const updateStaff = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { employeeNumber } = req.params;
    const { dateOfBirth, photoId } = req.body;

    // Compare req.userId (number) with employeeNumber (string), convert types accordingly
    if (req.userRole !== 'ADMIN' && String(req.userId) !== employeeNumber) {
      throw new UnauthorizedError('You are not authorized to update this staff member');
    }

    const updatedStaff = await StaffService.updateStaffByEmployeeNumber(employeeNumber, {
      dateOfBirth,
      photoId,
    });

    if (!updatedStaff) {
      res.status(404).json({ message: 'Staff member not found' });
      return;
    }
    res.status(200).json({
      success: true,
      message: 'Staff updated successfully',
      staff: updatedStaff,
    });
    return;
  } catch (error) {
    next(error);
  }
};
