import prisma from '../config/db.js';
import { generateToken, hashPassword, comparePassword } from '../utils/auth.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.userLogin.findUnique({
      where: { email },
      include: {

        student: true,
        subAdmin: true
      }
    });

    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    const userData = {
      id: user.id,
      email: user.email,
      role: user.role,
      ...(user.student && { student: user.student }),
      ...(user.subAdmin && { subAdmin: user.subAdmin })
    };

    return successResponse(res, { user: userData, token }, 'Login successful');
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse(res, 'Login failed', 500);
  }
};

export const register = async (req, res) => {
  try {
    const { email, password, role, ...userData } = req.body;


    const existingUser = await prisma.userLogin.findUnique({
      where: { email }
    });

    if (existingUser) {
      return errorResponse(res, 'User already exists', 409);
    }

    const hashedPassword = await hashPassword(password);


    const userLogin = await prisma.userLogin.create({
      data: {
        email,
        password: hashedPassword,
        role
      }
    });


    let roleData = null;
    if (role === 'STUDENT') {
      roleData = await prisma.student.create({
        data: {
          ...userData,
          admissionNumber: generateAdmissionNumber(),
          userLoginId: userLogin.id
        }
      });
    } else if (role === 'SUBADMIN') {
      roleData = await prisma.subAdmin.create({
        data: {
          ...userData,
          userLoginId: userLogin.id
        }
      });
    }

    const token = generateToken({
      userId: userLogin.id,
      email: userLogin.email,
      role: userLogin.role
    });

    return successResponse(res, { 
      user: { ...userLogin, [role.toLowerCase()]: roleData }, 
      token 
    }, 'Registration successful', 201);
  } catch (error) {
    console.error('Registration error:', error);
    return errorResponse(res, 'Registration failed', 500);
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.userLogin.findUnique({
      where: { id: userId },
      include: {
        student: true,
        subAdmin: true
      }
    });

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    const userData = {
      id: user.id,
      email: user.email,
      role: user.role,
      ...(user.student && { student: user.student }),
      ...(user.subAdmin && { subAdmin: user.subAdmin })
    };

    return successResponse(res, userData, 'Profile retrieved successfully');
  } catch (error) {
    console.error('Get profile error:', error);
    return errorResponse(res, 'Failed to get profile', 500);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password, ...updateData } = req.body;

    const updatePayload = { ...updateData };
    
    if (password) {
      updatePayload.password = await hashPassword(password);
    }

    const updatedUser = await prisma.userLogin.update({
      where: { id: userId },
      data: updatePayload,
      include: {
        student: true,
        subAdmin: true
      }
    });

    const userData = {
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
      ...(updatedUser.student && { student: updatedUser.student }),
      ...(updatedUser.subAdmin && { subAdmin: updatedUser.subAdmin })
    };

    return successResponse(res, userData, 'Profile updated successfully');
  } catch (error) {
    console.error('Update profile error:', error);
    return errorResponse(res, 'Failed to update profile', 500);
  }
};

// Helper function to generate admission number
const generateAdmissionNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ADM${year}${random}`;
}; 