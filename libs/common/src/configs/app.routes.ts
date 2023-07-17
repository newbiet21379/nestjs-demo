// Root
const usersRoot = 'users';
const ordersRoot = 'orders';

// Api Versions
const v1 = 'v1';

export const routesV1 = {
  version: v1,
  user: {
    root: usersRoot,
    delete: `/${usersRoot}/:id`,
  },
  orders: {
    root: ordersRoot,
    delete: `/${ordersRoot}/:id`,
  },
};
