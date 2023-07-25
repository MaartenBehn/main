import { useState, useEffect } from 'react'
import { error } from 'console';

import "primereact/resources/primereact.min.css";  
import "primeflex/primeflex.css"
import "primereact/resources/themes/md-dark-indigo/theme.css"; 
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';  

import { ProgressBar } from 'primereact/progressbar';
import { ProgressSpinner } from 'primereact/progressspinner';

const { invoke } = window.__TAURI__.tauri;

function CentToEuro(cent) {
  const s = cent.toString()
  const cent_s = s.slice(-2)
  const euro_s = s.slice(0, -2)

  let result = ""
  let counter = 0
  for (let i = euro_s.length - 1; i > 0; i--) {
    if (counter != 0 && counter % 3 == 0){
      result = " "  + result
    }

    result = euro_s[i] + result

    counter++
  }
  result += "," + cent_s + "€"

  return result
}

function Loading() {
  return (
    <>
      <ProgressSpinner className='flex'/>
    </>
  )
}

function RenderAsync({promiseFn, fallback = Loading, render }) {
  const [state, setState] = useState(null);

  useEffect(() => {
    promiseFn()
      .then((response) => setState(response))
      .catch((error) => setState(null));
  }, [promiseFn]);

  if (state === null) {
    return fallback();
  }

  return render(state);
}

function BudgetList(budgets) { 
  function toPercent(ammount, fill) {
    return (fill / ammount) * 100 
  }

  return(
    <>
      <div>
        {budgets.map(budget => (
          <div className='flex flex-column surface-border border-solid border-round'>
            <div className='flex flex-row overflow-hidden mx-2 mt-1'>
              <div className=''>{budget.name}</div>
              <div className='flex-grow-1'></div>
              <div className=''>{CentToEuro(budget.ammount)}</div>
            </div>
            <div className='flex flex-row text-sm mx-2 mb-1'>
              <ProgressBar value={toPercent(budget.ammount, budget.fill)} className='flex-grow-1 mt-2 mr-2'/>
              <div className=''>{CentToEuro(budget.fill)}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function App() {
  console.log("Init UI")

  return (
    <PrimeReactProvider>
      <h1>Budget App</h1>

      <RenderAsync
        promiseFn={() => invoke("get_budgets")}
        render={BudgetList}
      />
    </PrimeReactProvider>
  )
}

export default App
