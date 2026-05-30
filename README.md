<h1 align="center">CARDO - PODCAST CLIENT</h1>
<p align="center">
    <a href="https://cardo-podcast.github.io">
        <img src="https://raw.githubusercontent.com/cardo-podcast/cardo/master/src-tauri/icons/icon.png" alt="logo" width="256" height="256" />
    </a>
</p>

## Overview

Cardo is a podcast client for desktop, inspired by Android's [Antennapod](https://antennapod.org/). Cardo can be synchonized with Antennapod and other apps using [Nextcloud Gppoder](https://github.com/thrillfall/nextcloud-gpodder/), [Gpodder/Opodsync](https://github.com/kd2org/opodsync), and [goPodder](https://github.com/cbrgm/gopodder).

![1](assets/readme/1.png)

![2](assets/readme/2.png)

![3](assets/readme/3.png)

![4](assets/readme/4.png)

![5](assets/readme/5.png)

### Features

- [x] Search podcasts online
- [x] Manage your subscriptions
- [x] Look at new episodes of your subscriptions with a glance
- [x] Synchronize episodes state and subscriptions using Nexcloud Gpodder
- [x] Lightweight app (thanks to Tauri)
- [x] Customizable themes
- [x] Download episodes to listen them offline
- [x] Add podcast from feed url
- [x] Synchronization using [Opodsync](https://github.com/kd2org/opodsync)
- [x] Synchronization using [goPodder](https://github.com/cbrgm/gopodder)
- [ ] Keep your favorite episodes
- [ ] Audio manipulation, speed, silence skip & normalization
- [ ] Add podcasts from sources other than i-tunes
- [ ] Windows taskbar play/pause button

### Compatible clients (from nextcloud-gpodder)

| client                                                                                                  | support status                                                                                                                                                                        |
| :------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [AntennaPod](https://antennapod.org)                                                                    | Initial purpose for this project, as a synchronization endpoint for this client.<br> Support is available [as of version 2.5.1](https://github.com/AntennaPod/AntennaPod/pull/5243/). |
| [KDE Kasts](https://apps.kde.org/de/kasts/)                                                             | Supported since version 21.12                                                                                                                                                         |
| [Podcast Merlin](https://github.com/yoyoooooooooo/Podcast-Merlin--Nextcloud-Gpodder-Client-For-Windows) | Full sync support podcast client for Windows                                                                                                                                          |
| [RePod](https://apps.nextcloud.com/apps/repod)                                                          | Nextcloud app for playing and managing podcasts with sync support                                                                                                                     |

## Contributing

### Helping with donations

If you like this app you can contribute by buying me a coffee or whatever you want, that would be really great :)

<div style="display: inline-flex; gap: 10px; align-items: center">
    <a href="https://www.buymeacoffee.com/n0vella" target="_blank" rel="noopener">
        <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;"
        >
    </a>
    <a href="https://www.paypal.com/paypalme/adriannovella" target="_blank" rel="noopener">
        <img src="https://www.paypalobjects.com/webstatic/icon/pp196.png" alt="Paypal" width="60" height="60" style="border-radius: 10px" />
    </a>
</div>

### If you are a developer

It's also nice if you want to improve the app. The stack is Tauri v2 + React + Typescript + Tailwind.

Feel free to summit a PR if you create something good!

#### Setup

This project uses:

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/installation)
- [Rust](https://rustup.rs/)
- [Tauri dependencies](https://v2.tauri.app/start/prerequisites/)

Install these with the setup script for your platform:
- Windows (PowerShell): 
```bash
./scripts/setup-windows.ps1
```
- MacOS: 
```bash
./scripts/setup-macos.sh
```
- Ubuntu/Debian Linux:
```bash
./scripts/setup-ubuntu.sh
```

Once you have successfully completed the above, you will need to install the `pnpm` packages:

```bash
pnpm install
```

#### Run and debug

Debug from the command line:
```bash
pnpm tauri dev
```

Run without debugging:
```bash
pnpm tauri dev --release
```

View linter output:
```bash
pnpm lint
```

For your convinenece the setup scripts will also create a ***Visual Studio Code*** `launch.json` project file for your platform. Open the Cardo folder in VS Code and it will be used automatically.

For help modifying the setup with VS Code, follow [the instructions in the Tauri docs](https://v2.tauri.app/develop/debug/vscode/) but replace `yarn` in the sample config to `pnpm`.

### Translations

#### Current status

<!-- TRANSLATION-TABLE-START -->

<table>
  <thead>
    <tr>
      <th>Language</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
     <tr>
      <td>en</td>
      <td style="color: green;">100%</td>
    </tr>
     <tr>
      <td>es</td>
      <td style="color: green;">100%</td>
    </tr>
     <tr>
      <td>ar</td>
      <td style="color: green;">94%</td>
    </tr>
     <tr>
      <td>fr</td>
      <td style="color: green;">94%</td>
    </tr>
     <tr>
      <td>tr</td>
      <td style="color: green;">94%</td>
    </tr>
     <tr>
      <td>cn</td>
      <td style="color: yellow;">89%</td>
    </tr>
     <tr>
      <td>de</td>
      <td style="color: yellow;">89%</td>
    </tr>
     <tr>
      <td>pt</td>
      <td style="color: yellow;">89%</td>
    </tr>
  </tbody>
</table>

<!-- TRANSLATION-TABLE-END -->

#### Contributing

You can contribute with translations if you speak some other languages.
It's only necessary to replicate json files in [the translations folder](resources/translations). There is a tool on scripts to auto translate it using Google Translate, but I didn't want to leave bad translations, even English could be badly translated as it isn't my mother language.

## Troubleshooting

On Windows you may experience a Windows shield alert, that's because the app is signed with a self-signed certificate, not a paid one. Maybe alerts will stop appearing if the app earns some reputation. Of course you don't have to believe me, inspecting the code and building it by yourself is always the safer option.

## Logs

Recent logs are saved to one of the following directories. It may be helpful to include the logs when filing a bug report. 
- Windows: `%LOCALAPPDATA%\cardo\logs\`
- MacOS: `~/Library/Logs/cardo/`
- Linux: `~/.config/cardo/logs/`
