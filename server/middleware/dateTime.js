
// get current Sri Lanka date only
const getCurrentSriLankanDate = () => {
    const currentDate = new Date();
    //const time = currentDate.toLocaleTimeString();//This give the GMT time. Need to add 5.30hours to convert to Sri Lankan time
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
};

// get current Sri Lanka date and time
const getCurrentSriLankanDateTime = () => {
    const currentDate = new Date();
    //const time = currentDate.toLocaleTimeString();//This give the GMT time. Need to add 5.30hours to convert to Sri Lankan time
    currentDate.setHours(currentDate.getHours() + 5);
    currentDate.setMinutes(currentDate.getMinutes() + 30);
    const updatedTime = currentDate.toLocaleTimeString(); //Sri lankan time

    const formattedDate = getCurrentSriLankanDate()+` ${updatedTime}`;
    return formattedDate;
};

// get current Sri Lanka time only
const getCurrentSriLankanTime = () => {
    const currentDate = new Date();
    //const time = currentDate.toLocaleTimeString();//This give the GMT time. Need to add 5.30hours to convert to Sri Lankan time
    currentDate.setHours(currentDate.getHours() + 5);
    currentDate.setMinutes(currentDate.getMinutes() + 30);
    const updatedTime = currentDate.toLocaleTimeString(); //Sri lankan time

    const formattedTime = `${updatedTime}`;
    return formattedTime;
};

module.exports = {
    getCurrentSriLankanDateTime,
    getCurrentSriLankanDate,
    getCurrentSriLankanTime
}