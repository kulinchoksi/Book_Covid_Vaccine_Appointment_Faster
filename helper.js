document.addEventListener('DOMContentLoaded', function () {

	var cowin_website_link = document.getElementById('cowin_website');
	
	cowin_website_link.addEventListener('click', function () {
		chrome.tabs.create({url: cowin_website_link.href});
		return false;
	}, false);

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
