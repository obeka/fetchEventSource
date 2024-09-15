import { fetchEventSource } from "@microsoft/fetch-event-source";

const conversation = document.getElementById("conversation");

document
	.getElementById("simpleForm")
	.addEventListener("submit", async (event) => {
		event.preventDefault();
		const userInput = document.getElementById("userInput").value; // Get the user input from the form
		// clear the input
		document.getElementById("userInput").value = "";
		const ctrl = new AbortController();
		await fetchEventSource("http://localhost:8000/quote", {
			method: "POST",
			headers: {
				"Content-Type": "text/event-stream",
			},
			onmessage(ev) {
				// write data into ul
				const p = document.getElementById("randomWords");
				if (ev.data) {
					p.textContent += JSON.parse(ev.data).message + " ";
				}
			},
			onerror(ev) {
				console.error(ev);
			},
			signal: ctrl.signal,
			onclose() {
				console.log("Connection closed");
			},
		});
	});
