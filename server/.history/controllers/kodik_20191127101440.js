const puppeteer = require("puppeteer");
const _request = require("request");

const getLinks = async request => {
  return await new Promise((resolve, reject) => {
    let interval = setInterval(() => {
      if (!request || !request.response()) return;

      clearInterval(interval);

      request
        .response()
        .json()
        .then(json => resolve(json.links))
        .catch(err => reject(err));
    }, 200);
  });
};

const formateUrl = request => {
  var episode = request.params.episode;
  var link = request.params.link;
  var season = request.params.season;
  console.log(link);
  return `${link}?season=${season}&episode=${episode}&only_episode=true`; // http:
};

const parsePage = async html => {
  const browser = await puppeteer.launch({
    executablePath:
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
  });

  const page = await browser.newPage();

  await page.setContent(html);

  await page.setRequestInterception(true);

  let finalRequest;

  page.on("request", request => {
    if (request.url() === "http://kodik.info/video-links")
      finalRequest = request;

    request.continue();
  });

  await page.click("iframe");

  const links = await getLinks(finalRequest);

  let count = Object.keys(links).length - 1;
  let src = links[Object.keys(links)[count]][0]["src"];

  await browser.close();
  return src;
};

exports.get_link = async function(request, res) {
  // Формирую ссылку для iframe
  const frameUrl = formateUrl(request);

  // Создаём псевдо html
  let html = `<iframe src="${frameUrl}" width="200" height="200"></iframe>`;
  console.log(html);

  let src = await parsePage(html);
  url = src.split(":")[0] + ":" + src.split(":")[1];
  console.log(src);
  console.log(url);
  res.redirect(url);
};

const animeList = body => {
  let getJson = JSON.parse(body)["results"];

  //console.log(getJson); // Print the HTML for the Google homepage.

  let list = "";
  if (getJson) {
    list += `<items>\n`;
    getJson.forEach(function(item, i, arr) {
      if (!item["last_episode"]) item["last_episode"] = 1;
      list += `<channel>\n`;
      list += `<title> ${item["title"]} / ${item["title_orig"]} </title>\n`;
      const encoded = encodeURIComponent(`http:${item["link"]}`);
      list += `<playlist_url>http://animeargus.ddns.net:3000/list/${encoded}/${item["last_episode"]}/${item["last_season"]} </playlist_url>\n`;
      list += `<description>\n`;
      list += `<div style='font-size:24px'>\n`;

      if (item["material_data"] && item["material_data"]["poster_url"])
        list += `<img style='float:left' width=200 height=auto src='${item["material_data"]["poster_url"]} '>\n`;
      list += `<span style='color:#89A5BF;  '> ${item["title"]} <br></span>\n`;

      if (item["material_data"] && item["material_data"]["genres"]) {
        let genre = item["material_data"]["genres"].join(", ");
        list += `<span style='color:gold;  '>Жанр:  ${genre}  <br></span>\n`;
      }
      list += `<span style='color:gold;  '>Год:  ${item["year"]}  <br></span>\n`;
      list += `<span style='color:gold;  '>Эпизодов:  ${item["last_episode"]} / ${item["episodes_count"]} <br></span>\n`;
      list += `<span style='color:gold;  '>Посл.эпизод: ${item["updated_at"]} <br></span>\n`;
      list += `<span style='color:gold;  '>Dubbing: ${item["translation"]["title"]} <br></span>\n`;

      if (item["material_data"] && item["material_data"]["description"]) {
        list += `<span style='color:white;'> ${item["material_data"]["description"]}</span>\n`;
      }

      list += `</div>\n`;

      list += `</description>\n`;

      if (item["material_data"] && item["material_data"]["poster_url"])
        list += `<logo_30x30> ${item["material_data"]["poster_url"]}</logo_30x30>\n`;
      list += `</channel>\n`;
    });
    list += `</items>\n`;
  }
  return list;
};

exports.search = function(request, res) {
  let urls = new URL("http://animeargus.ddns.net:3000/" + request.url);
  let title = encodeURIComponent(urls.searchParams.get("search"));
  let params = urls.search.replace("?", "&");

  let token = "f20af586686a913f6f5b8f2f8454bb5b";
  let url = "";
  console.log(title);
  if (title != "null")
    url = `https://kodikapi.com/search?token=${token}&title=${title}${params}`;
  else url = `https://kodikapi.com/list?token=${token}&title=${title}${params}`;

  //console.log(url);

  _request(url, function(error, response, body) {
    //console.log("error:", error); // Print the error if one occurred
    //console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received

    let list = animeList(body);
    res.send(list);
    // res.send("<pre>" + list + "<pre>");
  });
};

exports.list = function(request, res) {
  let link = encodeURIComponent(request.params.link);
  let count = request.params.count;
  let season = request.params.season;
  let list = "";

  list += `<items>\n`;
  for (let i = 1; i <= count; i++) {
    list += `<channel>\n`;
    list += `<title>  <![CDATA[Серия: ${i} ]]>   </title>\n`;
    list += `<stream_url>http://animeargus.ddns.net:3000/get_link/${link}/${i}/${season}</stream_url>\n`;
    list += `<description> </description>\n`;
    list += `<logo_30x30> </logo_30x30>\n`;
    list += `</channel>\n`;
  }
  list += `</items>\n`;
  res.send(list);
};
