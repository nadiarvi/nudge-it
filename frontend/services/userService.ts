// services/userService.ts
import axios from 'axios';
import notificationService from './notificationService';

/**
 * Register device for push notifications and save token to backend
 * This is called once when user logs in
 */
export async function registerPushToken(userId: string): Promise<void> {
  try {
    console.log('📱 Registering push notifications for user:', userId);
    
    // Step 1: Get push token from Expo
    const pushToken = await notificationService.registerForPushNotifications();
    
    if (!pushToken) {
      console.log('⚠️ Failed to get push token');
      return;
    }

    console.log('📤 Sending push token to backend...');
    console.log('Token:', pushToken);

    // Step 2: Send token to backend using PATCH
    const response = await axios.patch(
      `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/users/${userId}/token`,
      {
        pushToken: pushToken,
      }
    );

    if (response.status === 200) {
      console.log('✅ Push token saved to backend successfully');
    }
  } catch (error) {
    console.error('❌ Error registering push token:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response:', error.response?.data);
    }
  }
}

/**
 * Remove push token when user logs out (optional)
 */
export async function removePushToken(userId: string): Promise<void> {
  try {
    await axios.patch(
      `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/users/${userId}/token`,
      {
        token: null,
      }
    );
    console.log('✅ Push token removed from backend');
  } catch (error) {
    console.error('❌ Error removing push token:', error);
  }
}