// "use strict";

document.addEventListener('DOMContentLoaded', function () {
	
/* 	function onError(error) {
	  console.error('Error: ', error);
	}

	function sendMessageToTabs(tabs) {
	  for (let tab of tabs) {
		chrome.tabs.sendMessage(
		  tab.id,
		  {greeting: "Hi from background script"}
		).then(response => {
		  console.log("Message from the content script:");
		  console.log(response.response);
		}).catch(onError);
	  }
	}

	chrome.browserAction.onClicked.addListener(() => {
	  chrome.tabs.query({
		currentWindow: true,
		active: true
	  }).then(sendMessageToTabs).catch(onError);
	}); */

/* 	var cowin_website_link = document.getElementById('cowin_website');
	
	cowin_website_link.addEventListener('click', function () {
		chrome.tabs.create({url: cowin_website_link.href});
		return false;
	}, false);

	var CoWINTabFound = false;
	async function getCoWINTab() {
	  let queryOptions = { url: "https://selfregistration.cowin.gov.in/appointment" };
	  let [tab] = await chrome.tabs.query(queryOptions);
	  return tab;
	}
	
	
	getCoWINTab()
	.then(function (tab) { // success
		console.log("CoWINTab: " + tab + tab.length);
		CoWINTabFound = true;
	})
	.catch(function (error) { // failure
		CoWINTabFound = false;
		console.log("CoWIN website is not opened!");
	}); */
	
	// try this
	// chrome.tabs.executeScript(tab.id,{file: "buy.js"});
	// injects the javascript
    // chrome.tabs.executeScript(null,{file: "buy.js"});
	
	// try this
	// https://stackoverflow.com/questions/54181734/chrome-extension-message-passing-unchecked-runtime-lasterror-could-not-establi
	
	var automation_start_button = document.getElementById('automate_search_book_appointment');
	var automation_stop_button = document.getElementById('stop_automation');
	
	automation_start_button.addEventListener('click', function () {
		
		/* chrome.tabs.query({ url: 'https://selfregistration.cowin.gov.in/*' }, tabs => {
			if (tabs.length == 0) {
				chrome.tabs.create({url: 'https://selfregistration.cowin.gov.in/appointment'}, function(tab) {
					chrome.tabs.executeScript(tab.id,{file: "poup.js"});
				});
			} else {
				tabs.forEach(tab => 
					chrome.tabs.sendMessage(
						tab.id,
						{click: "automate_search_book_appointment"},
						function(response) {
							console.log(response);
						}
					)
				);
			}
		}); */
		
		let selected_age = document.querySelector("input[name=age]:checked").value;
		var selected_vaccines = [];
		document.querySelectorAll("input[name=vaccine]:checked").forEach(function(selected_vaccine) {
			selected_vaccines.push(selected_vaccine.value);
		});
		let request = {
				click: "automate_search_book_appointment",
				age: selected_age,
				vaccines: selected_vaccines
		};
		
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, request, function(response) {
				if (typeof response !== 'undefined') {
					console.log(response);
					
					automation_start_button.style.display = 'none';
					automation_stop_button.style.display = '';
				}
			});
		});
	}, false);

	automation_stop_button.addEventListener('click', function () {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {click: "stop_automation"}, function(response) {
				if (typeof response !== 'undefined') {
					console.log(response);
					
					automation_start_button.style.display = '';
					automation_stop_button.style.display = 'none';
				}
			});
		});
	}, false);
	
	/* document.getElementById('select_and_book_appointment').addEventListener('click', function () {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {click: "select_and_book_appointment"}, function(response) {
				if (typeof response !== 'undefined') {
					console.log(response);
				}
			});
		});
	}, false); */
	
}, false);

/* var _port;

function testConnect() {
  _port.postMessage({
    msg: 'hello from popup'
  });
}

chrome.runtime.onConnect.addListener(function (port) {
  console.log('connected to: ', port.name);
  _port = port;

  _port.onMessage.addListener(processMessages);
  p_portrt.postMessage({
    msg: 'hello from popup'
  });
});

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#testConnect').addEventListener(
      'click', testConnect);
  });
})();
 */