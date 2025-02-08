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

    const holidayLines = holidayData.map(item => `${item.date}，星期${item.week}：放假。 (${item.description})`).join('\n');
    const workdayLines = workdayData.map(item => `${item.date}，星期${item.week}：補上班。 (${item.description})`).join('\n');

    const allLines = `${holidayLines}\n${workdayLines}`;
    console.log(allLines);

    // 顯示在網頁上
    // const pre = document.createElement('pre');
    // pre.textContent = allLines;
    // document.body.appendChild(pre);

    // 產生 txt 並觸發下載
    const blob = new Blob([allLines], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentYear}年平日假期與補上班日期.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });