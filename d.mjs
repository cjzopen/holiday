import fetch from 'node-fetch';
import fs from 'fs';

const currentYear = new Date().getFullYear();
const url = `https://cdn.jsdelivr.net/gh/ruyut/TaiwanCalendar/data/${currentYear}.json`;

fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(jsonData => {
    const holidayData = jsonData.filter(item => 
      ['一', '二', '三', '四', '五'].includes(item.week) && item.isHoliday === true
    );
    const workdayData = jsonData.filter(item => 
      ['六', '日'].includes(item.week) && item.isHoliday === false
    );

    const holidayLines = holidayData.map(item => `${item.date}，星期${item.week}：放假。`).join('\n');
    const workdayLines = workdayData.map(item => `${item.date}，星期${item.week}：補上班。`).join('\n');

    const allLines = `${holidayLines}\n${workdayLines}`;
    fs.writeFileSync('a.txt', allLines, 'utf8');
    console.log('Data has been written to a.txt');
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });