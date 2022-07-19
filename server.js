//Set variables
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = 8500;
// const PORT = process.env.PORT
require("dotenv").config();

//add model
const TodoTask = require("./models/TodoTask");
// require("TodoTask");

//Set Middleware
app.set("view engine", "ejs");
// app.use(cors())
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () => {
	console.log("connected to database");
});

app.listen(PORT, () => {
	console.log(`this server is running on ${PORT}`);
});
app.get("/", async (request, response) => {
	try {
		TodoTask.find({}, (error, tasks) => {
			response.render("index.ejs", { todoTasks: tasks });
		});
	} catch (error) {
		if (error) return response.status(500).send(error);
	}
});
app.post("/", async (request, response) => {
	const todoTask = new TodoTask({
		title: request.body.title,
		content: request.body.content,
	});
	try {
		await todoTask.save();
		console.log(todoTask);
		response.redirect("/");
	} catch (error) {
		if (error) return response.status(500).send(error);
		response.redirect("/");
	}
});
//edit / update
app.route("/edit/:id")
	.get((request, response) => {
		const id = request.params.id;
		TodoTask.find({}, (error, tasks) => {
			response.render("edit.ejs", {
				todoTasks: tasks,
				idTask: id,
			});
		});
	})
	.post((request, response) => {
		const id = request.params.id;
		TodoTask.findByIdAndUpdate(
			id,
			{
				title: request.body.title,
				content: request.body.content,
			},
			(error) => {
				if (error) return response.status(500).send(error);
				response.redirect("/");
			}
		);
	});
app.route("/remove/:id").get((request, response) => {
	const id = request.params.id;
	TodoTask.findByIdAndRemove(id, (error) => {
		if (error) return response.status(500).send(error);
		response.redirect("/");
	});
});
