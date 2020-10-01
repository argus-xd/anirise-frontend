/*const puppeteer = require("puppeteer");*/
const httpRequest = require("request");
const jschardet = require("jschardet");
const fetch = require("node-fetch");
const LocalStorage = require("node-localstorage").LocalStorage;
localStorage = new LocalStorage("./scratch");
require("dotenv").config();
const token = process.env.KODIK_AUTH_TOKEN;

const createFrameUrl = request => {
    const {episode, link, season} = request.params;

    return `${link}?season=${season}&episode=${episode}&only_episode=true`;
};

const getLinks = async (id, episode, season) => {
    /* console.log(id); */
    let json = await getAnimeById(id);
    /*   console.log(json); */
    let link = json["results"][0]["seasons"]
        ? json["results"][0]["seasons"][season]["episodes"][episode]
        : json["results"][0]["link"];

    /*
      http://animerise.ddns.net:3000/get_link/http%3A%2F%2Faniqit.com%2Fserial%2F4179%2F91d73ed3fa1c38f9da474c7b80ebfada%2F720p/serial-4179/1/1
   */
    /* let type = "seria"; //video */
    let type = link.split("/")[3] == "serial" ? "seria" : link.split("/")[3];
    let idSeria = link.split("/")[4];
    let hash = link.split("/")[5];

    console.log(type);
    console.log(idSeria);
    console.log(hash);

    let get = await fetch("http://aniqit.com/get-vid", {
        credentials: "include",
        headers: {
            accept: "application/json, text/javascript, */*; q=0.01",
            "accept-language":
                "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7,cy;q=0.6,und;q=0.5,sr;q=0.4",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "x-requested-with": "XMLHttpRequest"
        },
        referrerPolicy: "no-referrer-when-downgrade",
        body: `bad_user=true&hash2=OErmnYyYA4wHwOP&type=${type}&hash=${hash}&id=${idSeria}`,
        method: "POST",
        mode: "cors"
    });
    text = await get.text();
    text = await JSON.parse(text);
    return text["links"];
};

const apiGetLinks = async (request, res) => {
    let id = request.params.serial_id;
    let season = request.params.season;
    let episode = request.params.episode;

    let json = await getAnimeById(id);
    /*console.log(json);*/
    let link = json["results"][0]["seasons"]
        ? json["results"][0]["seasons"][season]["episodes"][episode]
        : json["results"][0]["link"];

    /* console.log(link);*/
    let type = "";
    let idSeria = "";
    let hash = "";
    if (link && link.length > 0) {
        type = link.split("/")[3] == "serial" ? "seria" : link.split("/")[3];
        idSeria = link.split("/")[4];
        hash = link.split("/")[5];
    } else {
        console.log("Чёт не пришло");
        res.send({message: "zero links"});
        return;
    }
    /*console.log(type);
    console.log(idSeria);
    console.log(hash);*/

    let get = await fetch("http://aniqit.com/get-vid", {
        credentials: "include",
        headers: {
            accept: "application/json, text/javascript, */*; q=0.01",
            "accept-language":
                "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7,cy;q=0.6,und;q=0.5,sr;q=0.4",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "x-requested-with": "XMLHttpRequest"
        },
        referrerPolicy: "no-referrer-when-downgrade",
        body: `bad_user=true&hash2=OErmnYyYA4wHwOP&type=${type}&hash=${hash}&id=${idSeria}`,
        method: "POST",
        mode: "cors"
    });
    text = await get.text();
    text = await JSON.parse(text);

    res.send(text["links"]);
};

