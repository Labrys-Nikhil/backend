const moment = require('moment-timezone');


async function calculatePagination(total, currentPage, pageSize) {
    var pageDetails = [];
    const totalPages = Math.ceil((total / pageSize));
    const pageStartResult = (currentPage - 1) * pageSize + 1;
    const pageEndResult = Math.min(currentPage * pageSize, total);
    pageDetails.push({ pageSize, currentPage, totalPages, total, pageStartResult, pageEndResult });
    return pageDetails[0];
}

async function filterTransactionsByDate(date) {
    try {
        console.log("date", date)
        const currentDate = moment();
        let startDate, endDate;
        switch (date) {
            case 'today':
                startDate = moment(currentDate).startOf('day');
                endDate = moment(currentDate).endOf('day');
                break;
            case 'yesterday':
                startDate = moment(currentDate).subtract(1, 'day').startOf('day');
                endDate = moment(currentDate).subtract(1, 'day').endOf('day');
                break;
            case '7days':
                startDate = moment(currentDate).subtract(7, 'days').startOf('day');
                endDate = moment(currentDate).endOf('day');
                break;
            case '1month':
                startDate = moment(currentDate).subtract(1, 'month').startOf('day');
                endDate = moment(currentDate).endOf('day');
                break;
            case '3months':
                startDate = moment(currentDate).subtract(3, 'months').startOf('day');
                endDate = moment(currentDate).endOf('day');
                break;
            case '6months':
                startDate = moment(currentDate).subtract(6, 'months').startOf('day');
                endDate = moment(currentDate).endOf('day');
                break;
            default:
                throw new Error('Invalid filter');
        }

        // Return the start and end dates for the selected range
        return { startDate, endDate };
    } catch (error) {
        return error;
    }
}


module.exports = {
    calculatePagination,
    filterTransactionsByDate
}