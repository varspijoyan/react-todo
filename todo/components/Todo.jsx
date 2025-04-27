import { useEffect, useState } from "react";
import styles from "../styles/Todo.module.css";

const idSet = new Set();

function generateRandomId() {
  let id;
  do {
    id = Math.floor(Math.random() * 1000000);
  } while (idSet.has(id));

  idSet.add(id);
  return id;
}

export default function Todo() {
  const [todo, setTodo] = useState(() => {
    const storedTodos = localStorage.getItem("todos");
    return storedTodos ? JSON.parse(storedTodos) : [];
  });

  const [inputValue, setInputValue] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editById, setEditById] = useState(null);
  const [editInputValue, setEditInputValue] = useState("");

  const handleAddTodo = () => {
    if (inputValue !== "") {
      setTodo((prev) => [
        ...prev,
        {
          id: generateRandomId(),
          title: inputValue,
        },
      ]);
      setInputValue("");
    }
  };

  const handleEdit = (id, newTitle) => {
    setTodo((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            title: newTitle,
          };
        } else {
          return item;
        }
      })
    );
    
    setIsEditMode(false);
    setEditById(null);
  };

  const handleDelete = (id) => {
    setTodo((prev) => prev.filter(item => item.id !== id));
  }

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todo));
  }, [todo]);

  return (
    <div className={styles.todoContainer}>
      <h2 className={styles.title}>Todo App</h2>
      <div className={styles.inputContainer}>
        <input
          type="text"
          name="text"
          placeholder="Add todo"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button className={styles.addBtn} onClick={handleAddTodo}>
          <span className="icon-plus"></span>
        </button>
      </div>
      <div className={styles.content}>
        {todo.length > 0 ? (
          todo.map((item) => (
            <div key={item.id} className={styles.addedContent}>
              {isEditMode && editById === item.id ? (
                <>
                  <input
                    type="text"
                    name="text"
                    value={editInputValue}
                    onChange={(e) => setEditInputValue(e.target.value)}
                  />
                  <button
                    className={styles.saveBtn}
                    onClick={() => handleEdit(item.id, editInputValue)}
                  >
                    <span class="icon-checkmark"></span>
                  </button>
                </>
              ) : (
                <>
                  <p className="text">{item.title}</p>
                  <div className={styles.buttons}>
                    <button
                      className={styles.editBtn}
                      onClick={() => {
                        setIsEditMode(true);
                        setInputValue('');
                        setEditById(item.id);
                        setEditInputValue(item.title);
                      }}
                    >
                      <span className="icon-pencil"></span>
                    </button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(item.id)}>
                      <span className="icon-bin"></span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <p>No todo added</p>
        )}
      </div>
    </div>
  );
}
