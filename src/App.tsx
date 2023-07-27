import "primereact/resources/primereact.min.css";  
import "primeflex/primeflex.css"
import "primereact/resources/themes/md-dark-indigo/theme.css"; 
import { PrimeReactProvider, PrimeReactContext, addLocale } from 'primereact/api';  
   

import { BudgetPanel } from "./BudgetPanel";
import { AccountPanel } from "./AccountPanel";

function App() {
  addLocale('de', {
    firstDayOfWeek: 1,
});

  return (
    <PrimeReactProvider>
      <BudgetPanel/>
      <AccountPanel/>
    </PrimeReactProvider>
  )
}

export default App
