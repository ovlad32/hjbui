import React, { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';

const columns = [
    {
        field: 'lake_column_name',
        headerName: 'Lake Column',
        width: 250,
        editable: false,
        sortable: true
    },
    {
        field: 'base_column_name',
        headerName: 'Base Column',
        width: 250,
        editable: false,
        sortable: true
    },
    {
        field: 'group_count',
        headerName: 'Group count',
        width: 120,
        editable: false,
        sortable: true
    },
    {
        field: 'cardinality_min',
        headerName: 'Cardinality, min',
        width: 130,
        editable: false,
        sortable: true
    }
    ,
    {
        field: 'cardinality_max',
        headerName: 'Cardinality, max',
        width: 130,
        editable: false,
        sortable: true
    }

];
let injectId = function (pairs) {
    return pairs.map(r => { r.id = r.lake_mtd_col_id + r.base_mtd_col_id; return r })
}
const PairTable = (props) => {
    const [pairs, setPairs] = useState([]);
    useEffect(() => {
        fetch("/pairs")
            .then((r) => r.json())
            .then((r) => setPairs(injectId(r)));
    }, []);
    return (
        <DataGrid rows={pairs} columns={columns} checboxSelection={true} disableSelectionOnClick/>
    );
};
export default PairTable;