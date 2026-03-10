export const formatUserName = (user) => {
    if (!user) return 'Guest';
    return user.name || user.username || 'User';
};
