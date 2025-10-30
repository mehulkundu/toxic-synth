# Project Overview

This project is a web-based synthesizer called "Toxic Synth". It is built using React and Vite, with TailwindCSS for styling. The core of the application is the `WebSynth` component, which utilizes the Web Audio API to generate and manipulate audio.

The synthesizer has a modular architecture with the following components:
- 3 Oscillators
- 3 Envelopes
- 3 Filters
- 3 LFOs

The user can control various parameters of these components to create different sounds. The synth can be played using the computer keyboard or by clicking on the on-screen keyboard.

## Building and Running

### Prerequisites
- Node.js and pnpm

### Installation
```bash
pnpm install
```

### Running the development server
```bash
pnpm run dev
```

### Building for production
```bash
pnpm run build
```

### Linting
```bash
pnpm run lint
```

## Development Conventions

- **Styling**: TailwindCSS is used for styling.
- **Linting**: ESLint is configured to enforce code quality. The configuration can be found in `eslint.config.js`.
- **Component Structure**: The main application logic has been extracted from `WebSynth.jsx` and is now managed by the `useSynthEngine` hook. UI components are located in the `src/components` directory, and custom hooks are in `src/hooks`. `WebSynth.jsx` now serves as the main container component that assembles the UI.
- **State Management**: The majority of the application's state and the entire audio engine logic are managed by the `useSynthEngine` custom hook. This hook centralizes state management and makes the components more presentational.
