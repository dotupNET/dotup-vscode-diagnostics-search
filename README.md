# Diagnostic search for Visual Studio Code

## Description

>Diagnostic search is a VSCode Extension that extracts diagnostic messages and opens a browser with the selected issue message. Works with all languages.


![dotup-vscode-diagnostics-search Video](https://raw.githubusercontent.com/dotupNET/dotup-vscode-diagnostics-search/master/images/video.gif)

## Installation

>You can browse and install extensions from within VS Code. Press `Ctrl+P` and narrow down the list commands by typing `ext install dotup-vscode-diagnostics-search`.

Or got to the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/search?term=dotup&target=VSCode)

## Usage

>Place the cursor on detected issues (highlighted with red squiggles). Clicking on the Code Action lightbulb or using the Quick Fix command `Ctrl+.` will display your configured search entries. Select the desired entry and confirm with enter or mouse click. The extension opens a browser window with the selected error message.


## Extension Settings:

>You can define your own entries. Each entry in the configuration file is displayed as a menu item in the context menu.

* `dotup.diagnostics-search.searchCommands`

Example:

```json
"default": [
  {
    "name": "Google",
    "command": "Start-Process",
    "executable": "chrome.exe",
    "url": "https://www.google.com/search?q=",
    "queryParameter": "${languageId} ${message}",
    "maxQueryParameterLength": 100
  },
  {
    "name": "Stackoverflow",
    "command": "Start-Process",
    "executable": "chrome.exe",
    "url": "https://stackoverflow.com/search?q=",
    "queryParameter": "${languageId} ${code} ${message}"
  },
  {
    "name": "Bing (edge)",
    "command": "start",
    "executable": "microsoft-edge:",
    "url": "https://www.bing.de/search?q=",
    "queryParameter": "${languageId} ${code}",
    "maxQueryParameterLength": 20
  }
]
```

Parameter:
>- name: The context menu title
>- command: [Start-Process][Powershell Start-Process] for executables or `start` to open a Windows 10 app link
>- executable: Application to start with url and queryParameter
>- url: Url of the search website
>- queryParameter: Define the url arguments with placeholder.
>- maxQueryParameterLength: Error message is truncated to this length. (Optional)

`queryParameter` placeholders:
>- ${languageId} - Replaced by `language` id of the current editor document
>- ${code} - Replaced by diagnostic `code` of select error
>- ${message} - Replaced by diagnostic `message` of selected error

---
![Screenshot](https://raw.githubusercontent.com/dotupNET/dotup-vscode-diagnostics-search/master/images/dotup-vscode-diagnostics-search-1.png)

## Release Notes
### 1.0.0

Fixes/Features:
- Initial release

**Enjoy!**

[Powershell Start-Process]: https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.management/start-process?view=powershell-6