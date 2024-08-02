// 영업 중인지 확인하는 함수
export const isStoreOpen = (openTime, closeTime) => {
    const now = new Date();
    const [openHour, openMinute] = openTime.split(':').map(Number);
    const [closeHour, closeMinute] = closeTime.split(':').map(Number);

    const openDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), openHour, openMinute);
    const closeDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), closeHour, closeMinute);

    return now >= openDate && now <= closeDate;
}

// 요일에 따라 적절한 열 이름 선택
export const getOpenCloseColumns = (day) => {
    switch(day) {
        case 0: return { open: 'sun_open', close: 'sun_close' };
        case 1: return { open: 'mon_open', close: 'mon_close' };
        case 2: return { open: 'tue_open', close: 'tue_close' };
        case 3: return { open: 'wed_open', close: 'wed_close' };
        case 4: return { open: 'thu_open', close: 'thu_close' };
        case 5: return { open: 'fri_open', close: 'fri_close' };
        case 6: return { open: 'sat_open', close: 'sat_close' };
        default: return { open: 'mon_open', close: 'mon_close' };
    }
}