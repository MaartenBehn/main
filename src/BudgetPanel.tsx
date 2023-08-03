import { useEffect, useState } from 'react';

import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

import { CentToEuro, AsyncRustRender, Loading } from './Utility';
import { InputNumber } from 'primereact/inputnumber';
import { useCounter, useUnmountEffect } from 'primereact/hooks';

const { invoke } = window.__TAURI__.tauri;

function Budget({budget}){
  if (budget.id != 0) {
    return (
      <div className='flex flex-column flex-grow-1 surface-border border-solid border-round'>
        <div className='flex flex-row overflow-hidden mx-2 mt-1'>
          <div className=''>{budget.name}</div>
          <div className='flex-grow-1'/>
          <div className=''>{CentToEuro(budget.ammount)}</div>
        </div>
        <div className='flex flex-row text-sm mx-2 mb-1'>
          <ProgressBar className='flex-grow-1 mt-2 mr-2' value={(budget.fille / budget.ammount) * 100}/>
          <div className=''>{CentToEuro(budget.fill)}</div>
        </div>
      </div>)
  }
}


function BudgetEdit({budget, Rerender}) {
  const [_budget, setBudget] = useState(budget);

  function editBudget(new_budget){
    invoke("edit_budget", {"budget": new_budget}); 
    setBudget(new_budget);
    console.log("edit");
  }

  return (
    <div className='flex flex-row flex-grow-1'>
      <InputText className="p-inputtext-sm" 
        value={_budget.name}  onChange={(e) => {editBudget({..._budget, name: e.target.value })}}/>
      <div className='flex-grow-1'/>
      <InputNumber className="p-inputtext-sm" 
        mode="currency" currency="EUR" locale="de-DE"
        value={_budget.ammount / 100} onChange={(e) => {editBudget({..._budget, ammount: e.value * 100 })}}/>
      <Button className='max-w-1rem max-h-1rem ml-2' icon="pi pi-delete-left" rounded 
        onClick={() => {
          invoke("remove_budget", {"id": _budget.id}); 
          Rerender();
          }}/>
    </div>
  )
}

function BudgetAdd({Rerender}) {
  const [budget, setBudget] = useState({ "name" : "", "ammount": 0 });

  return (
    <div className='flex flex-row align-items-center'>
      <InputText className="p-inputtext-sm" value={budget.name}  onChange={(e) => {setBudget({...budget, name: e.target.value})}}/>
      <div className='flex-grow-1'/>
      <InputNumber className="p-inputtext-sm" 
        mode="currency" currency="EUR" locale="de-DE"
        value={budget.ammount / 100} onChange={(e) => {setBudget({...budget, ammount: e.value * 100})}}/>
      <Button className='max-w-1rem max-h-1rem ml-2' icon="pi pi-check" rounded 
        onClick={() => {
          invoke("add_budget", {"name": budget.name, "ammount": budget.ammount});
          Rerender();
          }}/>
    </div> 
  )
}

export function BudgetPanel() {
  const [rerender, setRerender] = useState(0);
  const [budgets, setBudgets] = useState(null)
  const [edit, setEdit] = useState(false);

  function Rerender(){
    setBudgets(null)
    setRerender(rerender + 1)
  }

  useEffect(() => {
    console.log("Loading Budgets")

    invoke("get_budgets")
    .then((r) => setBudgets(r));
  }, [rerender]);

  if (budgets === null) {
    return Loading();
  }

  return(
    <>
      <div className='flex align-items-center'>
        <h1 className='flex-grow-1'>Budgets</h1>
        <Button className='max-h-3rem' icon="pi pi-user-edit" rounded onClick={() => {setEdit(!edit); Rerender();}}/>
      </div>

      <div>
        {budgets.map(budget => (
          <div> 
            {budget.id != 0 ? 
              <>{!edit ? 
                <Budget budget={budget}/> :
                <BudgetEdit budget={budget} Rerender={Rerender} />
              }</> : <></> }
          </div>
        ))}
        
        {edit ? <BudgetAdd Rerender={Rerender}/> : <></> }
      </div>
    </>
  )
}
