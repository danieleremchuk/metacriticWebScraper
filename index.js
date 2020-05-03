const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const port = 4000;

app.listen(port, () => console.log(`listening at port ${port}`));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    const url = "https://www.metacritic.com/browse/albums/release-date/coming-soon/date";
    let data = [];
    axios.get(url).then((response) => {
        const $ = cheerio.load(response.data)
        let firstTr, secondTr, numRows, firstText, secondText;
        let musicData = [];
        $("tr.module").each(function (j) {
            if (j === 0) {
                firstTr = $(this)
                return firstTr
            }
            if (j === 1) {
                secondTr = $(this)
                return secondTr
            }
        })

        firstText = firstTr.text().trim()
        secondText = secondTr.text().trim()

        numRows = secondTr.index() - firstTr.index()

        $("table.musicTable").first().find("tr").each(async function (index) {
            let caption, id, artist, album, comment, header;
            let music = {};
            if ($(this).index() <= numRows - 1) {
                if ($(this).attr("class") === "module") {
                    id = $(this).index()
                    artist = $(this).text().trim();
                    album = "";
                    comment = "";
                } else {
                    id = $(this).index();
                    artist = $(this).find("td:nth-child(1)").text().trim();
                    album = $(this).find("td:nth-child(2)").text().trim();
                    comment = $(this).find("td:nth-child(3)").text().trim();
                }

                music.id = id;
                music.artistName = artist,
                music.albumName = album;
                music.comments = comment;

            } else {
                return;
            }

            await musicData.push(music);

            return musicData;

        })
        console.log(musicData);
        res.render("index", {music: musicData});
    })
})