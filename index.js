function sendFiles(allFiles, projectName, projectVersion='default') {
	const client = new Client();

	client.on('ready', async () => {
		console.info('ready');

		for (let file of allFiles) {
			try {
				await new Promise((resolve, reject) => {
					client.put(file, getFileName(file), err => {
						if (err) reject(err);
						else resolve();
					});
				});
				console.info(file, 'upload');
			} catch(err) {
				console.info(err, file);
			}
		}

		client.end();
	});

	clientOptions = {
		host: destinationHost
	};

	projectName && (clientOptions.user = `${projectName}/${projectVersion}`);


	client.connect(clientOptions);
}

function getFileName(file) {
	return file.split('\\').slice(-1)[0];
}

function getAllFilesWithExtInFolder(folder, extension) {
	let allSourcemaps = [];
	fs.readdirSync(folder).forEach(file => {
		const filePath = path.join(folder, file);
		const stat = fs.lstatSync(filePath);

		if (stat.isFile()) {
			const ext = filePath.split('.').slice(-1)[0];
			ext === extension && allSourcemaps.push(filePath)
		} else {
			allSourcemaps = allSourcemaps.concat(getAllFilesWithExtInFolder(filePath, extension));
		}
	});
	return allSourcemaps;
}

module.exports = [sendFiles, getAllFilesWithExtInFolder];