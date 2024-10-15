import Papa from 'papaparse';

function safeParseDate(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}

export function processData(csvContent) {
  const { data } = Papa.parse(csvContent, { header: true });

  const shopData = new Map();
  let totalShops = 0;
  let closedShops = 0;
  let clearedShops = 0;
  let activeNotClearedShops = 0;

  data.forEach(row => {
    const shopName = row['店铺名'];
    if (!shopData.has(shopName)) {
      shopData.set(shopName, {
        totalClues: 0,
        downClues: 0,
        isClosed: row['店铺状态（是否还存在,1表示还开着2,0表示关店了）'] === '0',
        allCluesDown: true
      });
      totalShops++;
    }

    const shop = shopData.get(shopName);
    shop.totalClues++;
    if (row['线索是否下架'] === '已下架') {
      shop.downClues++;
    } else {
      shop.allCluesDown = false;
    }
  });

  shopData.forEach(shop => {
    if (shop.isClosed) {
      closedShops++;
    } else if (shop.allCluesDown && shop.totalClues > 0) {
      clearedShops++;
    } else {
      activeNotClearedShops++;
    }
  });

  const shopStatusData = [
    { name: '关闭店铺', value: closedShops },
    { name: '已清空店铺', value: clearedShops },
    { name: '活跃未清空店铺', value: activeNotClearedShops }
  ];

  // Calculate top 10 shops by clue count (excluding closed shops)
  const top10Shops = Array.from(shopData.entries())
      .filter(([_, shop]) => !shop.isClosed)
      .sort((a, b) => b[1].totalClues - a[1].totalClues)
      .slice(0, 10)
      .map(([shopName, data]) => ({
        shopName,
        totalClues: data.totalClues,
        downClues: data.downClues,
        processingRate: data.totalClues > 0 ? data.downClues / data.totalClues : 0
      }));

  return {
    totalShops,
    closedShops,
    clearedShops,
    activeNotClearedShops,
    shopStatusData,
    top10Shops
  };
}