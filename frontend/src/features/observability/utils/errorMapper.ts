export const ErrorMapper = {
  formatError: (error: any): Error => {
    if (error instanceof Error) {
      return error;
    }
    if (typeof error === 'string') {
      return new Error(error);
    }
    return new Error(JSON.stringify(error));
  },

  isNetworkError: (error: any): boolean => {
    return error.name === 'NetworkError' || error.message.includes('network');
  },
};
