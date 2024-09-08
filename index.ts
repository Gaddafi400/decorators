import { timing, logTimings } from './perfdecorators';

@logTimings
class Users {
  private delay<T>(ms: number, value: T): Promise<T> {
    return new Promise((resolve) => setTimeout(() => resolve(value), ms));
  }

  @timing('FastMethod', 30)
  async getUsers(): Promise<{ id: number; name: string; email: string }[]> {
    return await this.delay(1000, [
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

  @timing('SlowMethod', 50)
  async getUser(id: number): Promise<{ id: string }> {
    return await this.delay(3000, {
      id: `${id}`,
    });
  }
}

(async function () {
  const users = new Users();

  const allUsers = await users.getUsers();
  allUsers.forEach((user, index) => {
    console.log(`User ${index + 1} fetched: ${JSON.stringify(user)}`);
  });

  const user = await users.getUser(22);
  console.log(`User with ID 22 fetched: ${JSON.stringify(user)}`);

  const user42 = await users.getUser(42);
  console.log(`User with ID 42 fetched: ${JSON.stringify(user42)}`);

  // @ts-ignore
  console.log(`User timings array ${users.__timings['key']}`);

  // @ts-ignore
  users.addTiming('key1', 10);
  // @ts-ignore
  users.addTiming('key2', 20);
  // @ts-ignore
  users.addTiming('key3', 30);
  // @ts-ignore
  users.addTiming('key4', 15);

  // @ts-ignore
  console.log(users.getAverageTiming('key'));
  // @ts-ignore
  users.logAllTimings();
})();
