let users = [];

export const addUser = (user) => {
  users.push(user);

  return user;
};

export const getActiveUsers = () => users;

export const disconnectUser = (id) => {
  users = users.filter((u) => u.id !== id);
};
