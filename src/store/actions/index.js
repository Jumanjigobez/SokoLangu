export const sessionAdd = (user) => {
    return {
        type: "ADDED_SESSION",
        payload: {
            loggedIn: 1, // Ensures the user is marked as logged in
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            role: user.role,
            status: user.status,
        },
    };
};

export const menuOpen = (value) => {
    return {
        type: "CHANGED",
        value: value,
    };
};
