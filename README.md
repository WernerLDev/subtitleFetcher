# subtitleFetcher

An improved version of my previous ScalaSubtitleFetcher. This time I have used TypeScript for the implementation. It is a simple command line tool that can be executed through a context menu item in the Dolphin filebrowser on linux.

For this implementation I have used the new opensubtitles.com API.

Still Under development so right now I do not have a package you can install. Maybe in the future.

## Run locally

1. Clone this repository

```
git clone git@github.com:WernerLDev/subtitleFetcher.git
```

2. Install dependencies

```bash
npm install
```

3. Run the application

```bash
ts-node src/main.ts --movie <path to moviefile> --language en
```

## License
