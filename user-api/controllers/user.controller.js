import axios from 'axios';
import User from '../models/user.model.js';
import CustomError from '../utils/CustomError.js';

const ADDRESS_SERVICE_URL = 'http://localhost:5000/api/addresses/api/addresses';

export const createUser = async (req, res, next) => {
  try {
    const { addressData, ...userData } = req.body;
    
    const user = new User(userData);
    await user.save();

    if (addressData) {
      try {
        const addressPayload = {
          ...addressData,
          userId: user.id
        };

        const addressResponse = await axios.post(ADDRESS_SERVICE_URL, addressPayload);
        
        user.address = addressResponse.data.id;
        await user.save();

        return res.status(201).json({
          ...user.toJSON(),
          address: addressResponse.data
        });
        
      } catch (error) {
        await User.findByIdAndDelete(user.id);
        throw new CustomError(
          `Failed to create address: ${error.response?.data?.message || error.message}`,
          error.response?.status || 500
        );
      }
    }

    res.status(201).json(user);
  } catch (error) {
    next(new CustomError(error.message, error.status || 400));
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    
    try {
      const usersWithAddresses = await Promise.all(users.map(async user => {
        if (user.address) {
          try {
            const addressResponse = await axios.get(`${ADDRESS_SERVICE_URL}/${user.address}`);
            return {
              ...user.toJSON(),
              address: addressResponse.data
            };
          } catch (error) {
            console.error(`Failed to fetch address for user ${user.id}:`, error.message);
            return {
              ...user.toJSON(),
              address: "Address doesn't exist anymore"
            };
          }
        }
        return {
          ...user.toJSON(),
          address: null
        };
      }));
      
      res.status(200).json(usersWithAddresses);
    } catch (error) {
      console.error('Failed to process users with addresses:', error.message);
      res.status(200).json(users);
    }
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};

export const assignAddressToUser = async (req, res, next) => {
  try {
    const { userId, addressId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError('User not found', 404);
    }

    try {
      await axios.patch(`${ADDRESS_SERVICE_URL}/${addressId}`, {
        userId: userId
      });
    } catch (error) {
      if (error.response?.status === 404) {
        throw new CustomError('Address not found', 404);
      }
      throw new CustomError(
        `Failed to update address: ${error.response?.data?.message || error.message}`,
        error.response?.status || 500
      );
    }

    res.status(200).json(user);
  } catch (error) {
    next(new CustomError(error.message, error.status || 400));
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      throw new CustomError('User not found', 404);
    }

    try {
      if (user.address) {
        const addressResponse = await axios.get(`${ADDRESS_SERVICE_URL}/${user.address}`);
        return res.status(200).json({
          ...user.toJSON(),
          address: addressResponse.data
        });
      }
      
      res.status(200).json({
        ...user.toJSON(),
        address: null
      });

    } catch (error) {
      console.error('Failed to fetch address:', error.message);
      res.status(200).json({
        ...user.toJSON(),
        address: null
      });
    }
  } catch (error) {
    next(new CustomError(error.message, error.status || 500));
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { addressData, ...userData } = req.body;

    // Find and update user
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError('User not found', 404);
    }

    // Update user fields
    Object.keys(userData).forEach(field => {
      if (field !== 'id' && field !== '_id') { // Prevent modification of IDs
        user[field] = userData[field];
      }
    });

    // Handle address update if provided
    if (addressData) {
      try {
        if (user.address) {
          // Update existing address
          await axios.patch(`${ADDRESS_SERVICE_URL}/${user.address}`, {
            ...addressData,
            userId: user.id
          });
          
          // Get updated address
          const addressResponse = await axios.get(`${ADDRESS_SERVICE_URL}/${user.address}`);
          await user.save();
          
          return res.status(200).json({
            ...user.toJSON(),
            address: addressResponse.data
          });
        } else {
          // Create new address
          const addressResponse = await axios.post(ADDRESS_SERVICE_URL, {
            ...addressData,
            userId: user.id
          });
          
          user.address = addressResponse.data.id;
          await user.save();
          
          return res.status(200).json({
            ...user.toJSON(),
            address: addressResponse.data
          });
        }
      } catch (error) {
        throw new CustomError(
          `Failed to update address: ${error.response?.data?.message || error.message}`,
          error.response?.status || 500
        );
      }
    }

    // Save user without address changes
    await user.save();
    res.status(200).json(user);

  } catch (error) {
    next(new CustomError(error.message, error.status || 400));
  }
};


export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Find user first to check if exists and get address reference
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError('User not found', 404);
    }

    // Delete associated address if exists
    if (user.address) {
      try {
        await axios.delete(`${ADDRESS_SERVICE_URL}/${user.address}`);
      } catch (error) {
        console.error(`Failed to delete address for user ${userId}:`, error.message);
        // Continue with user deletion even if address deletion fails
      }
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(new CustomError(error.message, error.status || 400));
  }
};

export const getUserStatistics = async (req, res, next) => {
  try {
    // Get total number of users
    const totalUsers = await User.countDocuments();
    
    // Get count of active users
    const activeUsers = await User.countDocuments({ statut: 'ACTIVE' });
    
    // Get count of inactive users
    const inactiveUsers = await User.countDocuments({ statut: 'INACTIVE' });
    
    // Get count of verified email users
    const verifiedEmailUsers = await User.countDocuments({ statutVerificationEmail: true });
    
    // Get count of verified phone users
    const verifiedPhoneUsers = await User.countDocuments({ statutVerificationTelephone: true });

    res.status(200).json({
      totalUsers,
      activeUsers,
      inactiveUsers,
      verifiedEmailUsers,
      verifiedPhoneUsers
    });
  } catch (error) {
    next(new CustomError(error.message, error.status || 500));
  }
};