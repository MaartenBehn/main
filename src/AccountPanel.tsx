import { CentToEuro, Loading } from './Utility';

import { useEffect, useState } from 'react';

import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { useUnmountEffect } from 'primereact/hooks';

const { invoke } = window.__TAURI__.tauri;

function Entry({entry}){
  return (
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
  )
}


function EntryEdit({entry, budgets}){
  const [name, setName] = useState(entry.name);
  const [ammount, setAmmount] = useState(entry.ammount);
  const [note, setNote] = useState(entry.note);
  const [date, setDate] = useState(new Date(entry.date));
  const [budget, setBudget] = useState(entry.budget);
  
  useUnmountEffect(() => {
    entry.name = name;
    entry.ammount = ammount;
    entry.note = note;
    entry.date = date.toISOString();
    entry.budget = budget;
    console.log(name);

    invoke("edit_entry", {entry: entry }); 
  });

  return (
    <div className='flex flex-column surface-border border-solid border-round'>
      <div className='flex flex-row overflow-hidden mx-2 mt-1'>

        <InputText 
          value={name} 
          onChange={(e) => {setName(e.target.value)}}/>

        <div className='flex-grow-1'/>

        <InputNumber 
          mode="currency" 
          currency="EUR" 
          locale="de-DE" 
          value={ammount / 100} 
          onValueChange={(e) => {setAmmount(e.value * 100)}}/>

      </div>
      <div className='flex flex-row text-sm mx-2 mb-1'>

        <InputText 
          className='flex-grow-1' 
          value={note} 
          onChange={(e) => {setNote(e.target.value)}}/>

      </div>
      <div className='flex flex-row text-sm mx-2 mb-1'>

        <Calendar 
          showIcon 
          showButtonBar 
          locale="de"
          value={date} />

        <Dropdown 
          options={budgets} 
          optionValue="id"
          optionLabel="name"
          value={budget} onChange={(e) => {setBudget(e.value)}}
          placeholder="Select a Budget" 
          className="w-full md:w-14rem"/>

      </div>
    </div>
  )
}

export function AccountPanel() { 
  const [rerender, setRerender] = useState(0);
  const [entries, setEntries] = useState(null)
  const [budgets, setBudgets] = useState(null)
  const [edit, setEdit] = useState(false);

  function Rerender(){
    setRerender(rerender + 1);
  }

  useEffect(() => {
    invoke("get_entries")
    .then((r) => setEntries(r));
  }, [rerender]);

  useEffect(() => {
    invoke("get_budgets")
    .then((r) => setBudgets(r));
  }, [rerender]);

  if (entries === null || budgets === null) {
      return Loading();
  }

  function editClicked(){
    setEdit(!edit);
  }

  function removeEntry(id){
    invoke("delete_entry", {id: id});
    Rerender();
  }


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
      <div className='flex align-items-center'>
        <h1 className='flex-grow-1'>Entries</h1>
        <Button className='max-h-3rem' icon="pi pi-user-edit" rounded onClick={editClicked}/>
      </div>
      <div>
        {entries.map(entry => (
          <>
            {add_date(entry)}
            {!edit ? 
              <Entry entry={entry} /> : 
              <div className='flex flex-column'>
                  <EntryEdit entry={entry} budgets={budgets} />
                  <Button icon="pi pi-delete-left" rounded 
                      onClick={() => {removeEntry(entry.id)}}/>
              </div>
            }
            
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
  const [budget, setBudget] = useState(data[0].name);
  
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
          value={budget} onChange={(e) => setBudget(e.value)}
          placeholder="Select a Budget" className="w-full md:w-14rem"/>
      </div>

      <Button label="Submit" icon="pi pi-check" onClick={() => {
        console.log(ammount)
        console.log(name)
        console.log(note)
        console.log(date)
        console.log(budget)
      }}/>
    </div>
  )
}