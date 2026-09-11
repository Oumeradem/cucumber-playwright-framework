import { faker } from '@faker-js/faker';

export interface UserData {
  readonly username: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
}

/**
 * Test data factory for registering unique users per scenario.
 * Deterministic when the seed is fixed; random otherwise.
 */
export function generateUser(seed?: number): UserData {
  if (seed !== undefined) {
    faker.seed(seed);
  }
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return {
    username: faker.internet.username({ firstName, lastName }).toLowerCase(),
    email: faker.internet.email({ firstName, lastName }),
    firstName,
    lastName,
  };
}
