import * as vscode from 'vscode';

import * as path from 'path';

import * as util from './util';

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

class CursorPositioner {
	static current(): vscode.Position {
		const editor = getEditor();
		const curPos = editor.selection.active;
		return curPos;
	}

	static currentSelection(): vscode.Selection {
		const editor = getEditor();
		return editor.selection;
	}

	static rangeBetweenCurrentSelection(): vscode.Range {
		const curSel = this.currentSelection();
		const range = new vscode.Range(curSel.start, curSel.end);
		return range;
	}
}

function constructTargetScbFullpath(maybeOpeneeFilename: string) {
	const openeeFilename = util.fixInvalidFilename(maybeOpeneeFilename);
	const fullpathOfCurrentScbFile = getFullpathOfActiveTextEditor();

	const directoryOfCurrentScbFile = path.dirname(fullpathOfCurrentScbFile);

	const fullpath_without_ext = path.join(
		directoryOfCurrentScbFile,
		openeeFilename
	);
	const fullpath = `${fullpath_without_ext}.scb`;
	return fullpath;
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
	console.log('yeah!');
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
