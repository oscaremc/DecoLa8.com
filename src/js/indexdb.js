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
const saveTask = (title, valor, description, imagen) =>
  db.collection("productos").doc().set({
    title,
    valor,
    description,
    imagen,
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
        <div class="producto-card">
          <h1>${task.title}</h1>
          <h2>${task.valor}</h2>
          <h3>${task.description}</h3>
        </div>
        // <img class="imagen-producto" src="${task.imagen}">
        <img class="imagen-producto" src="/src/utils/img/${task.imagen}">
        <div>
          <button class="btn btn-primary btn-delete" data-id="${doc.id}">
            🗑 Borrar
          </button>
          <button class="btn btn-secondary btn-edit" data-id="${doc.id}">
            🖉 Editar
          </button>
        </div>
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

    const btnsEdit = tasksContainer.querySelectorAll(".btn-edit");
    btnsEdit.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        try {
          const doc = await getTask(e.target.dataset.id);
          const task = doc.data();
          taskForm["task-title"].value = task.title;
          taskForm["task-valor"].value = task.valor;
          taskForm["task-description"].value = task.description;
          taskForm["task-imagen"].value = task.imagen;

          editStatus = true;
          id = doc.id;
          taskForm["btn-task-form"].innerText = "Update";

        } catch (error) {
          console.log(error);
        }
      });
    });
  });
});

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = taskForm["task-title"];
  const valor = taskForm["task-valor"];
  const description = taskForm["task-description"];
  const imagen = taskForm["task-imagen"];

  try {
    if (!editStatus) {
      await saveTask(title.value, valor.value, description.value, imagen.value);
    } else {
      await updateTask(id, {
        title: title.value,
        valor: valor.value,
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
