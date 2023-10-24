const scriptURL = "https://script.google.com/macros/s/AKfycbyRqNUG83NEnZHFZuJ9-Ke5r-NwK3uEzgv0V_17BcjQu2Ddl6FFn9VWkEuBrxuoehM5/exec";
const form = document.forms["submit-to-google-sheet"];
const notif = document.querySelector(".notif");

form.addEventListener("submit", (e) => {
	e.preventDefault();
	//notif.classList.toggle("d-none");

	// Ekstrak gender dari NIK
	const nik = form.elements["nik"].value;
	const gender = extractGenderFromNIK(nik);

	// Tampilkan gender dalam notifikasi
	const notifMessage = gender === "Laki-laki" ? "Laki-laki" : gender === "Perempuan" ? "Perempuan" : "NIK tidak valid";
	// Tampilkan gender dalam notifikasi jika NIK valid
	if (gender !== "NIK tidak valid") {
		notif.classList.toggle("d-none");
	}
	if (gender === "NIK tidak valid") {
		alert(gender);
		form.reset();
		return;
	}

	// Tambahkan gender ke dalam form sebelum mengirimkannya ke spreadsheet
	form.elements["gender"].value = gender;

	fetch(scriptURL, {
		mode: "no-cors",
		method: "POST",
		body: new FormData(form),
	})
		.then((response) => {
			form.reset();
		})
		.catch((error) => {
			alert("Gagal");
		});
});

function extractGenderFromNIK(nik) {
	if (nik.length !== 16) {
		return "NIK tidak valid";
	}

	const birthDate = nik.substring(6, 12);
	const firstDigitOfBirthDate = birthDate.charAt(0);

	if (["0", "1", "2", "3"].includes(firstDigitOfBirthDate)) {
		return "Laki-laki";
	} else if (["4", "5", "6", "7"].includes(firstDigitOfBirthDate)) {
		return "Perempuan";
	} else {
		return "NIK tidak valid";
	}
}
