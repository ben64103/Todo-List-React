import React, { useEffect, useRef, useState } from 'react';

import AddTodo from './components/AddTodo';
import { CustomFilter, FilterTodos } from './components/Filter';
import TodoList, { TodoListLength } from './components/TodoList';

import { FaPlus, FaSearch } from 'react-icons/fa';

const App = () => {
  const [todos, setTodos] = useState(JSON.parse(localStorage.getItem('todos')) || []);

  const [todo, setTodo] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [customFilter, setCustomFilter] = useState('All');
  const [toggleSearch, setToggleSearch] = useState(false);

  const [message, setMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodoRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    const handleInput = () => {
      if (todo.trim().length >= 5) {
        addTodoRef.current.disabled = false;
        setMessage('');
      } else {
        addTodoRef.current.disabled = true;
        setMessage(
          todo.trim().length > 0
            ? `Required length remaining ${5 - todo.trim().length}`
            : todo.length === 0 && 'Maximum required length is 5'
        );
        setInterval(() => {
          setMessage('');
        }, 5000);
      }
    };
    handleInput();
  }, [todo]);

  const handleAddTodo = (e) => {
    e.preventDefault();
    const id = todos.length ? todos[todos.length - 1].id + 1 : 1;
    const newTodo = { id, todo, checked: false };
    const todoItems = [...todos, newTodo];

    inputRef.current.focus();
    setTodos(todoItems);

    setTodo('');
  };

  const handleCheck = (id) => {
    const todoItems = todos.map((todo) =>
      todo.id === id ? { ...todo, checked: !todo.checked } : todo
    );
    setTodos(todoItems);
  };

  const handleDelete = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  const handleSearch = (e) => {
    setSearchValue(e.target.value.toLowerCase());
  };

  const todoItems = todos.filter((item) => item.todo.toLowerCase().includes(searchValue));

  const handleCustomFilter = (name) => {
    setCustomFilter(name);
  };

  const handleEdit = (id) => {
    const editedTodos = todos.map((item) => {
      setMessage('max 5 character to edit');
      todo.length > 5 && setTodo('');
      return todo.length > 5 && item.id === id ? { ...item, todo: todo } : item;
    });
    setTodos(editedTodos);
  };

  return (
    <main id='app'>
      <h1>TodoList</h1>

      <section className='todolist-app'>
        <AddTodo
          todo={todo}
          message={message}
          setTodo={setTodo}
          addTodoRef={addTodoRef}
          inputRef={inputRef}
          toggleSearch={toggleSearch}
          handleAddTodo={handleAddTodo}
        />
        <FilterTodos
          filter={searchValue}
          toggleSearch={toggleSearch}
          handleSearch={handleSearch}
        />

        {todos.length === 0 ? (
          <p className='empty'>No todos yet...</p>
        ) : (
          todos.length > 0 && (
            <>
              <button
                type='button'
                onClick={() => setToggleSearch(!toggleSearch)}>
                {!toggleSearch ? <FaSearch /> : <FaPlus />}
              </button>
              <TodoList
                todos={todoItems}
                handleSearch={handleSearch}
                handleCheck={handleCheck}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                customFilter={customFilter}
              />
            </>
          )
        )}
        <CustomFilter handleCustomFilter={handleCustomFilter} />

        {todos.length > 0 && <TodoListLength todos={todos} />}
      </section>
    </main>
  );
};

export default App;
