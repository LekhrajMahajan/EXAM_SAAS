import { http, HttpResponse } from 'msw';

export const authHandlers = [
  http.post('*/auth/login', () => {
    return HttpResponse.json({
      success: true,
      data: {
        accessToken: 'mocked_access_token',
        refreshToken: 'mocked_refresh_token',
        expiresIn: 3600,
        user: {
          id: 'user_123',
          name: 'Test User',
          email: 'test@examguard.com',
          role: 'Master Admin'
        }
      }
    });
  }),
  
  http.post('*/auth/logout', () => {
    return HttpResponse.json({ success: true });
  })
];
