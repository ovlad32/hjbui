import React, { useEffect, useState } from "react";
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { Checkbox, FormControlLabel, Typography, Card, CardHeader, CardContent, Grid, Container } from "@mui/material";


/*
              {j.baseColumns.map((c) => (
                <FormControlLabel key={c}
                label={c}
                control={
                  <Checkbox/> 
                }
                />
              )}*/
const jmap = (jntRows) => {
  console.log(jntRows);
  let jntMap = jntRows.reduce((jntMap, row) => {
    if (!jntMap[row.grp_jnt_id])
      jntMap[row.grp_jnt_id] = {
        jntId: row.grp_jnt_id,
        cardinality: row.agg_cardinality,
        lakeColumns: [],
        baseColumns: [],
      };
    if (row.side === "L") {
      jntMap[row.grp_jnt_id].lakeColumns.push(row.column_name);
    } else {
      jntMap[row.grp_jnt_id].baseColumns.push(row.column_name);
    }
    return jntMap;
  }, {});

  let jnts = Object.values(jntMap);
  jnts.forEach((j) => {
    j.lakeColumns.sort();
    j.baseColumns.sort();
  });

  jnts.sort((j1, j2) => {
    let c1 = parseInt(j1.cardinality);
    let c2 = parseInt(j2.cardinality);
    if (c1 < c2) {
      return 1;
    } else if (c2 > c1) {
      return -1;
    }
    return j1.lakeColumns[0].localeCompare(j2.lakeColumns[0], "en", {
      sensitivity: "case",
    });
  });
  if (jntRows.length) {
    let r = {
      jnts: jnts,
      grpId: jntRows[0].grp_id,
      lakeRowCount: jntRows[0].lake_agg_row_count,
      baseRowCount: jntRows[0].lake_agg_row_count,
      cardinality: jntRows[0].agg_jnt_cardinality,
    };
    console.log(r);
    return r;
  }
  return {};
};

const AppContainer = (props) => {
  const [grp, setGrp] = useState([]);
  useEffect(() => {
    fetch("/grps/1/detailed")
      .then((r) => r.json())
      .then((r) => setGrp(jmap(r)));
  }, []);
  return (
    <>
      <Grid container direction="column"  >
        {grp.jnts?.map((j) => (
          <Grid key={j.jntId} container justifyContent="center" spacing={2}>
            <Grid item xs={4}>
              <Grid container direction="column" >
                {j.lakeColumns.map((c) => (
                  <Grid item key={c}>
                    <FormControlLabel
                      label={c}
                      control={<Checkbox />}
                    />
                  </Grid>))}
              </Grid>
            </Grid>
            <Grid item xs={4}>
              <Grid container direction="column" >
                {j.baseColumns.map((c) => (
                  <Grid item key={c}>
                    <FormControlLabel
                      label={c}
                      control={<Checkbox />}
                    />
                  </Grid>))}
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </>
  );
};
export default AppContainer;
