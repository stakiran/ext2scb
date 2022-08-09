import * as vscode from 'vscode';

import * as path from 'path';

function abort(message: string) {
	console.log(message);
	// Object is possibly 'undefined' を防げないので呼び出し元で.
	//throw new Error(`Error: ${message}`);
}
function msgdialog(message: string){
	vscode.window.showInformationMessage(message);
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
	const TARGET_FOLDERNAME = 'scb';

	const workspaceRootOrNothing = getWorkspaceRootDirectory();
	const doesNotOpenWorkspace = !workspaceRootOrNothing
	if(doesNotOpenWorkspace){
		msgdialog('No workspace. Please open a workspace first.')
		return Promise.resolve(true);
	}
	const workspaceRootDir = workspaceRootOrNothing
	const target_directory = path.join(workspaceRootDir, TARGET_FOLDERNAME)
	console.log(target_directory)

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
