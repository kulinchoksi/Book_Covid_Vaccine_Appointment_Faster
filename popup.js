
var automate_find_and_book;
function automate_find_select_book_appointment() {
	slot_found = false;
	clearInterval(automate_find_and_book);
	automate_find_and_book = setInterval(keep_search_select, 2000);
	console.log("clear slot status, interval and start automation");
}

function keep_search_select() {
	// search slots
	document.querySelector("ion-button.pin-search-btn.district-search").click();
	console.log("initiate search");

	// assuming page is updated after searching slot in 1 sec, find and select available slot after that
	console.log("find and select available slot");
	setTimeout(find_and_select_available_slot, 1500);
}

// search slots and run slot selection
var slot_found = false;

function find_and_select_available_slot() {
	console.log("initiate finding and selecting available slot");
	unbooked_vaccination_centres = document.querySelectorAll("div.mat-list-text div.slots-box:not(.no-available):not(.no-seat)").forEach(function(unbooked_vaccination_centre){
		console.log('unbooked_vaccination_centre: ', unbooked_vaccination_centre);
		if (unbooked_vaccination_centre.querySelector("span.age-limit").textContent == "Age 18+") {
			slot_found = true;
			console.log("clear automation(time interval)");
			clearInterval(automate_find_and_book);
			
			console.log('18+ slot found! Book it now!');
			unbooked_vaccination_centre.click();
			
			// appointment page
			console.log("select the first time slot");
			document.querySelector("div.time-slot-list ion-button").click();
			
			console.log("increase size of captcha");
			document.querySelector("div.img-wrap img").style.width = "500%";

			// focus captcha input
			var captcha_input = document.querySelector("div.input-wrap input");
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
	console.log("clear automation(time interval)");
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    /* console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension"); */
    if (request.click == "automate_find_select_book_appointment") {
		sendResponse({automation: "initiated"});
		automate_find_select_book_appointment();
	} else if (request.click == "stop_automation") {
		sendResponse({automation: "stopped"});
		stop_automation();
	} else if (request.click == "select_and_book_appointment") {
		sendResponse({automation: "partial"});
		find_and_select_available_slot();
	} else {
		return;
	}
  }
);
