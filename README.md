# **Esercizio MemoryGame**
## Preambolo
In questo readme ho voluto descrivere a grandi linee le scelte fatte per il compimento della task.
## HOW TO START
Basterà eseguire il file start.sh e lo script tirerà su 4 containers per rispettivamente:
1. ambiente API
2. ambiente Frontend
3. mongoDB
4. mongodb-express (gestione web per mongoDB)

Una volta fatto, aprire il browser e andate su http://localhost/8080 e potrete giocare!

## Tecnologie usate
Per il backend ho scelto di usare NestJS (che ho approfondito proprio in occasione dell'esercizio!), per il frontend ho ripiegato su di un framework che conosco già, ovvero React: il codice è scritto in TypeScript.

Il database è un **MongoDB** hostato direttamente sul docker, con un volume esterno per assicurare la persistenza dei dati.

Nei docker frontend e backend invece viene, in primis, copiato il codice sorgente all'interno del sistema, dopodichè viene eseguita la build.
Una volta pronta la build vengono serviti.

## Com'è fatto il Backend

Il backend utilizza NestJS con piattaforma Express.
Ho previsto due controller principali:
1. il primo "UserController" è adibito a tutte le operazioni con gli utenti
2. il secondo "GameController" invece ha tutte rotte relative al gioco e la classifica

Non solo, l'app instanziata utilizza un connettore Mongoose per collegarsi al database.
Ho cercato di rendere ogni controller il più snello possibile e delegare le varie funzioni a degli appositi Service.

Ogni rotta ha la sua gestione delle exception personalizzata

## Com'è fatto il Frontend

Il frontend invece utilizza il framework React.

La webapp è divisa in 3 principali steps:
1. StepStart: l'utente inserisce il suo usernam
2. StepPlay: l'utente gioca
3. StepFinish: l'utente visualizza la classifica

Ho cercato di utilizzare più concetti possibili per dimostrare la pletora di funzioni e possibilità che React offre.
Vengono quindi utilizzati per gli stili: styled-components ed il pacchetto material-ui.
Per alcune logiche invece utilizzo anche Redux, ad esempio per avere lo userToken come stato globale.

Ove possibile ho cercato di tipizzare anche oggetti custom.

## La logica del gioco ed i miei ragionamenti

Ho deciso di seguire un approccio più "solido" per renderizzare il gioco.
Invece di stampare una sequenza di carte, facilmente indovinabili da un utente con un pizzico di malizia (andando ad ispezionare il network o HTML),
ho deciso di eseguire una chiamata verso il backend al click di una carta.

Ogni carta ha un "cardNumber" ed un "cardPosition" che rispettivamente sono: il numero lato backend della carta, la posizione della carta nell'array di carte.
Nel frontend, quindi, se la carta non è provvista di un CardNumber allora comunico la sua posizione al backend (dove risiede l'array random delle carte-coppie generate)
ed il backend mi restituisce il numero, vado quindi a popolarlo nella carta.

In una prima versione avevo previsto persino un double-check per ogni coppia, ma ho deciso di abbandonare l'idea per questioni di tempo e complessità.

Una volta finito il tutto viene renderizzata la classifica parziale con la possibilità di switchare su quella totale.

Un piccolo appunto per la classifica: la chiamata API è singola e restituisce la classifica FULL andando a ritornare un array di utenti GIÀ ordinato.
Ogni elemento è un UTENTE scorporato da campi non necessari al fine della classifica.

Il render della classifica parziale avviene andando a filtrare, lato frontend, quella completa.
Sinceramente avevo provato a studiare un metodo per fare il tutto direttamente con i metodi su Mongoose, usando il $rank operator, ma con scarsi risultati (ho lasciato una traccia nello ScoreService del backend).

Una volta letta la classifica sarà possibile ricominciare tutto d'accapo.



