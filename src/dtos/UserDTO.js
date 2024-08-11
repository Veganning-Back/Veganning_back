// 사용자 정보를 클라이언트로 전송하기 위한 DTO
export const UserDTO = (user) => {
    return {
        userId: user.userId,
        target_carb: user.target_carb,
        target_protein: user.target_protein,
        target_fat: user.target_fat,
        target_cal: user.target_cal
    };
};
