async function main() {
  const url = "https://mixkit.co/free-stock-video/vertical/";
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });
  const html = await res.text();
  const regex = /https:\/\/assets\.mixkit\.co\/videos\/[^"'\s]+?\.(?:mp4|webm)/g;
  const matches = [...new Set(html.match(regex) || [])];
  console.log("Found matches:", matches.length);
  console.log(matches.slice(0, 10));
}

main().catch(console.error);
