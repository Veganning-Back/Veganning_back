//(3.1.1 / 3.1.2 / 3.1.3)
export const recommendRecipesResponseDTO = (todayDate, data) => {
    // 랜덤으로 추천 레시피 중 하나 선택
    const randomIndex = Math.floor(Math.random() * data.recommend.length);
    const recipe = data.recommend[randomIndex];

    // 레시피 데이터 형식 변환
    const formattedRecipe = {
        recipe_id: recipe.id,
        recipe_name: recipe.name,
        image: recipe.image,
        user_name: data.user.name,
        date: todayDate,
        d_day: data.user.d_plus_day
    };

    return {
        status: "SUCCESS",
        data: [formattedRecipe] // 배열로 반환
    };
};


// (3.1.4)세이브닝 개수가 가장 많은 4개의 식당 정보 리턴
export const showHotStoresResponseDTO = (storeData) => {
    const hotStores = []; //

   

    for(let i=0; i < 4; i++){
        
        hotStores.push({
            "id": storeData[i].id,
            "name" : storeData[i].name,
            "address": storeData[i].address,
            "open": storeData[i].open,
            "rating": storeData[i].rating,
            "isOpen": storeData[i].isOpen,   //open테이블 조인해서 요일판별후 해당구간에 시간
            "image": storeData[i].image

        })
    }

//                 객체배열
    return {data : hotStores};
}


