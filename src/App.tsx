import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { error } from 'console';

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

function RenderAsync({promiseFn, fallback = "", render }) {
  const [state, setState] = useState(null);

  useEffect(() => {
    promiseFn()
      .then((response) => setState(response))
      .catch((error) => setState(null));
  }, [promiseFn]);

  if (state === null) {
    return fallback;
  }

  return render(state);
}

function BudgetList(budgets) { 
  console.log(budgets)

  return(
    <>
      <ul className="budget-list" list-style-type:none>
        {budgets.map(budget => (
          <li className='budget-item'>
            <div className='budget-item-top'>
              <div className='inline-start'>{budget.name}</div>
              <div className='inline-end'>{CentToEuro(budget.ammount)}</div>
            </div>
            <div className='budget-item-bottom'>
              <div className='inline-start'>{budget.name}</div>
              <div className='inline-end'>awfolh</div>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}

function App() {
  console.log("Init UI")

  return (
    <>
      <h1>Budget App</h1>

      <RenderAsync
        promiseFn={() => invoke("get_budgets")}
        fallback="loading..."
        render= {BudgetList}
      />
    </>
  )
}

export default App
