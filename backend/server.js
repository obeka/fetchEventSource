import express from "express";
import cors from "cors";
import fetch from "node-fetch";
const app = express();
const PORT = 8000;

app.use(cors());

app.post("/quote", (req, res) => {
	res.setHeader("Content-Type", "text/event-stream");
	res.setHeader("Cache-Control", "no-store");

	const fetchWord = async () => {
		try {
			const response = await fetch(
				"https://random-word-api.herokuapp.com/word"
			);
			const data = await response.json();
			return data[0];
		} catch (error) {
			console.log("Error fetching quote:", error);
			return "Failed to fetch quote";
		}
	};

	let counter = 50;
	const intervalId = setInterval(async () => {
		if (counter > 0) {
			const quote = await fetchWord();
			res.write(`event: QuoteEvent\n`);
			res.write(`data: {"message": "${quote}"}\n\n`);
			counter--;
		} else {
			clearInterval(intervalId);
			res.write(`event: Close\n`);
			res.write(`data: {"message": "Stream Ended"}\n\n`);
			res.end(); // Ensure the response is closed
		}
	}, 100);

	// Clean up the connection on client disconnect
	req.on("close", () => {
		clearInterval(intervalId);
		res.end();
	});
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
