import axios from 'axios';
import User from '../models/user.model.js';
import CustomError from '../utils/CustomError.js';

// You should store this in an environment variable
const ADDRESS_SERVICE_URL = 'http://localhost:3001/api'; // adjust port as needed

export const createUser = async (req, res, next) => {
  try {
    const { addressData, ...userData } = req.body;
    
    // First create the user
    const user = new User(userData);
    await user.save();

    // If address data is provided, create address in the address service
    if (addressData) {
      try {
        // Add the user ID to the address data
        const addressPayload = {
          ...addressData,
          userId: user.id // Using the virtual 'id' field we defined
        };

        // Create address in the address service
        await axios.post(`${ADDRESS_SERVICE_URL}/addresses`, addressPayload);
        
        // Note: We don't need to update the user with the address ID
        // since the address service maintains the relationship via userId
      } catch (error) {
        // If address creation fails, we should delete the user we just created
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
    
    // Optionally, if you need to include address information
    // you could fetch addresses for all users here
    try {
      const addressesResponse = await axios.get(`${ADDRESS_SERVICE_URL}/addresses/addresses`);
      const addresses = addressesResponse.data;
      
      // Map addresses to users
      const usersWithAddresses = users.map(user => {
        const userAddress = addresses.find(addr => addr.userId === user.id);
        return {
          ...user.toJSON(),
          address: userAddress || null
        };
      });
      
      res.status(200).json(usersWithAddresses);
    } catch (error) {
      // If address service is down, return users without addresses
      console.error('Failed to fetch addresses:', error.message);
      res.status(200).json(users);
    }
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};

export const assignAddressToUser = async (req, res, next) => {
  try {
    const { userId, addressId } = req.params;

    // First verify the user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError('User not found', 404);
    }

    // Then verify and update the address in the address service
    try {
      await axios.patch(`${ADDRESS_SERVICE_URL}/addresses/${addressId}`, {
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