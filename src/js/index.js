var modal = document.getElementById("abrirModal");
var btn = document.getElementById("menuModal");
var span = document.getElementsByClassName("close")[0];

btn.onclick = function () {
    modal.style.display = "block";
    btn.style.display = "none"
}

span.onclick = function () {
    modal.style.display = "none";
    btn.style.display = "block";
}

//onload hide content
function refresh() {
    modal.style.display = "none";
    btn.style.display = "block";
}