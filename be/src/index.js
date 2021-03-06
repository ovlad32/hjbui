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

app.get("/grps/:id/:mode", (req, res) => {
  try {
    console.log(req.params);

    db.all(
      `select 
        g.id as id,
        g.name as name,
        g.lake_agg_row_count,
        g.base_agg_row_count,
        g.agg_jnt_cardinality,
        g.jc_1, g.jc_2, g.jc_3, g.jc_4, g.jc_5,
        g.jc_6, g.jc_7, g.jc_8, g.jc_9, g.jc_10,
        j.id as grp_jnt_id,
        j.agg_cardinality,
        jc.side,
        c.column_name,
        c.mtd_tab_id
        from grps g
         inner join grp_jnts j on j.grp_id = g.id
         inner join grp_jnt_cols jc on jc.grp_jnt_id = j.id
         inner join mtd_cols c on c.id = jc.mtd_col_id
      where g.id = $id`,
      {
        $id: req.params.id,
      },
      (err, rows) => {
        if (err) throw err;
        switch (req.params.mode) {
          case "detailed":
            res.json(rows);
            break;
          default:
            if (rows.length) {
              res.json({
                id: rows[0].id,
                name: rows[0].name,
              });
              return;
            }
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

app.get('/pairs', (req, res) => {
  db.all(
    `select * from grp_pairs 
     order by 
       group_count, cardinality_max desc,
       lake_column_name, base_column_name`,
    (err, rows) => {
      if (err) throw err;
      res.json(rows)
      return;
    }
  )

});


app.listen(port, () => {
  console.log(`express listening at http://localhost:${port}`);
});
