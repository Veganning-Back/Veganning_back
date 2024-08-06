export const hotStoreListDTO = (nextCursorId, storeData, limit) => {
    const hotStores = [];
    const count = Math.min(storeData.length, limit);

    console.log(storeData);

    for (let i = 0; i < count; i++) {
        hotStores.push({
            "id": storeData[i].id,
            "name": storeData[i].name,
            "address": storeData[i].address,
            "open": storeData[i].open,
            "rating": storeData[i].rating,
            "isOpen": storeData[i].isOpen,   //open테이블 조인해서 요일판별후 해당구간에 시간
            "image": storeData[i].image
        });
    }

    return { data: hotStores, cursorId: nextCursorId };
};
