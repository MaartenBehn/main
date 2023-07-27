import { ProgressBar } from 'primereact/progressbar';

import { CentToEuro, AsyncRustCall } from './Utility';

function BudgetList({data}) { 
  function toPercent(ammount, fill) {
    return (fill / ammount) * 100 
  }

  return(
    <>
      <div>
        {data.map(budget => (
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

export function BudgetPanel() {
    return (
        <>
          <h1>Budgets</h1>
    
          <AsyncRustCall
            fn_name="get_budgets"
            Render={BudgetList}
          />
        </>
      )
}