const getLinkFromHtml = async html => {
    const browser = await puppeteer.launch({
        /*headless: false ,
            ignoreDefaultArgs: true, */

        executablePath:
            "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe" /*  */,
        args: [
            /*  "--disable-extensions-except=/me",*/
            /*    "--load-extension=/me",
                  "--user-data-dir=Argus\\AppData\\Local\\Chromium\\User Data\\Profile 1"  */
            /*    "--profile-directory=Dafault" */
        ]
    });

    const page = await browser.newPage();

    await page.setContent(html);

    await page.setRequestInterception(true);

    let getLinksFromRequest = new Promise((resolve, reject) => {
        let i = 0;
        page.on("request", request => {
            i++;
            if (request.url().indexOf("http://get.kodik") != -1) {
                /*  http://get.kodik-storage.com */

                resolve(request);
            }
            if (i > 100) {
                reject("miss url");
            }
            request.continue();
        });
        page.click("iframe");
    });

    const links = await getLinksFromRequest
        .then(r => {
            /*   console.log(r["_url"]); */
            return r["_url"];
        })
        .catch(r => {
            console.log(r);
        });

    await browser.close();
    return links;
};

const getAnimeById = async function (id) {
    const requestPage = "search";
    const url = `https://kodikapi.com/${requestPage}?token=${token}&id=${id}&with_episodes=true&with_material_data=true&episode=1`;
    /* console.log(url); */

    let promise = await fetch(url);

    let text = await promise.text();
    text = await JSON.parse(text);
    return text;
};

const apiSearchIdShiki = async function (shikimori_id) {
    const url = `https://kodikapi.com/search?token=${token}&shikimori_id=${shikimori_id}`;
    let promise = await fetch(url);
    let text = await promise.text();
    text = await JSON.parse(text);
    return text;
};

const ApiGetAnimeById = async (request, res) => {
    let serial_id = request.params.serial_id;
    const url = `https://kodikapi.com/search?token=${token}&id=${serial_id}&with_episodes=true&with_material_data=true&episode=1`;
    res.set({"content-type": "application/json; charset=utf-8"});
    httpRequest.get(url, (error, response, body) => res.end(body));
};
const kinoposk = async (request, res) => {
    const {id, kinoposkID} = request.params;
    const url = `https://kodikapi.com/search?token=${token}&kinopoisk_id=${kinoposkID}&with_episodes=true&with_material_data=true`;
    /* console.log(url);  */

    let promise = await fetch(url);

    let text = await promise.text();
    text = await JSON.parse(text);
    if (text && text["results"] && text["results"][0])
        res.redirect(text["results"][0]["material_data"]["poster_url"]);
};
const animeList = body => {
    if (!body) return "";

    const titlesList = JSON.parse(body)["results"];

    let list = `<items>\n`;

    for (const title of titlesList) {
        if (!title["last_episode"]) title["last_episode"] = 1;
        list += `<channel>\n
            <title> ${title["title"]} / ${title["title_orig"]} </title>\n`;
        const encoded = encodeURIComponent(`http:${title["link"]}`);
        list += `<playlist_url>http://animerise.ddns.net:3000/list/${encoded}/${
            title["id"]
        }/${title["last_episode"]}/${
            title["last_season"] ? title["last_season"] : 1
        } </playlist_url>\n`;
        list += `<description>\n`;
        list += `<div style='font-size:24px'>\n`;

        if (true)
            list += `<img style='float:left' width=200 height=auto src='http://animerise.ddns.net:3000/kinoposk/${title["kinopoisk_id"]}'>\n`;
        list += `<span style='color:#89A5BF;  '> ${title["title"]} </span><br>\n`;

        if (title["material_data"] && title["material_data"]["genres"]) {
            let genre = title["material_data"]["genres"].join(", ");
            list += `<span style='color:gold;  '>Жанр:  ${genre}  <br></span>\n`;
        }
        list += `<span style='color:gold;  '>Год:  ${title["year"]}  <br></span>\n`;
        list += `<span style='color:gold;  '>Эпизодов:  ${title["last_episode"]} / ${title["episodes_count"]} <br></span>\n`;
        list += `<span style='color:gold;  '>Посл.эпизод: ${title["updated_at"]} <br></span>\n`;
        list += `<span style='color:gold;  '>Dubbing: ${title["translation"]["title"]} <br></span>\n`;

        if (title["material_data"] && title["material_data"]["description"]) {
            list += `<span style='color:white;'> ${title["material_data"]["description"]}</span>\n`;
        }

        list += `</div>\n`;

        list += `</description>\n`;

        if (true)
            list += `<logo_30x30>http://animerise.ddns.net:3000/kinoposk/${title["kinopoisk_id"]}</logo_30x30>\n`;
        list += `</channel>\n`;
    }

    list += `</items>\n`;

    return list;
};

