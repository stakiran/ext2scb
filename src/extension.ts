import * as vscode from 'vscode';

import * as path from 'path';
import * as fs from 'fs';

import * as util from './util';

function abort(message: string) {
	console.log(message);
	// Object is possibly 'undefined' を防げないので呼び出し元で.
	//throw new Error(`Error: ${message}`);
}
function msgdialog(message: string) {
	vscode.window.showInformationMessage(message);
}

export function getEditor() {
	const editor = vscode.window.activeTextEditor;
	if (editor == null) {
		abort('activeTextEditor is null currently.');
		throw new Error();
	}
	return editor;
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
	if (directoriesOrUndefined == undefined) {
		const NOTFOUND = '';
		return NOTFOUND;
	}
	// multiple workspace はいったん想定しない前提でいく。
	// ので、1番目を常に選んじゃう。
	const directory = directoriesOrUndefined[0];
	const directoryByString = directory.uri.fsPath;
	return directoryByString;
}

async function smartopenIfDoesnotExists(filepath: string) {
	const smartopen = vscode.Uri.file(filepath).with({ scheme: 'untitled' });
	const promise = vscode.workspace.openTextDocument(smartopen);
	return promise.then(vscode.window.showTextDocument, () => {
		// 既存ファイルだった場合はこっちに来る（失敗扱いになる）
		return false;
	});
}
async function openExistingFile(filepath: string) {
	const uri = vscode.Uri.file(filepath);
	const textdocument = await vscode.workspace.openTextDocument(uri);
	await vscode.window.showTextDocument(textdocument);
}

export async function newOrOpen() {
	const TARGET_FOLDERNAME = 'scb';

	const workspaceRootOrNothing = getWorkspaceRootDirectory();
	const doesNotOpenWorkspace = !workspaceRootOrNothing;
	if (doesNotOpenWorkspace) {
		msgdialog('No workspace. Please open a workspace first.');
		return Promise.resolve(true);
	}
	const workspaceRootDir = workspaceRootOrNothing;
	const targetDirectory = path.join(workspaceRootDir, TARGET_FOLDERNAME);
	console.log(targetDirectory);

	const currentFileName = getFilenameOfActiveTextEditor();
	const targetFilename = util.fixInvalidFilename(currentFileName);
	console.log(targetFilename);

	const doesNotExistTargetDirectory = !fs.existsSync(targetDirectory);
	if (doesNotExistTargetDirectory) {
		fs.mkdirSync(targetDirectory);
	}

	const targetFullpath = path.join(targetDirectory, targetFilename);
	const okSmartOpen = await smartopenIfDoesnotExists(targetFullpath);
	if (okSmartOpen) {
		return Promise.resolve(true);
	}
	await openExistingFile(targetFullpath);
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
