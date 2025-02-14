const userState = {
    loggedIn: 0,
    user_id: "",
    username: "",
    email: "",
    role: "",
    status: "",
};

export const SessionReducer = (state = userState, action) => {
    switch (action.type) {
        case "ADDED_SESSION":
            return {
                ...state, // Keep existing state
                loggedIn: 1,
                user_id: action.payload.user_id,
                username: action.payload.username,
                email: action.payload.email,
                role: action.payload.role,
                status: action.payload.status,
            };

        case "DELETED_SESSION":
            return {
                ...userState, // Reset to default state
            };

        default:
            return state;
    }
};