const getLinkController = async function (request, res) {
    const {id, episode, season} = request.params;
    const frameUrl = createFrameUrl(request);

    const html = `<iframe src="${frameUrl}" width="700" height="400"></iframe>`;

    /* const titleUrl = await getLinkFromHtml(html);

      const titleUrlMaxQuality = titleUrl.replace(["360.mp4"], ["720.mp4"]);
      */
    const titleUrl = await getLinks(id, episode, season);

    const lastElem = Object.keys(titleUrl)[Object.keys(titleUrl).length - 1];

    const titleUrlMaxQuality = titleUrl[lastElem][0]["src"];

    console.log(titleUrlMaxQuality);
    const redirectUrl = titleUrlMaxQuality.split(":hls:manifest.m3u8")[0];

    await (async () => {
        let promise = getAnimeById(id).then(r => {
            r = r["results"][0];
            let time = new Date();
            let timeEp =
                time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
            let title = `${timeEp} - ${r["title"]} {S-${r["last_season"]} E-${episode}}`;
            console.log(title); /*  */
        });
    })();

    res.redirect(redirectUrl);
};

const searchControllerJson = async function (findAnime) {
    searchTitleEncode = encodeURIComponent(findAnime);

    //const requestPage = request.query.search ? "search" : "list";
    const requestPage = "search";
    const url = `https://kodikapi.com/${requestPage}?token=${token}&title=${searchTitleEncode}`;
    /*  console.log(url); */
    let promise = await fetch(url);

    let text = await promise.text();
    text = await JSON.parse(text);

    return text;
};
const searchController = function (request, res, next) {
    /* console.log("\n\n\n"); */

    /*  console.log(
          `${request.query.search} ${request.query.box_hardware} ${request.query.box_user} ${request.query.lip} `
      ); */
    let searchTitle = request.query.search || "";

    /*  console.log(request._parsedUrl.query); */

    let searchTitleEncode = encodeURIComponent(searchTitle);

    let encoding = jschardet.detect(searchTitle);
    if (encoding["encoding"] == "ascii") {
        localStorage.setItem("searchTitleEncode", searchTitleEncode);
    }

    const requestPage = request.query.search ? "search" : "list";
    const url = `https://kodikapi.com/${requestPage}?token=${token}&title=${localStorage.getItem(
        "searchTitleEncode"
    )}&${request._parsedUrl.query}`;
    /*  console.log(url); */
    console.log(searchTitle);

    res.set({"content-type": "application/json; charset=utf-8"});
    httpRequest.get(url, (error, response, body) => res.end(animeList(body)));
};
const apiSearch = function (request, res, next) {
    let name = request.params.name;
    let searchTitle = name || "";
    let searchTitleEncode = encodeURIComponent(searchTitle);
    const requestPage = searchTitleEncode ? "search" : "list";
    const url = `https://kodikapi.com/${requestPage}?token=${token}&title=${searchTitleEncode}&types=anime-serial,anime&with_episodes=true&with_material_data=true`;
    /*  console.log(searchTitle);
    console.log(url);*/

    res.set({"content-type": "application/json; charset=utf-8"});
    httpRequest.get(url, (error, response, body) => res.end(body));
};

