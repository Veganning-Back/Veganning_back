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