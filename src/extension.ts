import * as vscode from 'vscode';

import * as path from 'path';

const SELF_EXTENSION_ID = 'stakiran.vscodescb-openscb';

function abort(message: string) {
	console.log(message);
	// Object is possibly 'undefined' を防げないので呼び出し元で.
	//throw new Error(`Error: ${message}`);
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
function getWorkspaceRootDirectory() {
	const directoriesOrUndefined = vscode.workspace.workspaceFolders;
	if(directoriesOrUndefined == undefined){
		const NOTFOUND = "";
		return NOTFOUND;
	}
	// multiple workspace はいったん想定しない前提でいく。
	// ので、1番目を常に選んじゃう。
	const directory = directoriesOrUndefined[0];
	const directoryByString = directory.uri.fsPath;
	return directoryByString
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
	console.log(getFilenameOfActiveTextEditor());
	console.log(getWorkspaceRootDirectory());
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
