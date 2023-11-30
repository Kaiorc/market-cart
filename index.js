import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
// IMPORTANTE - ABRIR O ARQUIVO "firebase-realtime-db-url.js" E INSERIR A URL
// O ARQUIVO FOI ADICIONADO AO GITHUB SEM A URL NA VARIÁVEL
// Importando a variável que possui a URL da Realtime Database do Firebase do desenvolvedor
import firebaseRealtimeDbUrl from "./firebase-realtime-db-url.js"

// URL do banco de dados no Firebase
const appSettings = {
    databaseURL: firebaseRealtimeDbUrl
}

// Configurando a conexão com o Firebase
const app = initializeApp(appSettings)
const database = getDatabase(app)
// "ref" de "Reference", é qualquer parte do banco de dados,
// essa função recebe qual database estamos trabalhando e como
// essa referência deve ser chamada
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

addButtonEl.addEventListener("click", () => {
    let inputValue = inputFieldEl.value
    
    // Passando os valores escritos no input field, para o Firebase, utilizando a função
    // importada "push", que recebe a database onde o valor passado deverá ser armazenado
    // e o valor a ser armazenado
    push(shoppingListInDB, inputValue)
    
    clearInput(inputFieldEl)
})

inputFieldEl.addEventListener("keydown", (event) => {
    // Verificar se a tecla pressionada é a tecla Enter (código 13)
    if (event.keyCode === 13) {
        let inputValue = inputFieldEl.value
        push(shoppingListInDB, inputValue)
        clearInput(inputFieldEl)
    }
})

// Firebase function that fetch the data already on the database.
// This function always run when there is a change on the database.
// Função que permite que o aplicativo ouça as alterações no local "shoppingList" do
// Firebase Realtime Database e mantenha a interface do usuário atualizada conforme
// necessário. Sempre que ocorrer uma alteração nos dados, a função de retorno de chamada
// é executada para atualizar a lista de compras exibida e garantir a consistência entre
// o estado local do aplicativo e o banco de dados.
onValue(shoppingListInDB, (snapshot) => {
    // Verificando se há algum item no banco de dados
    // Caso existam itens, adiciona-os à lista de compras na interface
    // Se não, exibe uma mensagem na shopping list
    if(snapshot.exists()){
        // Show all the items inside of shoppingList in the database
        // console.log(snapshot.val())
        
        // Variable that saves an array with all the values of the object received from 
        // the database at Firebase
        let itemsArray = Object.entries(snapshot.val())
        // console.log(itemsArray)
        
        // Cleaning the list at every update
        clearShoppingListEl()
        
        // Append the items to the shopping list
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            
            // Variable that saves the id of the current item
            let currentItemID = currentItem[0]
            // console.log(currentItemID)
            
            // Variable that saves the value of the current item
            let currentItemValue = currentItem[1]
            // console.log(currentItemValue)
            
            // Chama a função que cria um novo elemento de item de lista 
            // para cada item recebido do banco de dados
            appendItemToListEl(shoppingListEl, currentItem)
        }
    } else {
        shoppingListEl.innerHTML = "No items here... yet"
    }
})

// Function that clears the elements inside shopping list
function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

// Function that receives an element and clears its value
function clearInput(inputElement){
    inputElement.value = ""
}

// Function that receives an ul element and a value and append a new li with
// the received value to the ul
function appendItemToListEl(ulElement, item){
    // ulElement.innerHTML += `<li>${value}</li>`
    
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    
    newEl.textContent = itemValue
    
    // Event Listener que remove o item da lista (na database) após ser clicado
    newEl.addEventListener("click", () => {
        // Variable that saves the reference to the item location in the database
        // ex.: "https://realtime-database-df319-default-rtdb.europe-west1.firebasedatabase.app/shoppingList/xxxxxxITEMIDxxxxxx"
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        
        // Remove the item in the database
        remove(exactLocationOfItemInDB)
    })
    
    shoppingListEl.append(newEl)
}