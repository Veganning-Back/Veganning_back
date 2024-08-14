import { modifyRecipeDB } from "../models/recipeModify.model.js"
export const modifyRecipe = async (req, res) => {
  try {
    const recipeId = parseInt(req.params.recipeId);
    const { recipeData, ingredients, cookingSteps } = req.body;

    const updatedRecipe = await modifyRecipeDB(
      recipeId,
      recipeData,
      ingredients,
      cookingSteps
    );

    if (!updatedRecipe) {
      return res.status(404).json({ message: "레시피를 찾을 수 없습니다." });
    }

    res.status(200).json({
      message: "레시피가 성공적으로 업데이트되었습니다.",
      data: updatedRecipe,
    });
  } catch (error) {
    console.error("레시피 업데이트 중 오류 발생:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};
