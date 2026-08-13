import { BaseApiService } from './base.service';

export class AuthService extends BaseApiService<any> {
  constructor() {
    super('/auth');
  }
  
  async login(credentials: any) {
    // Override or add specific endpoints
    return { success: true, token: 'placeholder_token' };
  }

  async logout() {
    return { success: true };
  }
}

export const authApi = new AuthService();
