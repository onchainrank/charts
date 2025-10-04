# Webhook Client - Cryptocurrency Trading Dashboard

A real-time cryptocurrency trading dashboard that displays interactive financial charts with onchain analytics. Built with React and integrated with OnchainRank APIs for live trading data and onchain metrics.

## Overview

This application provides comprehensive visualization of cryptocurrency trading activity with real-time updates via WebSocket. It displays candlestick charts enhanced with multiple technical indicators, onchain analytics, and trader behavior metrics to help analyze token launches and trading patterns.

## Features

- **Real-time Chart Updates**: Live candlestick data via WebSocket connection
- **Onchain Analytics**: Track wallet behavior, profit/loss metrics, and trader quality scores
- **Interactive Indicators**: Toggle 11+ different indicators on/off with persistent preferences
- **Color-coded Candles**: Visual representation of new money ratio through candle colors
- **Validation Metrics**: Display launch quality, social media validation, and bundle risk analysis
- **Responsive Design**: Bootstrap-based UI that adapts to different screen sizes

## Technical Stack

- **React 19.0.0**: Frontend framework
- **lightweight-charts 4.2.3**: Professional financial charting library
- **Socket.IO Client 4.8.1**: Real-time bidirectional event-based communication
- **React Router DOM 7.2.0**: Client-side routing
- **Bootstrap 5.3.3**: CSS framework for responsive design

## Installation

```bash
npm install
```

## Available Scripts

### `npm start`

Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm test`

Launches the test runner in interactive watch mode

### `npm run build`

Builds the app for production to the `build` folder

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

## Chart Indicators

The application displays the following indicators, all of which can be toggled on/off individually:

### Profit/Loss Indicators

- **Unrealized Profit** (solid line, dark blue #0f4a6e): Potential profit from open positions
- **Unrealized Loss** (solid line, brown #6e3d0f): Potential loss from open positions
- **Realized Profit** (dashed line, blue #156a9d): Actual profit from closed positions
- **Realized Loss** (dashed line, orange #9d4e15): Actual loss from closed positions

### Volume Indicators

- **Volume** (histogram, bottom): Trading volume in SOL (green for up, red for down)
- **Total Volume** (line, blue #2E86AB): Cumulative trading volume (cSolVal)
- **Buy Volume** (line, green #00b300): Volume from buy transactions
- **Sell Volume** (line, red #e60000): Volume from sell transactions
- **Last 10 Sec Volume** (line, orange #ff6b35): Trading volume in last 10 seconds
- **Last 5 Sec Volume** (line, dotted orange #f7931e): Trading volume in last 5 seconds

### Quality Metrics

- **Onchain Score** (line, red #dd0808ff): Actor rank quality metric (higher = better trader quality)
- **HT** (line, purple #8E44AD): Holder tracking metric

### Visual Features

- **Candlestick Colors**: Candles are color-coded based on new_money_ratio:
  - Default light blue (#c0e7ffff): Ratio < 0.1 or undefined
  - Light purple (#535696ff): Ratio 0.1-0.49
  - Medium purple (#393c8aff): Ratio 0.49-0.75
  - Dark purple (#020438ff): Ratio ≥ 0.75
- **Probability Price Line**: Red horizontal line showing predicted price target (when available)

## Architecture

### Routing

- `/single/:id/:token` - Authenticated single chart view with full analytics
- `*` (catch-all) - Public chart view via address resolution

### Data Flow

1. Initial data fetch from `https://api.onchainrank.com/startup/${id}/${token}`
2. WebSocket connection to `https://ws.onchainrank.com`
3. Subscribe to chart-specific room for real-time updates
4. Merge incoming candle data with existing data
5. Auto-update all indicators and metrics

### API Endpoints

- `GET https://profile.onchainrank.com/marketing-addr/` - Address to ID resolution
- `GET https://api.onchainrank.com/startup/${id}/${token}` - Initial chart data
- `DELETE https://api.onchainrank.com/delete/${id}` - Chart deletion
- `WS https://ws.onchainrank.com` - Real-time updates via Socket.IO

### State Management

- React hooks (useState, useEffect) for local component state
- localStorage for persistent indicator visibility preferences
- WebSocket subscriptions managed in useEffect cleanup functions
- Chart instance management via useRef

## Key Components

- **App.js**: Main router and application entry point
- **SingleChartPage.js**: Authenticated chart page with full analytics
- **DecorChart.js**: Public chart page with address-based access
- **Chart.js**: Core charting component with indicator management
- **SingleHeader.js**: Header displaying onchain metrics and validation scores
- **ChartHeader.js**: Chart-specific metadata display
- **ChartLegend.js**: Indicator color legend

## Data Structure

Each candle contains:

- OHLC data (open, high, low, close)
- Volume metrics (solVal, cSolVal, buy_volume, sell_volume)
- Profit/loss data (unrealized_profit, unrealized_loss, realized_profit, realized_loss)
- Quality metrics (actor_rank, ht)
- Time-based volume (last5secVol, last10secVol)
- Fees and ratios (total_fee, new_money)

## Browser Support

- Production: >0.2% market share, not dead browsers, excluding Opera Mini
- Development: Latest Chrome, Firefox, and Safari versions
