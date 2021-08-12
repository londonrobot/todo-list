(function() {

    // Заголовок дела
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    };

    // Форма для создания дела
    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = "Введите название нового дела";
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = "Добавить дело";
        button.disabled = true;

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return {
            form,
            input,
            button
        }
    };

    // список дел
    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    };


    // счетчик для индекса дел
    let count = 0;

    // создает одно дело для списка, возвращает его элементы
    function createTodoItem(anyValue, listID) {

        let item = document.createElement('li');
        let value;

        if (typeof(anyValue) != "object") {
            value = {
            name: anyValue,
            done: false
            }
        } else value = anyValue;

        item.textContent = value.name;
        if (value.done == true) item.classList.toggle('list-group-item-success');
        counter(value);


        // пишет в local storage созданное дело
        function counter (value) {
            localStorage.setItem(listID + (localStorage.length + count), JSON.stringify(value));
            count++;
        }

        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        return {
            item,
            doneButton,
            deleteButton
        };
    }

    // дефолтный список дел
    let items = [
        // {name: 'tralala', done: true},
        // {name: 'trululu', done: false},
        // {name: 'trololo', done: true}
        ];

    // main
    function createTodoApp (container, title = 'Список дел', itemList = items) {
        let toodAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        container.append(toodAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        let listID = container.id;

        // создает список дефолтных дел
        function createDefaultItems (itemList) {
            let defaultItems = [];
            for (let i=0; i< itemList.length; i++) {
                defaultItems[i] = createItemElement(itemList[i]);
            }
        }

        let itemList2 = [];

        // проверка, существуют ли записи. если да, из них формируется дефолтный список
        for (let i=0; i<localStorage.length; i++) {
            if (localStorage.key(i).indexOf(listID) >= 0)
            {
                itemList2.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
                localStorage.removeItem(localStorage.key(i));
                i-=1;
            }
        }

        if (!itemList2[0]) {
            itemList2 = itemList;
        }
        createDefaultItems(itemList2); // формирование списка дел. если есть в локал сторадж, то оттуда. если нет, то из параметра функции createTodoApp


        // встраивание элемента и навешивание событий на его кнопки
        function createItemElement(value) {
            let todoItem = createTodoItem(value, listID);
            todoItemForm.button.disabled = true;

            todoItem.doneButton.addEventListener('click', function() {
                todoItem.item.classList.toggle('list-group-item-success');

                for (let i=0; i<localStorage.length; i++) {
                        let obj = JSON.parse(localStorage.getItem(localStorage.key(i)));
                        let text = todoItem.item.textContent;
                        //  ГотовоУдалить
                        text = text.slice(0, text.length-13);

                        if ((text===obj.name) && (localStorage.key(i).indexOf(listID)>=0)) {
                            obj.done? obj.done = false : obj.done = true;
                            localStorage.setItem(localStorage.key(i), JSON.stringify(obj));
                            break;
                        }
                    }
            });

            todoItem.deleteButton.addEventListener('click', function() {
                if (confirm('Вы уверены?')) {

                    for (let i=0; i<localStorage.length; i++) {
                        let obj = JSON.parse(localStorage.getItem(localStorage.key(i)));
                        let text = todoItem.item.textContent;
                        //  ГотовоУдалить
                        text = text.slice(0, text.length-13);

                        if ((text===obj.name) && (localStorage.key(i).indexOf(listID)>=0)) {
                            localStorage.removeItem(localStorage.key(i));
                            break;
                        }
                    }
                    todoItem.item.remove();
                }
            });

            todoList.append(todoItem.item);

        }

        // активация кнопки добавить
        todoItemForm.input.addEventListener('input', function () {
            todoItemForm.input.value? todoItemForm.button.disabled = false: todoItemForm.button.disabled = true;
        });

        // обработка сабмит от формы (альтернатива: кейепресс и клик)
        todoItemForm.form.addEventListener('submit', function(e) {
            e.preventDefault();

            createItemElement(todoItemForm.input.value);

            todoItemForm.input.value = '';
        });

    }

    window.createTodoApp = createTodoApp;

})();
