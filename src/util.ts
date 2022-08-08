function fixInvalidFilename(filename: string) {
	let newFilename = filename;
	const after = '_';
	newFilename = newFilename.replace(/\\/g, after);
	newFilename = newFilename.replace(/\//g, after);
	newFilename = newFilename.replace(/:/g, after);
	newFilename = newFilename.replace(/\*/g, after);
	newFilename = newFilename.replace(/\?/g, after);
	newFilename = newFilename.replace(/"/g, after);
	newFilename = newFilename.replace(/>/g, after);
	newFilename = newFilename.replace(/</g, after);
	newFilename = newFilename.replace(/\|/g, after);
	// スペースはファイル名としては有効だが何かとウザイので潰す
	newFilename = newFilename.replace(/ /g, after);
	return newFilename;
}

export { fixInvalidFilename };
