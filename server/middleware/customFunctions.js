function calculateDaysLeft(endDate) {
    const oneDay = 24 * 60 * 60 * 1000;
    const today = new Date();
    const end = new Date(endDate);
    let daysLeft = Math.round((end - today) / oneDay);
    daysLeft = Math.max(daysLeft, 0);
    return daysLeft;
}

module.exports = { calculateDaysLeft };