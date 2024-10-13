import Papa from 'papaparse';

function safeParseDate(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}

function daysBetween(date1, date2) {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  return Math.round(Math.abs((date1 - date2) / oneDay));
}

export function processData(csvContent) {
  const { data } = Papa.parse(csvContent, { header: true });

  const monthlyData = new Map();
  const uniqueShops = new Set();
  let previousMonthShops = new Set();

  // 首先，按月份排序数据
  data.sort((a, b) => {
    const dateA = safeParseDate(a['线索入库时间']);
    const dateB = safeParseDate(b['线索入库时间']);
    return dateA && dateB ? dateA - dateB : 0;
  });

  let isFirstMonth = true;
  let currentMonth = '';

  data.forEach(row => {
    const clueDate = safeParseDate(row['线索入库时间']);
    const registerDate = safeParseDate(row['开店时间']);

    if (clueDate && row['店铺名']) {
      const month = clueDate.toISOString().slice(0, 7);

      if (month !== currentMonth) {
        // 新的月份开始
        if (!isFirstMonth) {
          // 更新前一个月的店铺集合
          previousMonthShops = new Set([...previousMonthShops, ...monthlyData.get(currentMonth).allShops]);
        }
        currentMonth = month;
        isFirstMonth = false;
      }

      if (!monthlyData.has(month)) {
        monthlyData.set(month, {
          newShops: new Set(),
          oldShops: new Set(),
          newShopsAccordingToRegisterTime: new Set(),
          oldShopsAccordingToRegisterTime: new Set(),
          allShops: new Set(),
          activeClues: 0,
          totalClues: 0
        });
      }

      const monthData = monthlyData.get(month);
      monthData.totalClues++;

      if (row['线索是否下架'] === '未下架') {
        monthData.activeClues++;
      }

      if (!monthData.allShops.has(row['店铺名'])) {
        monthData.allShops.add(row['店铺名']);
        uniqueShops.add(row['店铺名']);

        if (previousMonthShops.has(row['店铺名'])) {
          monthData.oldShops.add(row['店铺名']);
        } else {
          monthData.newShops.add(row['店铺名']);
        }

        // 根据注册时间计算新老店铺
        if (registerDate && daysBetween(clueDate, registerDate) > 30) {
          monthData.oldShopsAccordingToRegisterTime.add(row['店铺名']);
        } else {
          monthData.newShopsAccordingToRegisterTime.add(row['店铺名']);
        }
      }
    }
  });

  let cumulativeActiveClues = 0;

  const processedData = Array.from(monthlyData.entries()).map(([month, data]) => {
    const newShopsCount = data.newShops.size;
    const oldShopsCount = data.oldShops.size;
    const totalShops = newShopsCount + oldShopsCount;
    const newShopsRatio = totalShops > 0 ? newShopsCount / totalShops : 0;
    const oldShopsRatio = totalShops > 0 ? oldShopsCount / totalShops : 0;

    const newShopsCountAccordingToRegisterTime = data.newShopsAccordingToRegisterTime.size;
    const oldShopsCountAccordingToRegisterTime = data.oldShopsAccordingToRegisterTime.size;
    const totalShopsAccordingToRegisterTime = newShopsCountAccordingToRegisterTime + oldShopsCountAccordingToRegisterTime;
    const newShopsRatioAccordingToRegisterTime = totalShopsAccordingToRegisterTime > 0 ? newShopsCountAccordingToRegisterTime / totalShopsAccordingToRegisterTime : 0;
    const oldShopsRatioAccordingToRegisterTime = totalShopsAccordingToRegisterTime > 0 ? oldShopsCountAccordingToRegisterTime / totalShopsAccordingToRegisterTime : 0;

    cumulativeActiveClues += data.activeClues;
    const avgActiveCluesPerShop = totalShops > 0 ? cumulativeActiveClues / totalShops : 0;

    return {
      month,
      newShopsCount,
      oldShopsCount,
      newShopsRatio,
      oldShopsRatio,
      newShopsRatioAccordingToRegisterTime,
      oldShopsRatioAccordingToRegisterTime,
      totalShops,
      avgActiveCluesPerShop
    };
  }).sort((a, b) => a.month.localeCompare(b.month));

  // 计算最新的店铺运营状态
  const latestMonth = processedData[processedData.length - 1].month;
  const latestMonthData = monthlyData.get(latestMonth);
  const activeShops = latestMonthData.allShops.size;
  const closedShops = uniqueShops.size - activeShops;

  const pieChartData = [
    { name: '运营中店铺', value: activeShops },
    { name: '关闭店铺', value: closedShops }
  ];

  return { processedData, pieChartData, totalUniqueShops: uniqueShops.size };
}