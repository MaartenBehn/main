import { useState, useEffect } from 'react'

import { ProgressSpinner } from 'primereact/progressspinner';

const { invoke } = window.__TAURI__.tauri;

export function CentToEuro(cent) {
    const s = cent.toString()
    const cent_s = s.slice(-2)
    const euro_s = s.slice(0, -2)

    let result = ""
    let counter = 0
    for (let i = euro_s.length - 1; i >= 0; i--) {
        if (counter != 0 && counter % 3 == 0){
        result = " "  + result
        }

        result = euro_s[i] + result

        counter++
    }
    result += "," + cent_s + "€"

    return result
}

export function Loading() {
    return (<ProgressSpinner className='flex'/>)
}
  
export function AsyncRustRender({fn_name, fallback = Loading, Render }) {
    const [state, setState] = useState(null);

    useEffect(() => {
        invoke(fn_name)
        .then((response) => setState(response))
        .catch(() => setState(null));
    }, []);

    if (state === null) {
        return fallback();
    }

    return <Render data={state}/>
}
