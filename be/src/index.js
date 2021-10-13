var express = require("express");
var sqlite = require("sqlite3");

var app = express();
var db = new sqlite.Database("./src/hjb.db3", sqlite.OPEN_READONLY);
const port = 3001;

app.get("/grps", (req, res) => {
  db.all(`select * from grps`, (err, rows) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    var grps = [];
    rows.forEach((row) => grps.push(row));
    res.json(grps);
  });
});

app.get("/grps/:id", (req, res) => {
  try {
    console.log(req.params);

    var grp = {};

    sqlite.all(
      `select * from grps where id = $id`,
      {
        $id: req.params.id,
      },
      (err, rows) => {
        if (err) throw err;
        rows.forEach((row) => {
          grp = { ...row };
          grp.jnts = [];
          sqlite.all(
            "select * from grp_jnts where grp_id = $grpId",
            {
              $grpId: row.id,
            },
            (err, rows) => {
              if (err) throw err;
              rows.forEach((row) => {
                console.log(row);
                grp.jnts.push({ ...row });
              });
            }
          );
        });
      }
    );
    console.log(grp);
    res.json(grp);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
