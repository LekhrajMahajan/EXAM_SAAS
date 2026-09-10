const istDateString = "2026-08-24";
const hours = 11;
const minutes = 50;
const isoString = `${istDateString}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00+05:30`;
const dateObj = new Date(isoString);
const duration = 120;
const examEnd = new Date(dateObj.getTime() + duration * 60000);
const now = new Date(); // 13:39 IST
console.log("isoString", isoString);
console.log("dateObj", dateObj.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
console.log("examEnd", examEnd.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
console.log("now", now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
console.log("now >= examEnd:", now >= examEnd);
console.log("endStr:", examEnd.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true }));
