// "use strict";

var automate_find_and_book;
var selected_age;
var selected_vaccines;
var slot_found = false;

function automate_search_book_appointment() {
	clearInterval(automate_find_and_book);
	automate_find_and_book = setInterval(keep_search_select, 2000);
	console.log("Fresh start for automated booking.");
}

function keep_search_select() {
	// find pin or district search button
	let search_button = document.querySelector("ion-button.pin-search-btn"); // .district-search
	if (!search_button) {
		console.log("Search button not found!");
		return;
	}
	// console.log("Search button: ", search_button);
	
	search_button.click();
	console.log("Initiate search.");

	// assuming page is updated after searching slot in 1 sec, find and select available slot after that
	console.log("Scan and select available slot.");
	setTimeout(find_and_select_available_slot, 1500);
}

function vaccinationCentreOffersSelectedVaccine(vaccine_offered_in_available_vaccination_centre) {
	if (selected_vaccines.length > 0) {
		console.log("Vaccine offered in available vaccination centre: ", vaccine_offered_in_available_vaccination_centre);
		if (selected_vaccines.includes(vaccine_offered_in_available_vaccination_centre)) {
			console.log("Found selected vaccine.");
			return true;
		} else {
			console.log("Selected vaccine not found.");
			return false;
		}
	} else {
		console.log("No vaccine selected by user means anyone is fine.");
		return true;
	}
}

function find_and_select_available_slot() {
	console.log("Initiate scanning available slot with " + selected_age + " and selected vaccines: " + selected_vaccines);
	
	slot_found = false;
	
	available_vaccination_centres = document.querySelectorAll("div.mat-list-text div.slots-box:not(.no-available):not(.no-seat)");
	if (!available_vaccination_centres) {
		console.log("No available slot found!");
		return;
	}
	console.log("Total available slots found: " + available_vaccination_centres.length);
	
	available_vaccination_centres.forEach(function(available_vaccination_centre){
		console.log('Available vaccination centre: ', available_vaccination_centre);
		vaccine_offered_in_available_vaccination_centre = available_vaccination_centre.querySelector("h5.name").textContent;
		
		if (available_vaccination_centre.querySelector("span.age-limit").textContent == selected_age &&
				vaccinationCentreOffersSelectedVaccine(vaccine_offered_in_available_vaccination_centre)) {
			
			slot_found = true;
			clearInterval(automate_find_and_book);
			console.log("Stop searching further.");
			
			available_vaccination_centre.click();
			console.log('Selected the very fist available slot with selected criteria.');
			
			// appointment page
			document.querySelector("div.time-slot-list ion-button").click();
			console.log("Selected the very first time slot.");
			
			// Don't know why but everytime I had to referesh captcha, so automating it
			document.querySelector("div.img-wrap a").click();
			console.log("Captcha refereshed.");
			
			document.querySelector("div.img-wrap img").style.width = "500%";
			console.log("Increased the size of captcha.");

			// focus captcha input
			let captcha_input = document.querySelector("div.input-wrap input");
			captcha_input.focus();
			console.log("captcha_input: ", captcha_input);

			// Execute a function when the user releases a key on the keyboard
			captcha_input.addEventListener("keyup", function(event) {
			  // Number 13 is the "Enter" key on the keyboard
			  if (event.keyCode === 13) {
				// Cancel the default action, if needed
				// event.preventDefault();
				// Trigger the button element with a click
				document.querySelector('ion-button[type="submit"]').click();
			  }
			});
			
			// prevent selecting the next available slot
			return;
		}
	});
}

function stop_automation() {
	clearInterval(automate_find_and_book);
	console.log("Stop automated booking.");
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    /* console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension"); */
				
	// check connection
/* 	if (request.hasOwnProperty('greeting')) {
		console.log("Message from the background script:");
		console.log(request.greeting);
		return Promise.resolve({response: "Hi from content script"});
	} */
				
    if (request.click == "automate_search_book_appointment") {
		selected_age = request.age;
		selected_vaccines = request.vaccines;
		automate_search_book_appointment();
		sendResponse({automation: "initiated"});
	} else if (request.click == "stop_automation") {
		stop_automation();
		sendResponse({automation: "stopped"});
	} else if (request.click == "select_and_book_appointment") {
		find_and_select_available_slot();
		sendResponse({automation: "scan_and_select_appointment"});
	} else {
		/* return; */
	}

	return true;
  }
);
