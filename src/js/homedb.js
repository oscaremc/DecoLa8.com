const db = firebase.firestore();

const taskForm = document.getElementById("task-form");
const tasksContainer = document.getElementById("tasks-container");

let editStatus = false;
let id = '';

/**
 * Save a New Task in Firestore
 * @param {string} title titulo de los productos
 * @param {string} description descripcion de los productos
 * @param {string} imagen imagen de referencia de los productos
 * @param {string} valor valor de producto
 */
const saveTask = (title, description, imagen, valor) =>
  db.collection("productos").doc().set({
    title,
    description,
    imagen,
    valor,
  });

const getTasks = () => db.collection("productos").get();

const onGetTasks = (callback) => db.collection("productos").onSnapshot(callback);

const deleteTask = (id) => db.collection("productos").doc(id).delete();

const getTask = (id) => db.collection("productos").doc(id).get();

const updateTask = (id, updatedTask) => db.collection('productos').doc(id).update(updatedTask);

window.addEventListener("DOMContentLoaded", async (e) => {
  onGetTasks((querySnapshot) => {
    tasksContainer.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const task = doc.data();

    tasksContainer.innerHTML += `<div class="container-producto">
      <a href="">
        <img class="imagen-producto" src="${task.imagen}">
      </a>
    </div>`;
    });

    const btnsDelete = tasksContainer.querySelectorAll(".btn-delete");
    btnsDelete.forEach((btn) =>
      btn.addEventListener("click", async (e) => {
        console.log(e.target.dataset.id);
        try {
          await deleteTask(e.target.dataset.id);
        } catch (error) {
          console.log(error);
        }
      })
    );
  });
});

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = taskForm["task-title"];
  const description = taskForm["task-description"];
  const imagen = taskForm["task-imagen"];

  try {
    if (!editStatus) {
      await saveTask(title.value, description.value, imagen.value);
    } else {
      await updateTask(id, {
        title: title.value,
        description: description.value,
        imagen: imagen.value,
      })

      editStatus = false;
      id = '';
      taskForm['btn-task-form'].innerText = 'Save';
    }

    taskForm.reset();
    title.focus();
  } catch (error) {
    console.log(error);
  }
});
