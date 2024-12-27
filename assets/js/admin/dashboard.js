//  toshow new date
function displayCurrentDay() {
    const today = new Date();

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
   const dayOfWeek = daysOfWeek[today.getDay()];

    const dayOfMonth = today.getDate();
   const month = today.getMonth() + 1;  
   const year = today.getFullYear();
   const formattedDate = `${month}/${dayOfMonth}/${year}`;

    const currentDayElement = document.getElementById("currentDay");
   currentDayElement.textContent = `Today's Day: ${dayOfWeek}, Date: ${formattedDate}`;
}
window.onload = displayCurrentDay;
// //////////////////////////////////////////////////////////////////

