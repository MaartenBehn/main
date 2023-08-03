import { useState } from 'react';

import "primereact/resources/primereact.min.css";  
import "primeflex/primeflex.css"
import "primereact/resources/themes/md-dark-indigo/theme.css"; 
import 'primeicons/primeicons.css';

import { PrimeReactProvider, PrimeReactContext, addLocale } from 'primereact/api';  
import { TabMenu } from 'primereact/tabmenu';

import SwipeableViews from 'react-swipeable-views';
import { bindKeyboard } from 'react-swipeable-views-utils';

import { BudgetPanel } from "./BudgetPanel";
import { AccountPanel } from "./AccountPanel";

function App() {
  addLocale('de', {
    "startsWith": "Beginnt mit",
    "contains": "Enthält",
    "notContains": "Enthält nicht",
    "endsWith": "Endet mit",
    "equals": "Ist gleich",
    "notEquals": "Ist ungleich",
    "noFilter": "Kein Filter",
    "filter": "Filtern",
    "lt": "Kleiner als",
    "lte": "Kleiner oder gleich",
    "gt": "Größer als",
    "gte": "Größer oder gleich",
    "dateIs": "Datum ist",
    "dateIsNot": "Datum ist nicht",
    "dateBefore": "Datum ist vor",
    "dateAfter": "Datum ist nach",
    "custom": "Benutzerdefiniert",
    "clear": "Löschen",
    "apply": "Übernehmen",
    "matchAll": "Passt auf alle",
    "matchAny": "Passt auf einige",
    "addRule": "Regel hinzufügen",
    "removeRule": "Regel entfernen",
    "accept": "Ja",
    "reject": "Nein",
    "choose": "Auswählen",
    "upload": "Hochladen",
    "cancel": "Abbrechen",
    "completed": "Abgeschlossen",
    "pending": "Ausstehend",
    "dayNames": ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
    "dayNamesShort": ["Son", "Mon", "Die", "Mit", "Don", "Fre", "Sam"],
    "dayNamesMin": ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
    "monthNames": ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
    "monthNamesShort": ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
    "chooseYear": "Jahr wählen",
    "chooseMonth": "Monat wählen",
    "chooseDate": "Datum wählen",
    "prevDecade": "Vorheriges Jahrzehnt",
    "nextDecade": "Nächstes Jahrzehnt",
    "prevYear": "Vorheriges Jahr",
    "nextYear": "Nächstes Jahr",
    "prevMonth": "Vorheriger Monat",
    "nextMonth": "Nächster Monat",
    "prevHour": "Vorherige Stunde",
    "nextHour": "Nächste Stunde",
    "prevMinute": "Vorherige Minute",
    "nextMinute": "Nächste Minute",
    "prevSecond": "Vorherige Sekunde",
    "nextSecond": "Nächste Sekunde",
    "am": "am",
    "pm": "pm",
    "today": "Heute",
    "weekHeader": "KW",
    "firstDayOfWeek": 1,
    "showMonthAfterYear": false,
    "dateFormat": "dd.mm.yy",
    "weak": "Schwach",
    "medium": "Mittel",
    "strong": "Stark",
    "passwordPrompt": "Passwort eingeben",
    "emptyFilterMessage": "Keine Ergebnisse gefunden",
    "searchMessage": "{0} Ergebnisse verfügbar",
    "selectionMessage": "{0} Elemente ausgewählt",
    "emptySelectionMessage": "Kein ausgewähltes Element",
    "emptySearchMessage": "Keine Ergebnisse gefunden",
    "emptyMessage": "Keine Einträge gefunden",
    "aria": {
        "trueLabel": "Wahr",
        "falseLabel": "Falsch",
        "nullLabel": "Nicht ausgewählt",
        "star": "1 Stern",
        "stars": "{star} Sterne",
        "selectAll": "Alle Elemente ausgewählt",
        "unselectAll": "Alle Elemente abgewählt",
        "close": "Schließen",
        "previous": "Vorherige",
        "next": "Nächste",
        "navigation": "Navigation",
        "scrollTop": "Nach oben scrollen",
        "moveTop": "Zum Anfang bewegen",
        "moveUp": "Nach oben bewegen",
        "moveDown": "Nach unten bewegen",
        "moveBottom": "Zum Ende bewegen",
        "moveToTarget": "Zum Ziel bewegen",
        "moveToSource": "Zur Quelle bewegen",
        "moveAllToTarget": "Alle zum Ziel bewegen",
        "moveAllToSource": "Alle zur Quelle bewegen",
        "pageLabel": "{page}",
        "firstPageLabel": "Erste Seite",
        "lastPageLabel": "Letzte Seite",
        "nextPageLabel": "Nächste Seite",
        "previousPageLabel": "Vorherige Seite",
        "rowsPerPageLabel": "Zeilen pro Seite",
        "jumpToPageDropdownLabel": "Zum Dropdown-Menü springen",
        "jumpToPageInputLabel": "Zum Eingabefeld springen",
        "selectRow": "Zeile ausgewählt",
        "unselectRow": "Zeile abgewählt",
        "expandRow": "Zeile erweitert",
        "collapseRow": "Zeile reduziert",
        "showFilterMenu": "Filtermenü anzeigen",
        "hideFilterMenu": "Filtermenü ausblenden",
        "filterOperator": "Filteroperator",
        "filterConstraint": "Filterbeschränkung",
        "editRow": "Zeile bearbeiten",
        "saveEdit": "Änderungen speichern",
        "cancelEdit": "Änderungen abbrechen",
        "listView": "Listenansicht",
        "gridView": "Rasteransicht",
        "slide": "Folie",
        "slideNumber": "{slideNumber}",
        "zoomImage": "Bild vergrößern",
        "zoomIn": "Vergrößern",
        "zoomOut": "Verkleinern",
        "rotateRight": "Nach rechts drehen",
        "rotateLeft": "Nach links drehen"
    }
});

  const [activeIndex, setActiveIndex] = useState(0);

  const panelItems = [
    {label: 'Bugets'},
    {label: 'Account'}
  ];

  const BindKeyboardSwipeableViews = bindKeyboard(SwipeableViews);
  function setIndex(index){
    setActiveIndex(index)
  }

  return (
    <PrimeReactProvider>
      <BindKeyboardSwipeableViews index={activeIndex} onChangeIndex={(e) => setIndex(e.index)}>
        <BudgetPanel/>
        <AccountPanel/>
      </BindKeyboardSwipeableViews>
      <TabMenu id="menu" className='fixed bottom-0 surface-ground border-round'
          model={panelItems} activeIndex={activeIndex} onTabChange={(e) => setIndex(e.index)}/>
    </PrimeReactProvider>
  )
}

export default App
