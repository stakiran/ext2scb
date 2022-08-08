import * as vscode from 'vscode';

import * as path from 'path';

const SELF_EXTENSION_ID = 'stakiran.vscodescb-openscb';

function abort(message: string) {
	console.log(message);
	// Object is possibly 'undefined' を防げないので呼び出し元で.
	//throw new Error(`Error: ${message}`);
}

export function getSelfDirectory() {
	const selfExtension = vscode.extensions.getExtension(SELF_EXTENSION_ID);
	if (selfExtension === undefined) {
		abort('No extension found in getSelfDirectory()');
		throw new Error();
	}
	const selfDir = selfExtension.extensionPath;
	return selfDir;
}
function getFullpathOfActiveTextEditor() {
	const editor = getEditor();
	const fullpath = editor.document.uri.fsPath;
	return fullpath;
}
function getFilenameOfActiveTextEditor() {
	const fullpath = getFullpathOfActiveTextEditor();
	const filename = path.basename(fullpath);
	return filename;
}

export function getEditor() {
	const editor = vscode.window.activeTextEditor;
	if (editor == null) {
		abort('activeTextEditor is null currently.');
		throw new Error();
	}
	return editor;
}

export async function newOrOpen() {
	const filename = getFilenameOfActiveTextEditor();
	console.log(filename);
	return Promise.resolve(true);
}

export function activate(context: vscode.ExtensionContext): void {
	const _new_or_open = vscode.commands.registerCommand(
		'openscb.neworopen',
		() => {
			newOrOpen();
		}
	);

	context.subscriptions.push(_new_or_open);
}
