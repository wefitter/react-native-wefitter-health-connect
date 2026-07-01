# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A React Native native bridge library that wraps the WeFitter Health Connect Android SDK. It exposes Android Health Connect data (steps, sleep, heart rate, etc.) to React Native apps via a WeFitter backend. Android-only — no iOS implementation.

## Commands

```bash
# Install dependencies (run from root)
yarn bootstrap          # install root deps + example app deps

# Build the library
yarn prepack            # compiles TypeScript → lib/ (commonjs + esm + types)

# Development checks
yarn lint               # ESLint
yarn typecheck          # TypeScript type checking (no emit)
yarn test               # Jest

# Example app
cd example && yarn android   # run example on Android device/emulator
```

To run a single test:
```bash
yarn test --testPathPattern="src/__tests__/index"
```

## Architecture

### Library Layer (TypeScript)

`src/index.tsx` — the entire public API. Declares TypeScript types and wraps the native module:
- `WeFitterHealthConnectType` interface: `configure()`, `connect()`, `disconnect()`, `isConnected()`, `isSupported()`
- Event types: `ConfiguredEvent`, `ConnectedEvent`, `ErrorEvent`
- Error enum: `WeFitterHealthConnectError`

Built by `react-native-builder-bob` into three output formats under `lib/`: CommonJS, ESM, and TypeScript declarations.

### Native Module (Kotlin/Android)

`android/src/main/java/com/wefitterhealthconnect/`
- `WeFitterHealthConnectModule.kt` — the bridge. Maps JS calls to the WeFitter AAR SDK, and emits events back to JS using `RCTDeviceEventEmitter`.
- `WeFitterHealthConnectPackage.kt` — registers the module with React Native.

The WeFitter SDK itself is a bundled AAR at `android/libs/wefitter-health-connect-0.2.2.aar`. To upgrade the SDK, replace that file and update the version reference in `android/build.gradle`.

### Event Flow

JS calls `configure(config)` → Kotlin initializes the WeFitter SDK → SDK fires status callbacks → Kotlin emits `WeFitterHealthConnectConfigured` / `WeFitterHealthConnectConnected` / `WeFitterHealthConnectError` events → JS receives them via `NativeEventEmitter`.

### Example App

`example/src/App.tsx` shows the full integration pattern: setting up health permissions, attaching event listeners, and calling configure/connect/disconnect. Use this as the reference implementation.

## Key Details

- The `startDate` config param is parsed as `yyyy-MM-dd` ISO format in the Kotlin module.
- Notification config (icon, title, text, channel) is passed as a JS object and parsed by the Kotlin module into Android notification builder options.
- Health Connect permissions are declared by the consuming app — the library does not declare them in its own `AndroidManifest.xml`.
- `connect2()` in the Kotlin module is an internal variant with retry logic; the JS API only exposes `connect()`.
- Commits follow Conventional Commits (enforced by commitlint via lefthook pre-commit hook).
