import { NextAuthConfig } from 'next-auth';

import CredentialsProvider from 'next-auth/providers/credentials';

export default {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const validateFields = adminLoginFormSchema.safeParse(credentials);
        if (validateFields.success) {
          const { username, password } = validateFields.data;

          // Retrieve the admin user from the database based on the provided username
          const adminUser = await prisma.user.findUnique({
            where: { username },
          });

          if (!adminUser || adminUser.role !== 'admin') {
            throw new Error('Invalid username or password');
          }
          // Verify the user's authenticity by comparing the provided password with the stored hashed password.
          const isPasswordMatch = await bcrypt.compare(
            password,
            adminUser.passwordHash
          );

          console.log({ isPasswordMatch });
          // If the password matches, return the admin user
          if (isPasswordMatch)
            return {
              id: adminUser.id,
              username: adminUser.username,
              role: adminUser.role,
            };

          return null;
        }
        return null;
      },
    }),
  ],
} as NextAuthConfig;
