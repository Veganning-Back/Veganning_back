export const UserDTO = (user) => {
    return {
        userId: user.userId,
        target_carb: user.target_carb,
        target_protein: user.target_protein,
        target_fat: user.target_fat,
        target_cal: user.target_cal
    };
};
