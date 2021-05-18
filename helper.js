document.addEventListener('DOMContentLoaded', function () {

	document.getElementById('automate_find_select_book_appointment').addEventListener('click', function () {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		  chrome.tabs.sendMessage(tabs[0].id, {click: "automate_find_select_book_appointment"}, function(response) {
			console.log(response);
		  });
		});
	}, false);

	document.getElementById('stop_automation').addEventListener('click', function () {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		  chrome.tabs.sendMessage(tabs[0].id, {click: "stop_automation"}, function(response) {
			console.log(response);
		  });
		});
	}, false);
	
	document.getElementById('select_and_book_appointment').addEventListener('click', function () {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		  chrome.tabs.sendMessage(tabs[0].id, {click: "select_and_book_appointment"}, function(response) {
			console.log(response);
		  });
		});
	}, false);
	
}, false);
