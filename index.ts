import { timing } from './perfdecorators';

class Users {
  private delay<T>(ms: number, value: T): Promise<T> {
    return new Promise((resolve) => setTimeout(() => resolve(value), ms));
  }

  @timing()
  async getUsers(): Promise<{ id: number; name: string; email: string }[]> {
    return await this.delay(2000, [
      {
        id: 1,
        name: 'Ahmed Moh',
        email: 'ahmed.moh@example.com',
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
      },
    ]);
  }

  @timing()
  async getUser(id: number): Promise<{ id: string }> {
    return await this.delay(1000, {
      id: `${id}`,
    });
  }
}

(async function () {
  const users = new Users();

  const user = await users.getUser(22);
  console.log(`User with ID 22 fetched: ${JSON.stringify(user)}`);

  const user42 = await users.getUser(42);
  console.log(`User with ID 42 fetched: ${JSON.stringify(user42)}`);

  const allUsers = await users.getUsers();
  allUsers.forEach((user, index) => {
    console.log(`User ${index + 1} fetched: ${JSON.stringify(user)}`);
  });
})();
