/**
 * gets the full time object from a firebase timestamp
 * @param fbdate firebase timestamp
 * @returns  {year,month,quarter,week,day,dateObj} month is not 0 indexed, its 1-12
 */
export const getTimeFromFirebaseTimeStamp = (fbdate) => {

    let d = fbdate.toDate();//firebase funciton

    var yearStart = +new Date(d.getFullYear(), 0, 1);
    var today = +new Date(d.getFullYear(), d.getMonth(), d.getDate());
    var dayOfYear = ((today - yearStart + 1) / 86400000);

    let week = Math.ceil(dayOfYear / 7).toString();
    let month = d.getMonth() + 1;
    let quarter = (Math.ceil(month / 3));
    let year = d.getFullYear();
    let day = d.getDate();

    return {
        week: parseInt(week),
        month: month,
        year: year,
        quarter: quarter,
        day: day,
        timestamp: d
    }
}
/**
 * gets the full time object from a date object
 * @param d date obj
 * @returns  {year,month,quarter,week,day,dateObj} month is not 0 indexed, its 1-12
 */

export const getTimeFromDateTimestamp = (d: Date) => {

    var yearStart = +new Date(d.getFullYear(), 0, 1);
    var today = +new Date(d.getFullYear(), d.getMonth(), d.getDate());
    var dayOfYear = ((today - yearStart + 1) / 86400000);

    let week = Math.ceil(dayOfYear / 7).toString();
    let month = d.getMonth() + 1;
    let quarter = (Math.ceil(month / 3));
    let year = d.getFullYear();
    let day = d.getDate();

    return {
        week: parseInt(week),
        month: month,
        year: year,
        quarter: quarter,
        day: day,
        timestamp: d
    }
}

/**
 * Subtracts t1 from t1 and returns the difference in minutes (t2- t1)
 * @param t1 firebase timestamp object
 * @param t1 fireabse timestamp object
 * @returns {Number} difference of t2 - t1 in minutes
 */
export const getTimeDifferenceFirebaseInMins = function (t1, t2) {

    //t2 - t1 in mins
    try {
        let d1 = t1.toDate().getTime();
        let d2 = t2.toDate().getTime();
        let diff = (d2 - d1) / 1000;
        diff /= 60;

        return Math.abs(Math.round(diff));//mins -> this way we can break it down into days easily if needed

    } catch (error) {
        console.log('error during timecalc', error);
        throw error;
    }
}

/**
 * Subtracts t1 from t1 and returns the difference in minutes (t2- t1)
 * @param t1 date timestamp object
 * @param t1 date timestamp object
 * @returns {Number} difference of t2 - t1 in minutes
 */
export const getTimeDifferenceDateInMins = function (t1, t2) {

    //t2 - t1 in mins
    let t = new Date();
    t.getTime()
    try {
        let d1 = (new Date(t1)).getTime();
        let d2 = (new Date(t2)).getTime();
        let diff = (d2 - d1) / 1000;
        diff /= 60;

        return Math.abs(Math.round(diff));//mins -> this way we can break it down into days easily if needed

    } catch (error) {
        console.log('error during timecalc', error);
        throw error;
    }
}

/**
 * Subtracts t1 from t1 and returns the difference in minutes (t2- t1)
 * @param year the year i.e. 1999
 * @param mon the month
 * @returns {dateStart,dateEnd,startTimeStamp,endTimeStamp} dateStart, dateEnd -> date objs, startTimeStamp,endTimeStamp -> {year,month,quarter,week,day,dateObj}
 */
export const getDateRangeMonth = (year, mon) => {
    if (typeof year !== 'number' || typeof mon !== 'number') {
        throw new Error('Both the year and hte month must be numeric');
    }
    if (mon < 1 || mon > 12) {
        throw new Error('invalid month: ' + mon)
    }

    let month = mon - 1; //0 index the month

    let start = new Date(year, month, 1, 0);
    let end = new Date(year, month + 1, 1, 0);

    return {
        dateStart: start,
        dateEnd: end,
        startTimeStamp: getTimeFromDateTimestamp(start),
        endTimeStamp: getTimeFromDateTimestamp(end)
    }
} 