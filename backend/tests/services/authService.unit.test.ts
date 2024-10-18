import AuthService from '@/services/authService';
import prisma from '../setup';
import bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('AuthService', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it.skip('should successfully login an ADMIN', async () => {
    const mockedUser = {
      id: 1,
      email: 'dfcu@gmail.com',
      password: 'admin123',
      role: 'ADMIN',
    };
    prisma.user.findFirst = jest.fn().mockResolvedValue(mockedUser);
    bcrypt.compare = jest.fn().mockResolvedValue(true);

    const result = await AuthService.login(mockedUser.email, mockedUser.password);
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
    expect(result.user.role).toBe('ADMIN');
  }, 10000);

  it.skip('should throw an error if the user is not an admin', async () => {
    const mockedUser = {
      id: 1,
      email: 'dfcu@gmail.com',
      password: '1admin123',
      role: 'USER',
    };
    prisma.user.findFirst = jest.fn().mockResolvedValue(mockedUser);
    bcrypt.compare = jest.fn().mockResolvedValue(false);

    await expect(AuthService.login(mockedUser.email, mockedUser.password)).rejects.toThrow('Invalid credentials');
  });
  it.skip('should throw an error if email or password is missing', async () => {
    await expect(AuthService.login('', '')).rejects.toThrow('Email and password are required');
  });

  it.skip('should throw an error if the user is not found', async () => {
    prisma.user.findFirst = jest.fn().mockResolvedValue(null);
    await expect(AuthService.login('notFound@gmail.com', '1admin123')).rejects.toThrow('User not found');
  });

  it.skip('should throw an error if the password is incorrect', async () => {
    const mockedUser = {
      id: 1,
      email: 'dfcu@gmail.com',
      password: '23',
      role: 'ADMIN',
    };
    prisma.user.findFirst = jest.fn().mockResolvedValue(mockedUser);
    bcrypt.compare = jest.fn().mockResolvedValue(false);

    await expect(AuthService.login(mockedUser.email, mockedUser.password)).rejects.toThrow('Invalid credentials');
  });
});
