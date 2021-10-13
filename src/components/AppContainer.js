import React, { useState } from 'react'

const joints = [
    {
        cardinality:100,
        lake:[
            "ID","CURRENCY","COLLATERAL_VALUE"
        ],
        base:["CURRENCY_CODE","INFORMER_ID"],

    }
];

const AppContainer = (props) => {
    return (<>
        {joints.map(j => <p>j</p>)}
    </>
    )

}

export default AppContainer