const apiFranchise = async function (request, res, next) {
    let serial_id = request.params.serial_id;
    const url = `https://shikimori.one/api/animes/${serial_id}/franchise`;
    res.set({"content-type": "application/json; charset=utf-8"});

    httpRequest.get(url, async (error, response, body) => {
        body = JSON.parse(body);

        const promises = Object.keys(body['nodes']).map(async function(key, index) {
            let id = body['nodes'][key].id;
            let inDBkodik = await apiSearchIdShiki(id).then(e=>{
                return e.total > 0;
            });
            body['nodes'][key].inBase = inDBkodik
        });
        await Promise.all(promises);

        let bodyNodes = JSON.stringify(body['nodes'].reverse());
        res.end(bodyNodes)
    });
};
const apiList = function (request, res, next) {
    const url = `https://kodikapi.com/list?token=${token}&types=anime-serial,anime&with_episodes=true&with_material_data=true&limit=100`;
    console.log(url);
    res.set({"content-type": "application/json; charset=utf-8"});
    httpRequest.get(url, (error, response, body) => res.end(body));
};
const apiListTop = function (request, res, next) {
    const url = `https://kodikapi.com/list?token=${token}&with_material_data=true&status=ongoing&shikimori_rating=7-10&limit=100`;
    console.log(url);
    res.set({"content-type": "application/json; charset=utf-8"});
    httpRequest.get(url, (error, response, body) => res.end(body));
};

const apiSearchId = function (request, res, next) {
    let shikimori_id = request.params.shikimori_id;
    const url = `https://kodikapi.com/search?token=${token}&shikimori_id=${shikimori_id}`;
    res.set({"content-type": "application/json; charset=utf-8"});
    httpRequest.get(url, (error, response, body) => res.end(body));
};

const listController = async (request, res) => {
    let link = encodeURIComponent(request.params.link);
    let count = request.params.count;
    let season = request.params.season;
    const getInfo = await getAnimeById(request.params.id).then(r => {
        return r["results"][0];
    });

    let kinopoisk_id = getInfo["kinopoisk_id"];
    let meterialData = getInfo["material_data"];
    let last_episode = getInfo["last_episode"] || 1;
    let episodes_count = getInfo["episodes_count"] || 1;

    /*  console.log(getInfo); */

    let list = "";
    list += `<items>\n`;
    let numSeasonsArr = getInfo["seasons"]
        ? Object.keys(getInfo["seasons"])
        : [0];

    numSeasonsArr.forEach(seasonsNum => {
        console.log(seasonsNum);
        last_episode = getInfo["seasons"]
            ? Object.values(getInfo["seasons"][seasonsNum]["episodes"]).length
            : "1";

        for (let i = 1; i <= last_episode; i++) {
            list += `<channel>\n`;
            list += `<title>  <![CDATA[Серия: ${i} ]]>   </title>\n`;
            list += `<stream_url>http://animerise.ddns.net:3000/get_link/${link}/${request.params.id}/${i}/${seasonsNum}</stream_url>\n`;
            try {
                list += `<description>
        <img style='float:left' width=200 height=auto src='http://animerise.ddns.net:3000/kinoposk/${kinopoisk_id}'>\n
        ${meterialData["title"]}/${meterialData["title_en"]} <br>
        Год: ${meterialData["year"]}    <br>
        Сезон : ${seasonsNum}  <br>
        Эпизодов : ${i} / ${episodes_count}<br>
        Длительность: ${meterialData["duration"]}    <br>
        Жанр: ${meterialData["genres"].join(", ")}    <br>
        Рейтинг Кинопоиск: ${meterialData["kinopoisk_rating"]}    <br>
        Рейтинг imdb: ${meterialData["imdb_rating"]}    <br>
        Описание: ${meterialData["description"]}    <br>
        
        </description>`;
            } catch (error) {
                list += `<description> ${error}
            </description>`;
            }

            list += `<logo_30x30> </logo_30x30>`;
            list += `</channel>`;
        }
    });
    list += `</items>\n`;

    res.send(list);
};

module.exports = {
    listController,
    searchController,
    searchControllerJson,
    apiSearch,
    apiSearchId,
    apiGetLinks,
    apiList,
    apiFranchise,
    apiListTop,
    ApiGetAnimeById,
    getLinkController,
    kinoposk
};
