let authorLinks = document.querySelectorAll("a");
for (auth of authorLinks) {
    auth.addEventListener("click", getAuthorInfo);
}
async function getAuthorInfo() {
    const modal = new bootstrap.Modal(document.getElementById('authorModal'));
    modal.show();
    let url = `/api/author/${this.id}`;
    let response = await fetch(url);
    let data = await response.json();
    let authorInfo = document.querySelector("#authorInfo");
    let dobStr = new Date(data[0].dob).toDateString();
    let dodStr = new Date(data[0].dod).toDateString();
    authorInfo.innerHTML = `<h1> ${data[0].firstName}
                                 ${data[0].lastName} </h1>`;
    authorInfo.innerHTML += `<p>Date of Birth: ${dobStr} </p>`;
    authorInfo.innerHTML += `<p>Date of Death: ${dodStr} </p>`;
    authorInfo.innerHTML += `<p>Sex: ${data[0].sex} </p>`;
    authorInfo.innerHTML += `<p>Profession: ${data[0].profession} </p>`;
    authorInfo.innerHTML += `<p>Country: ${data[0].country} </p>`;
    authorInfo.innerHTML += `<p>Biography: ${data[0].biography} </p>`;
    authorInfo.innerHTML += `<img src="${data[0].portrait}" width="200"><br>`;
}