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


function BudgetEdit({_budget}) {
  const [budget, setBudget] = useState(_budget);

  console.log(budget)

  useUnmountEffect(() => {
    console.log(budget)
    invoke("edit_budget", { budget: budget });
  });

  return (
    <div className='flex flex-row flex-grow-1'>
      <InputText className="p-inputtext-sm" 
        value={budget.name}  onChange={(e) => setBudget({...budget, ...{name: e.target.value}})}/>
      <div className='flex-grow-1'/>
      <InputNumber className="p-inputtext-sm" 
        mode="currency" currency="EUR" locale="de-DE"
        value={budget.ammount / 100} onChange={(e) => setBudget({...budget, ...{amount: e.value * 100}})}/>
    </div>
  )
}

export function BudgetPanel() {
  const [rerender, setRerender] = useState(0);
  const [budgets, setBudgets] = useState(null)
  const [edit, setEdit] = useState(false);

  function Rerender(){
    setRerender(rerender + 1);
  }

  useEffect(() => {
    invoke("get_budgets")
    .then((r) => setBudgets(r));
  }, [rerender]);

  if (budgets === null) {
      return Loading();
  }

  function editClicked(){
    setEdit(!edit);
  }

  function addBudget(name, ammount){
    invoke("add_budget", {name: name, ammount: ammount});
    setNewBudgetName("");
    setNewBudgetAmmount(0);
    Rerender();
  }

  function removeBudget(id){
    invoke("delete_budget", {id: id});
    Rerender();
  }

  return(
    <>
      <div className='flex align-items-center'>
        <h1 className='flex-grow-1'>Budgets</h1>
        <Button className='max-h-3rem' icon="pi pi-user-edit" rounded onClick={editClicked}/>
      </div>

      <div>
        {budgets.map(budget => (
          <div> 
            {budget.id != 0 ? 
              <>{!edit ? 
                <Budget budget={budget}/> :
                <div className='flex flex-row align-items-center'>
                  <BudgetEdit _budget={budget}/>
                  <Button className='max-w-1rem max-h-1rem ml-2' icon="pi pi-delete-left" rounded 
                      onClick={() => {removeBudget(budget.id)}}/>
                </div>
              }</> : <></> }
          </div>
        ))}
        
        {edit ? 
        <div className='flex flex-row align-items-center'>
          <InputText className="p-inputtext-sm" 
              value={newBudgetName}  onChange={(e) => {setNewBudgetName(e.target.value)}}/>
            <div className='flex-grow-1'/>
            <InputNumber className="p-inputtext-sm" 
              mode="currency" currency="EUR" locale="de-DE"
              value={newBudgetAmmount / 100} onChange={(e) => {setNewBudgetAmmount(e.value * 100)}}/>
            <Button className='max-w-1rem max-h-1rem ml-2' icon="pi pi-check" rounded 
              onClick={() => {addBudget(newBudgetName, newBudgetAmmount)}}/>
        </div> : <></> }
      </div>
    </>
  )
}
