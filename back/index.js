const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const cors = require('cors');
const unidecode = require('unidecode');

app.use(cors());
app.use(express.json());
const USER_FILE = path.join(__dirname, '.', 'users.json');
const FILE_PATH = `${__dirname}/users.json`;

const removeAcento = (str) => {
	return unidecode(str);
};

app.get('/users', async (req, res) => {
	const users = await fs.readFile(USER_FILE);
	const response = await JSON.parse(users);
	if (req.query.name !== undefined) {
		const filtered = await response.filter((f) =>
			removeAcento(f.name)
				.toLowerCase()
				.includes(removeAcento(req.query.name).toLowerCase()),
		);
		return res
			.status(200)
			.json({ result: filtered, meta: { amount: response.length } });
	}

	return res
		.status(200)
		.json({ result: response, meta: { amount: response.length } });
});

app.post('/users', async (req, res) => {
	const { name, age, email } = req.body;
	const data = await fs.readFile(USER_FILE);
	const resolved = await JSON.parse(data);
	console.log(resolved);
	const payload = {
		id: resolved.length + 1,
		name,
		age,
		email,
	};

	resolved.push(payload);

	await fs.writeFile(FILE_PATH, JSON.stringify(resolved));

	return res.status(200).json({
		...payload,
	});
});

app.delete('/users/:id', async (req, res) => {
	const { id } = req.params;
	const data = await fs.readFile(USER_FILE);
	const result = await JSON.parse(data);

	const user = result.filter((f) => f.id !== +id);
	await fs.writeFile(FILE_PATH, JSON.stringify(user));

	return res.status(200).json({
		message: 'ok',
	});
});

app.get('/users/:id', async (req, res) => {
	const { id } = req.params;

	const data = await fs.readFile(USER_FILE);
	const response = JSON.parse(data);

	const [user] = response.filter((i) => i.id === +id);

	if (user) {
		return res.status(200).json({
			...user,
		});
	}
	return res.status(404).json({
		message: 'User not found',
	});
});

app.put('/users/:id', async (req, res) => {
	const { id } = req.params;
	const { name, age, email } = req.body;

	const data = await fs.readFile(USER_FILE);
	const users = await JSON.parse(data);

	const userIndex = users.findIndex((user) => user.id === +id);

	if (userIndex !== -1) {
		users[userIndex].name = name || users[userIndex].name;
		users[userIndex].age = age || users[userIndex].age;
		users[userIndex].email = email || users[userIndex].email;

		await fs.writeFile(FILE_PATH, JSON.stringify(users));

		return res.status(200).json({
			...users[userIndex],
		});
	}

	return res.status(404).json({
		message: 'User not found',
	});
});

app.listen(4000, () => console.log('Server running...'));
