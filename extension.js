// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const JSZip = require('jszip');
const fs = require('fs');
const os = require('os');
const { resolve } = require('path');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "distzip" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('distzip.zip', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		// vscode.window.showInformationMessage('Hello World from distZip!');
		console.log(vscode.workspace.workspaceFolders);
		const zip = new JSZip();
		const rootPath = vscode.workspace.workspaceFolders?.[0].uri;
		if (!rootPath) {
			vscode.window.showErrorMessage('路径错误，请先打开工程项目');
			return;
		}
		
		const distPath = vscode.workspace.getConfiguration('distZip').get('distPath') || 'dist';
		const outPath = vscode.workspace.getConfiguration('distZip').get('outPath') || resolve(os.homedir(), 'Desktop');
		const packageJson = fs.readFileSync(resolve(rootPath.fsPath, 'package.json'), 'utf8');
		const packageObj = JSON.parse(packageJson);
		try {
			readDir(zip, resolve(rootPath.fsPath, distPath));
		} catch(e) {
			vscode.window.showErrorMessage('发生错误：' + e);
			return;
		}
			
		zip
			.generateNodeStream({type: 'nodebuffer', streamFiles: true})
			.pipe(fs.createWriteStream(resolve(outPath, (packageObj.alias || packageObj.name) + '.zip')))
			.on('finish', function () {
					// JSZip generates a readable stream with a "end" event,
					// but is piped here in a writable stream which emits a "finish" event.
					vscode.window.showInformationMessage('打包完成');
			});
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

const readDir = (zip, dir, folder = '') => {
  if (folder) {
    zip = zip.folder(folder);
  }

  const files = fs.readdirSync(dir, {withFileTypes: true});
  files.forEach(file => {
    const path = resolve(dir, file.name);
    file.isDirectory() ? readDir(zip, path, file.name) : zip.file(file.name, fs.readFileSync(path));
  })
}

module.exports = {
	activate,
	deactivate
}
