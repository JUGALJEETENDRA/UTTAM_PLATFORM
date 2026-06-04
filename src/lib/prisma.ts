// Universal stub to allow unmigrated pages to compile without Prisma types
const handler = {
  get: function(target: any, prop: string) {
    if (prop === 'then') return undefined; // so async/await doesn't treat the proxy itself as a Promise
    return new Proxy(async () => null, handler);
  },
  apply: async function() {
    return null;
  }
};

export const prisma: any = new Proxy({}, handler);
