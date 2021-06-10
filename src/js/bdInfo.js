const db = firebase.firestore();

const taskForm = document.getElementById("task-form");
const tasksContainer = document.getElementById("tasks-container");

let editStatus = false;
let id = '';

/**
 * Save a New Task in Firestore
 * @param {string} numwhatsapp titulo de los productos
 * @param {string} linkwhatsapp descripcion de los productos
 * @param {string} direccionuno imagen de referencia de los productos
 * @param {string} direcciondos valor de producto
 * @param {string} timeuno valor de producto
 * @param {string} timedos valor de producto
 * @param {string} timetres valor de producto
 * @param {string} timecuatro valor de producto
 * @param {string} instagram valor de producto
 * @param {string} facebook valor de producto
 */
const saveTask = (numwhatsapp, linkwhatsapp, direccionuno, direcciondos, timeuno, timedos, timetres, timecuatro, instagram, facebook,) =>
  db.collection("datos").doc().set({
  numwhatsapp,
  linkwhatsapp,
  direccionuno,
  direcciondos,
  timeuno,
  timedos,
  timetres,
  timecuatro,
  instagram,
  facebook,
  });

const getTasks = () => db.collection("datos").get();

const onGetTasks = (callback) => db.collection("datos").onSnapshot(callback);

const deleteTask = (id) => db.collection("datos").doc(id).delete();

const getTask = (id) => db.collection("datos").doc(id).get();

const updateTask = (id, updatedTask) => db.collection('datos').doc(id).update(updatedTask);

window.addEventListener("DOMContentLoaded", async (e) => {
  onGetTasks((querySnapshot) => {
    tasksContainer.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const task = doc.data();

    tasksContainer.innerHTML += `
    
    <section class="container-form">
    <h1>Fomulario de Datos</h1>
    <div id="task-form" class="container-producto">
        <div class="whatsapp">
            <label for="">WhatsApp :</label>
            <input type="text" id="numwhatsapp" placeholder="Numero de whatsapp" value="${task.numwhatsapp}">
        </div>
        <div class="linkWhatsapp">
            <label for="">Link WhatsApp :</label>
            <input type="text" id="linkwhatsapp" placeholder="https:// ...." value="${task.linkwhatsapp}">
        </div>
        <div class="direccionUno">
            <label for="">Direccion 1 :</label>
            <input type="text" id="direccionuno" placeholder="Direccion" value="${task.direccionuno}">
        </div>
        <div class="direccionDos">
            <label for="">Direccion 2 :</label>
            <input type="text" id="direcciondos" placeholder="Direccion" value="${task.direcciondos}">
        </div>
        <div class="horario">
            <label for="">Horario Apertura semana :</label>
            <input type="time" id="timeuno" value="${task.timeuno}">
            <label for="">Horario Cierre semana :</label>
            <input type="time" id="timedos" value="${task.timedos}">
            <label for="">Horario Apertura Domingo :</label>
            <input type="time" id="timetres" value="${task.timetres}">
            <label for="">Horario Cierre Domingo :</label>
            <input type="time" id="timecuatro" value="${task.timecuatro}">
        </div>
        <div class="instagram">
            <label for="">Instagram :</label>
            <input type="text" id="instagram" placeholder="Link de Instagram" value="${task.instagram}">
        </div>
        <div class="facebook">
            <label for="">Facebook :</label>
            <input type="text" id="facebook" placeholder="Link de Facebook" value="${task.facebook}">
        </div>
        <button class="btn btn-secondary btn-edit" data-id="${doc.id}">
          🖉 Editar
        </button>
    </div>
    </section>
    `;
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
          taskForm["numwhatsapp"].value = task.numwhatsapp;
          taskForm["linkwhatsapp"].value = task.linkwhatsapp;
          taskForm["direccionuno"].value = task.direccionuno;
          taskForm["direcciondos"].value = task.direcciondos;
          taskForm["timeuno"].value = task.timeuno;
          taskForm["timedos"].value = task.timedos;
          taskForm["timetres"].value = task.timetres;
          taskForm["timecuatro"].value = task.timecuatro;
          taskForm["instagram"].value = task.instagram;
          taskForm["facebook"].value = task.facebook;

          editStatus = true;
          id = doc.id;
          taskForm['btn-task-form'].innerText = 'save';
          numwhatsapp.focus();

        } catch (error) {
          console.log(error);
        }
    });
  });
});

taskForm.querySelectorAll("submit", async (e) => {
  e.preventDefault();

  const numwhatsapp = taskForm["numwhatsapp"];
  const linkwhatsapp = taskForm["linkwhatsapp"];
  const direccionuno = taskForm["direccionuno"];
  const direcciondos = taskForm["direcciondos"];
  const timeuno = taskForm["timeuno"];
  const timedos = taskForm["timedos"];
  const timetres = taskForm["timetres"];
  const timecuatro = taskForm["timecuatro"];
  const instagram = taskForm["instagram"];
  const facebook = taskForm["facebook"];

  try {
    if (!editStatus) {
      await saveTask(numwhatsapp.value, linkwhatsapp.value, direccionuno.value, direcciondos.value, timeuno.value, timedos.value, timetres.value, timecuatro.value, instagram.value, facebook.value);
    } else {
      await updateTask(id, {
        numwhatsapp: numwhatsapp.value,
        linkwhatsapp: linkwhatsapp.value,
        direccionuno: direccionuno.value,
        direcciondos: direcciondos.value,
        timeuno: timeuno.value,
        timedos: timedos.value,
        timetres: timetres.value,
        timecuatro: timecuatro.value,
        instagram: instagram.value,
        facebook: facebook.value,
      })

      editStatus = false;
      id = '';
      taskForm['btn-task-form'].innerText = 'Save';
    }

    taskForm.reset();
    numwhatsapp.focus();
  } catch (error) {
    console.log(error);
  }
});
});
