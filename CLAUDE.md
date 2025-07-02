# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based cryptocurrency trading dashboard called "webhook-client" that displays real-time trading charts and onchain analytics. The application connects to OnchainRank APIs and provides interactive financial charts with multiple technical indicators.

## Development Commands

- `npm start` - Start development server on http://localhost:3000
- `npm test` - Run tests in interactive watch mode
- `npm run build` - Build for production
- `npm run eject` - Eject from Create React App (one-way operation)

## Architecture

### Core Components Structure

**App.js** - Main router with two routes:
- `/single/:id/:token` - SingleChartPage for authenticated chart viewing
- `*` (catch-all) - DecorChart for public address-based chart viewing

**Chart Flow Architecture:**
1. **DecorChart.js** - Public entry point that resolves addresses to IDs via marketing-addr API
2. **SingleChartPage.js** - Authenticated chart page that takes ID/token from URL params
3. **Chart.js** - Core charting component using lightweight-charts library

### Real-time Data Flow

Both DecorChart and SingleChartPage follow the same pattern:
1. Fetch initial data from `https://api.onchainrank.com/startup/${id}/${token}`
2. Establish WebSocket connection to `https://api.onchainrank.com` 
3. Listen for 'single' events that match the chart ID
4. Merge incoming candle data using `mergeCandles()` function

### API Integration

**External APIs:**
- `https://profile.onchainrank.com/marketing-addr/` - Address to ID resolution
- `https://api.onchainrank.com/startup/` - Initial chart data
- `https://api.onchainrank.com/delete/` - Chart deletion
- WebSocket at `https://api.onchainrank.com` - Real-time updates

**Authentication:**
- Public charts use hardcoded TOKEN = "no-auth"
- Private charts use token from URL parameters

### Chart Data Structure

Charts display candlestick data with additional indicators:
- Basic OHLC candles with volume histogram
- Technical indicators: unrealized_profit, unrealized_loss, realized_loss, realized_profit, actor_rank
- Indicators can be toggled on/off with visibility stored in localStorage
- Horizontal price lines for probability prices

### Component Hierarchy

**Headers:** SingleHeader (authenticated) vs DecorHeader (public) - display token metadata and onchain scores
**Chart Components:** Chart.js contains all charting logic, ChartHeader for controls, ChartLegend for indicator colors
**Utility Components:** InfoIcon tooltips, validation icons (ValidLaunchIcon, etc.), AdminComponent for admin functions

### State Management

- React useState/useEffect for local state
- localStorage for indicator visibility preferences  
- WebSocket state managed in useEffect cleanup functions
- Chart references managed with useRef for lightweight-charts integration

## Key Technical Patterns

**Data Merging:** `mergeCandles()` function handles real-time data updates by comparing timestamps and avoiding duplicates

**Chart Lifecycle:** Charts are created once on mount, series are added/removed based on indicator visibility, cleanup removes event listeners and chart instances

**Error Handling:** Basic try/catch in API calls, but many areas lack comprehensive error handling

**Responsive Design:** Charts resize on window resize events, Bootstrap classes for responsive layout