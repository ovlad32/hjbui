import React, { useState } from 'react'

const joints = [
    {
        "Z0": {
            "cardinality": 100,
            "lake-column": {
                "column-name": "ID",
            }
        }

    }

];

const AppContainer = (props) => {
    return (<>
        {joints.map(j => <p>j</p>)}
    </>
    )

}

export default AppContainer