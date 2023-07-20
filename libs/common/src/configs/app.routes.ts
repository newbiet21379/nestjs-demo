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
    sign_in: `/${usersRoot}/sign_in`
  },
  orders: {
    root: ordersRoot,
    delete: `/${ordersRoot}/:id`,
  },
};
