import { Request, Response, NextFunction } from 'express';
import { createStaffCode, getAllStaff, getStaffByEmployeeNumber, registerNewStaff, updateStaffByEmployeeNumber } from '../services/staffServices';
import { UnauthorizedError } from '../utils/customErrors';

/**
 * Generates a new unique staff code and returns it in the response.
 * @throws Any errors encountered while generating the code are propagated to the next middleware.
 */
export const generateStaffCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const staffCode = await createStaffCode();
    res.status(201).json({ code: staffCode.code });
  } catch (error) {
    next(error);
  }
};

/**
 * Registers a new staff member with the given details and unique staff code.
 * @throws {Error} if the code is invalid, expired, or has already been used
 */
export const registerStaff = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { surname, otherNames, dateOfBirth, code } = req.body;

    let photoId: string | undefined;
    if (req.file) {
      photoId = req.file.buffer.toString('base64');
    }

    // Call the service to register the new staff and get the generated employee number
    const newStaff = await registerNewStaff({
      surname,
      otherNames,
      dateOfBirth,
      photoId,
      code,
    });

    res.status(201).json({
      message: 'Staff registered successfully',
      employeeNumber: newStaff.employeeNumber,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves a single staff member by their employee number, or all staff if no employee number is provided.
 * Only accessible by admins or the owner of the staff member.
 * @throws {UnauthorizedError} If the user is not authorized to access this resource
 * @throws {NotFoundError} If the staff member is not found
 * @returns a single staff member or a list of all staff
 */
export const getStaff = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { employeeNumber } = req.query;

    if (!employeeNumber) {
      // If no employee number is provided, return all staff
      const staffList = await getAllStaff();
      res.status(200).json(staffList);
    }

    // Only allow access to admins and owners
    const userRole = req.userRole;
    if (userRole !== 'ADMIN' && req.userId !== employeeNumber) {
      throw new UnauthorizedError('You are not authorized to access this resource');
    }

    console.log('EMPLOYEE NUMBER', employeeNumber);
    if (employeeNumber) {
      // Retrieve staff by employee number
      const staff = await getStaffByEmployeeNumber(employeeNumber as string);
      if (!staff) {
        res.status(404).json({ message: 'Staff member not found' });
        return;
      }
      res.status(200).json(staff);
    } else {
      // Retrieve all staff
      const staffList = await getAllStaff();
      res.status(200).json(staffList);
      return;
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Updates a single staff member by their employee number.
 * Only accessible by admins or the owner of the staff member.
 * @throws {UnauthorizedError} If the user is not authorized to access this resource
 * @throws {NotFoundError} If the staff member is not found
 * @returns the updated staff member
 */
export const updateStaff = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { employeeNumber } = req.params;
    const { dateOfBirth, photoId } = req.body;

    // Check authorization: only admin or the owner can update
    const userRole = req.userRole;
    if (userRole !== 'ADMIN' && req.userId !== employeeNumber) {
      throw new UnauthorizedError('You are not authorized to update this staff member');
    }

    let updatedPhotoId: string | undefined = undefined;
    if (req.file) {
      updatedPhotoId = req.file.buffer.toString('base64');
    }

    // Update the staff member's details
    const updatedStaff = await updateStaffByEmployeeNumber(employeeNumber, {
      dateOfBirth,
      photoId: updatedPhotoId ?? photoId,
    });

    if (!updatedStaff) {
      res.status(404).json({ message: 'Staff member not found' });
    }

    res.status(200).json({ message: 'Staff updated successfully', staff: updatedStaff });
  } catch (error) {
    next(error);
  }
};
