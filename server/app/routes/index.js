// routes/index.js

const asyncHandler = require("express-async-handler");
const noteRoutes = require("./note_routes");

// Требующиеся модули контроллеров.
const {
    searchController,
    listController,
    getLinkController,
    apiSearch,
    apiSearchId,
    apiGetLinks,
    ApiGetAnimeById,
    apiFranchise,
    apiList,
    apiListTop,
    kinoposk
} = require("../../controllers/kodik");

const {
    searchLink,
    serialsAdd,
} = require("../../controllers/search");


module.exports = function (app, db) {
    noteRoutes(app, db);

    /*  app.use(function timeLog(req, res, next) {
      let time = new Date();
      let timeEp =
        time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();

      console.log("Time: ", timeEp);

      if (req["headers"]["origin"] != "http://obovse.ru") next();
      else {
        console.log("telek");
        res.send("die");
      }
    });*/
    app.get("/", (request, response) => {
        response.render("home", {
            name: "John"
        });
    });

    app.get(
        "/get_link/:link/:id/:episode/:season",
        asyncHandler(getLinkController)
    );
    app.get("/search/", searchController);
    app.get("/list/:link/:id/:count/:season", listController);
    app.get("/kinoposk/:kinoposkID", kinoposk);

    app.get("/api-list/", apiList);
    app.get("/api-list-top", apiListTop);
    app.get("/api-search/:name", apiSearch);
    app.get("/api-search-id/:shikimori_id", apiSearchId);
    app.get("/api-serial-id/:serial_id", ApiGetAnimeById);
    app.get("/api-get-url/:serial_id/:season/:episode", apiGetLinks);
    app.get("/api-franchise/:serial_id", apiFranchise);

    app.get("/api-search-link/:name", searchLink);
    app.get("/api-db-update/", serialsAdd);
};
