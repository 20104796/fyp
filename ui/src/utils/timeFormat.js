import dayjs from "dayjs";
export const toggleTime = (date) => {
    var time;
    var type = getDateDiff(date);
    // 1: New msg, 2: Today's msg, 3: Yesterday's msg, 4: This year's msg, 5: Other messages
    if (type == 1) {
        time = "Just now"; // New msg, no time displayed
    } else if (type == 2) {
        time = dayjs(date).format("H:mm"); // Today's msg, displayed as: 10:22
    } else if (type == 3) {
        time = dayjs(date).subtract(1, 'day').format("MMM D"); // Yesterday's msg, displayed with specific date: Mar 16
    } else if (type == 4) {
        time = dayjs(date).format("MMM D, h:mm A"); // This year's msg, morning/afternoon, displayed as: Mar 17, 4:45 PM
    } else if (type == 5) {
        time = dayjs(date).format("YYYY MMM D, h:mm A"); // Other messages, morning/afternoon, displayed as: 2020 Nov 2, 3:17 PM
    }
    return time;
}

export const toggleTime2 = (date) => {
    var time;
    var type = getDateDiff(date);
    // 1: New msg, 2: Today's msg, 3: Yesterday's msg, 4: This year's msg, 5: Other messages
    if (type == 1) {
        time = "Just now"; // New msg, no time displayed
    } else if (type == 2) {
        time = dayjs(date).format("H:mm"); // Today's msg, displayed as: 10:22
    } else if (type == 3) {
        time = "Yesterday"; // Yesterday's msg, displayed simply as: Yesterday
    } else if (type == 4) {
        time = dayjs(date).format("MMM D"); // This year's msg, displayed as: Mar 17
    } else if (type == 5) {
        time = dayjs(date).format("YYYY MMM D"); // Other messages, displayed as: 2020 Nov 2
    }
    return time;
}

// Determine msg type
const getDateDiff = (date) => {
    var nowDate = dayjs(new Date()); // Current time
    var oldDate = dayjs(new Date(date)); // Parameter time
    var result;
    if (nowDate.year() - oldDate.year() >= 1) {
        result = 5;
    } else if (
        nowDate.month() - oldDate.month() >= 1 ||
        nowDate.date() - oldDate.date() >= 2
    ) {
        result = 4;
    } else if (nowDate.date() - oldDate.date() >= 1) {
        result = 3;
    } else if (
        nowDate.hour() - oldDate.hour() >= 1 ||
        nowDate.minute() - oldDate.minute() >= 5
    ) {
        result = 2;
    } else {
        result = 1;
    }
    return result;
}
