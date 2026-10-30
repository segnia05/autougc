async function fetchFromCategory(category) {
  const url = `https://mixkit.co/free-stock-video/${category}/`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    const html = await res.text();
    const regex = /https:\/\/assets\.mixkit\.co\/videos\/(\d+)\/\1-360\.mp4/g;
    const ids = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
      ids.push(match[1]);
    }
    return [...new Set(ids)];
  } catch (err) {
    console.error("Error for category", category, err.message);
    return [];
  }
}

async function main() {
  const categories = ["vertical", "selfie", "vlogger", "workspace", "computer", "influencer"];
  for (const cat of categories) {
    const ids = await fetchFromCategory(cat);
    console.log(`Category [${cat}]: found ${ids.length} videos:`, ids.slice(0, 5));
  }
}

main();
