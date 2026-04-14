import * as AppleAuthentication from 'expo-apple-authentication';
import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import ENV from '@/core/common/constants/env';
import { mapAxiosErrorToAppError } from '@/core/common/error';
import { IAuth } from '@/features/auth/auth.interface';
import axios from 'axios';
import { AppleAuthRequest, AuthResponse, GoogleAuthRequest } from '@/features/auth/auth.dto';
import { IUser } from '@/features/user/user.interface';
import { mapAuthResponseToAuth } from '@/features/auth/auth.mapper';
import { customAxios } from '@/core/common/network/custom-axios';

const PATH = '/auth';
const BASE_URL = ENV.BASE_URL;

export const AuthenticationService = {
  loginApple: async (): Promise<IAuth> => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const request: AppleAuthRequest = {
        identityToken: credential.identityToken as string,
        fullName: {
          givenName: credential.fullName?.givenName as string,
          familyName: credential.fullName?.familyName as string,
        },
        email: credential.email as string,
      };

      const response = await axios.post<AuthResponse>(`${BASE_URL}${PATH}/apple`, request);
      return mapAuthResponseToAuth(response.data);
    } catch (error) {
      console.log('Apple Sign-In error:', error);
      throw mapAxiosErrorToAppError(error);
    }
  },
  loginGoogle: async (): Promise<IAuth> => {
    GoogleSignin.configure({
      iosClientId: ENV.IOS_CLIENT_ID,
    });
    try {
      await GoogleSignin.hasPlayServices();
      const googleAuthResponse = await GoogleSignin.signIn();

      const request: GoogleAuthRequest = {
        idToken: googleAuthResponse?.data?.idToken as string,
      };

      const response = await axios.post<AuthResponse>(`${BASE_URL}${PATH}/google`, request);
      return mapAuthResponseToAuth(response.data);
    } catch (error) {
      console.log('Google Sign-In error:', error);
      const createErrorObj = (message: string) => ({
        status: 400,
        error: {
          code: 400,
          message,
        },
      });
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            const errorObj1 = createErrorObj('Sign-in is already in progress');
            throw mapAxiosErrorToAppError(errorObj1);
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            const errorObj2 = createErrorObj('Google Play Services not available or outdated');
            throw mapAxiosErrorToAppError(errorObj2);
          case statusCodes.SIGN_IN_CANCELLED:
            const errorObj3 = createErrorObj('Sign-in was cancelled by the user');
            throw mapAxiosErrorToAppError(errorObj3);
          default:
            const errorObj4 = createErrorObj('Google sign-in failed');
            throw mapAxiosErrorToAppError(errorObj4);
        }
      } else {
        throw mapAxiosErrorToAppError(error);
      }
    }
  },
  getCurrentUser: async (): Promise<IUser> => {
    try {
      const response = await customAxios.get(`${PATH}/me`);
      return response.data;
    } catch (error: unknown) {
      throw mapAxiosErrorToAppError(error);
    }
  },
  logOut: async (): Promise<void> => {
    try {
      await customAxios.post(`${PATH}/logout`);
    } catch (error: unknown) {
      throw mapAxiosErrorToAppError(error);
    }
  },
};
