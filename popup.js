
var automate_find_and_book;
function automate_find_select_book_appointment() {
	clearInterval(automate_find_and_book);
	automate_find_and_book = setInterval(keep_search_select, 2000);
	console.log("Fresh start for automated booking.");
}

function keep_search_select() {
	// search slots
	let search_button = document.querySelector("ion-button.pin-search-btn.district-search");
	if (!search_button) {
		console.log("Search button not found!");
		return;
	}
	
	search_button.click();
	console.log("Initiate search.");

	// assuming page is updated after searching slot in 1 sec, find and select available slot after that
	console.log("Scan and select available slot.");
	setTimeout(find_and_select_available_slot, 1500);
}

function find_and_select_available_slot() {
	console.log("Initiate scanning and selecting available slot");
	
	var slot_found = false;
	
	unbooked_vaccination_centres = document.querySelectorAll("div.mat-list-text div.slots-box:not(.no-available):not(.no-seat)");
	if (!unbooked_vaccination_centres) {
		console.log("No available slot found!");
		return;
	}
	console.log("Total available slots found: " + unbooked_vaccination_centres.length);
	
	unbooked_vaccination_centres.forEach(function(unbooked_vaccination_centre){
		console.log('unbooked_vaccination_centre: ', unbooked_vaccination_centre);
		if (unbooked_vaccination_centre.querySelector("span.age-limit").textContent == "Age 18+") {
			slot_found = true;
			clearInterval(automate_find_and_book);
			console.log("Stop searching further.");
			
			unbooked_vaccination_centre.click();
			console.log('Selected the very fist available slot.');
			
			// appointment page
			document.querySelector("div.time-slot-list ion-button").click();
			console.log("Selected the very first time slot.");
			
			// refresh captcha to avoid delay because of captcha session expired
			document.querySelector("div.img-wrap a").click();
			console.log("Captcha refereshed.");
			
			document.querySelector("div.img-wrap img").style.width = "500%";
			console.log("Increased the size of captcha.");

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
	console.log("Stop automated booking.");
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
				
    if (request.click == "automate_find_select_book_appointment") {
		sendResponse({automation: "initiated"}, response => {
			if (chrome.runtime.lastError) {
				console.log("This solution will work on Co-WIN website only.");
				alert("This solution will work on Co-WIN website only.");
			}
		});
		
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
