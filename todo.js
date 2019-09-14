//form seçelim
const form = document.querySelector("#todo-form");
//inputu seçelim
const todoInput = document.querySelector("#todo");
//ul elementini seçelim
const todoList = document.querySelector(".list-group");
//ilk kartı seçelim
//diğer elementler
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll (".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListeners();

function eventListeners (){
    //Bu fonksyion bütün event listenerları içericek
    form.addEventListener("submit",addTodo);//submit oldugunda addTodo fonk. çlaıştır
    document.addEventListener("DOMContentLoaded", loadAllTodosToUI); // sayfa yüklendiğine local str. daki verileri sayfaya eklicez
    secondCardBody.addEventListener("click", deleteTodo); // eklenen todoları silmek için silme butonuna eventlistener ekledik
    filter.addEventListener("keyup", filterTodos);
    clearButton.addEventListener("click", clearAllTodos);
}

function clearAllTodos(e){
    
    if (confirm("Tümünü silmek istediğinize emin misin ?")){
        //ilk yol
        // todoList.innerHTML = ""; // REMOVE CHİLD A GÖRE YAVAŞ YÖNTEM

        while(todoList.firstElementChild != null){
            todosList.removeChild(todoList.firstElementChild);
        }
        localStorage.removeItem("todos"); // local storagedan key vererek sildik.
    }

}

function filterTodos(e){
    console.log(e.target);
    const filterValue = e.target.value.toLowerCase();
    //lileri çekicez.class kullancaz
    const listItems = document.querySelectorAll(".list-group-item");

    listItems.forEach(function(listItem){
        const text = listItem.textContent.toLowerCase();
        if ( text.indexOf(filterValue)){//bulamazsa -1 döner bulursa indeks döner
            listItem.setAttribute("style","display : none !important"); //bulamazsa sayfada göstermicek
            // burda ! important dememizin sebebi  cssde d-flex  özelliğinin display : none ı baskılıyo olması bu bootstrap le alakalı 
        }else {
            listItem.setAttribute("style", " display : block"); //

        }
        
    });
}

function deleteTodo(e){
    //cardbodyde nereye basıldıgını anlamak için.
    //console.log(e.target);
    if ( e.target.className === "fa fa-remove"){
       
       
        e.target.parentElement.parentElement.remove(); // çarpı işaretine tıkladıgımızda önce onun parentı olan a ya gider sonra onun da parenti olan li ye gider ve o todo satırını (li elementini) silmiş olur.
       //şimdilik sadece arayüzden sildik localden silmedik.
       deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);// çarpı işaretine bastıgımızda bastıgımız carpının todosunu fonksa göndermiş olacaz
        showAlert("success","Todo Başarıyla Silindi.."); // silme işleminden sonra mesaj verir.
        
        

    }
}

function deleteTodoFromStorage(deletetodo){
    let todos = getTodosFromStorage ();
    todos.forEach(function(todo,index){
        if (todo === deletetodo){
            //splice metodu arrayden veri siler.hangi indeksten başlayıp kaç indeks siliceğimizi belirterek çalışır
            todos.splice(index,1);
        }

    });

    localStorage.setItem("todos", JSON.stringify(todos));
}

function loadAllTodosToUI(){
    let todos = getTodosFromStorage();
    todos.forEach(function(todo){
    
        addTodoToUI(todo); //daha önce zaten parametre olarka gönderdiğimiz todoyu uı ye ekleyen fonku yazmıstık
        //simdi sadece localStoragedan forEachle todo cekip gene bu fonka atıcaz

    })


}




function addTodo(e){
    //inputtaki değerleri almamız lazım
    const newTodo = todoInput.value.trim(); // girilen değeri alır
    //trim boşluk eklenirse silsin diye eklendi.
    //newtodo boşsa ekleme yapmaması için
    todos = getTodosFromStorage();
    var isThere = todos.includes(newTodo); // var mı diye kontrol yapmak için
    
    
    if(newTodo === ""){
        /* 
        <div class="alert alert-danger" role="alert">
                        <strong>Oh snap!</strong> Change a few things up and try submitting again.
                      </div>
        */

    
        showAlert("danger","Lütfen Bir ToDo girin.");
    }else if(isThere){ // isthere değişkeni true ise eklenmeye çalışan değer zaten vardır. uyarı verir.
        
        showAlert("danger", "Lütfen Farklı Bir Todo Girin..");
    }
    else{
         addTodoToUI(newTodo);
         addTodoToStorage(newTodo);
         showAlert("success", "Todo Başarıyla Eklendi..")
    }
   

    e.preventDefault();
}
function getTodosFromStorage(){ // Storagedan tüm todoları alır

    let todos;

    if(localStorage.getItem("todos")=== null){
        todos = []; //yoksa başlatıyoruz
    }else {
        todos = JSON.parse(localStorage.getItem("todos")); //varsa array e ceviriyoruz
    }
    return todos;
}


function addTodoToStorage(newTodo){

    let todos = getTodosFromStorage();

    todos.push(newTodo);// sonuna ekler

    localStorage.setItem("todos",JSON.stringify(todos));

}

function showAlert(type,message){
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    firstCardBody.appendChild(alert);
    
    
}


function addTodoToUI(newTodo){
    //String değerini list item olarak ekleyecek 
    /* 
    <li class="list-group-item d-flex justify-content-between">
                            Todo 1
                            <a href = "#" class ="delete-item">
                                <i class = "fa fa-remove"></i>
                            </a>

                        </li>
    */
    // yukarıdaki <li> elemenetinin aynısını dinamik olarak oluşturucaz.
    const listItem = document.createElement("li"); //elementi tagi li 
    const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class = 'fa fa-remove'></i>";

    listItem.className = "list-group-item d-flex justify-content-between";
    //"Todo 1" textini ekleme
    listItem.appendChild(document.createTextNode(newTodo)); // newTodo değişkenine girilen ismi eklenilen liste elemanına isim olarak yazar.
    listItem.appendChild(link); // a yı li nin çocugu olarak ekledik

    //Todo liste list item ı eklemek
    todoList.appendChild(listItem);
    todoInput.value = "";
}

