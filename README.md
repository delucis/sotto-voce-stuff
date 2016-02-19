# Sotto Voce Stuff

Web Audio synthesis for [Clara Iannotta](http://claraiannotta.com/)’s *Sotto Voce Stuff*.

The current performance version can be found at <http://claraiannotta.com/svs/>

## Installation for Development

Clone the repository:
```bash
git clone git@github.com:delucis/sotto-voce-stuff.git
```

Install dependencies:    
```bash
cd sotto-voce-stuff
npm install
```

Serve the app [locally](http://localhost:4000) & watch for changes (alias for `grunt`):    
```bash
npm run serve
```

## Building for Deployment

The following will compile the necessary files for deployment to the subfolder `/svs` (alias for `grunt build`):
```bash
npm run build
```
