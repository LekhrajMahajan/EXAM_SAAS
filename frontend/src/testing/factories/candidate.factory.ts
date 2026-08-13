/**
 * Placeholder Candidate Factory.
 * Generates repeatable mock candidate data for unit tests and MSW responses.
 */
export const CandidateFactory = {
  create: (overrides?: any) => ({
    id: `candidate_${Math.random().toString(36).substring(7)}`,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    rollNumber: 'ROLL-12345',
    status: 'Active',
    ...overrides
  }),
  
  createList: (count: number, overrides?: any) => {
    return Array.from({ length: count }).map(() => CandidateFactory.create(overrides));
  }
};
