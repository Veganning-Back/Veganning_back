export const DailyRecordDTO = (record) => {
    return {
        id: record.id,
        date: record.date,
        today_meal: record.today_meal,
        today_carbs: record.today_carbs,
        today_protein: record.today_protein,
        today_fat: record.today_fat,
        calorie: record.calorie,
        stamp: record.stamp
    };
};
