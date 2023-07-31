import { CentToEuro, AsyncRustRender } from './Utility';

import { useState } from 'react';

import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';


function AccountList({data}) { 
  let last_date = ""

  function add_date(entry) {
    if (entry.date !== last_date) {
      last_date = entry.date
      return (
        <>
          <div className=''>{entry.date}</div>
        </>)
    }
    <></>
  }

  return(
    <>
      <div>
        {data.map(entry => (
          <>
            {add_date(entry)}
            <div className='flex flex-column surface-border border-solid border-round'>
              <div className='flex flex-row overflow-hidden mx-2 mt-1'>
                <div className=''>{entry.name}</div>
                <div className='flex-grow-1'></div>
                <div className=''>{CentToEuro(entry.ammount)}</div>
              </div>
              <div className='flex flex-row text-sm mx-2 mb-1'>
                <div className=''>{entry.note}</div>
                <div className='flex-grow-1'></div>
                <div className=''>{entry.budget_name}</div>
              </div>
            </div>
          </>
        ))}
      </div>
    </>
  )
}

export function AddEntry({data}) {
  const [ammount, setAmmount] = useState(null);
  const [name, setName] = useState(null);
  const [note, setNote] = useState(null);
  const [date, setDate] = useState(null);
  const [to_budget, setToBudget] = useState(data[0].name);
  
  return(
    <div className="flex flex-column gap-2">
      <h1>Add Entry</h1>

      <div className="flex flex-column gap-2 m-1">
        <label htmlFor="Ammount">Ammount</label>
        <InputNumber mode="currency" currency="EUR" locale="de-DE"
        value={ammount} onValueChange={(e) => setAmmount(e.value)}/>
      </div>
      
      <div className="flex flex-column gap-2 m-1">
        <label htmlFor="Name">Name</label>
        <InputText value={name} onChange={(e) => setName(e.target.value)}/>
      </div>

      <div className="flex flex-column gap-2 m-1">
        <label htmlFor="Note">Note</label>
        <InputText value={note} onChange={(e) => setNote(e.target.value)}/>
      </div>

      <div className="flex flex-column gap-2 m-1">
        <label htmlFor="Date">Date</label>
        <Calendar showIcon showButtonBar locale="de"
         value={date} onChange={(e) => setDate(e.value)} />
      </div>

      <div className="flex flex-column gap-2 m-1">
        <label htmlFor="To Budget">To Budget</label>
        <Dropdown options={data} optionLabel="name" 
          value={to_budget} onChange={(e) => setToBudget(e.value)}
          placeholder="Select a Budget" className="w-full md:w-14rem"/>
      </div>

      <Button label="Submit" icon="pi pi-check" onClick={() => {
        console.log(ammount)
        console.log(name)
        console.log(note)
        console.log(date)
        console.log(to_budget)
      }}/>
    </div>
  )
}

export function AccountPanel() {
    return (
        <>
          <h1>Entries</h1>

          <AsyncRustRender
            fn_name="get_entries"
            Render={AccountList}
          />
          <AsyncRustRender
            fn_name="get_budgets"
            Render={AddEntry}
          />
          
        </>
      )
}