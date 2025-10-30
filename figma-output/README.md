# OnchainRank Dashboard - Figma to HTML Conversion

This directory contains the HTML/CSS conversion of the OnchainRank plugin page UI/UX design from Figma.

## 📁 Directory Structure

```
figma-output/
├── index.html          # Main HTML file
├── styles.css          # Stylesheet with all styling
├── README.md           # This file
└── assets/
    ├── fonts/          # Poppins font family
    │   └── Poppins/
    ├── icons/          # SVG icons from the design
    └── images/         # Logo and other images
```

## 🚀 Quick Start

1. Open `index.html` in your web browser to view the dashboard
2. All assets are locally referenced and should work offline

## 📋 Features Implemented

### Layout
- ✅ Responsive header with logo and user profile
- ✅ Trading Metrics section with 4 metric cards
- ✅ Wallet Analytics section with 4 metric cards
- ✅ Status & Indicators section with status cards and social links
- ✅ Performance Overview section with chart placeholder
- ✅ Chart control toggles with custom switch design
- ✅ Footer with copyright

### Styling
- ✅ Poppins font family (Regular, Medium, SemiBold, Bold)
- ✅ Color-coded icon backgrounds matching the design
- ✅ Clean card-based layout with hover effects
- ✅ Custom toggle switches
- ✅ Responsive design for mobile, tablet, and desktop
- ✅ SVG icon integration

### Interactive Elements
- ✅ Toggle switches for chart indicators
- ✅ Hover effects on cards and buttons
- ✅ Social media icon links (placeholder)
- ✅ Color picker button

## 🎨 Design Specifications

### Colors
- **Primary Blue**: #1e3a8a (logo text)
- **Accent Green**: #10b981 (logo accent, active status)
- **Background**: #f5f7fa
- **Card Background**: #ffffff
- **Text Primary**: #1a1a1a
- **Text Secondary**: #6b7280
- **Red**: #ef4444 (negative values)

### Icon Backgrounds
- **Mint**: #d1fae5
- **Blue**: #dbeafe
- **Peach**: #fee2e2
- **Yellow**: #fef3c7
- **Purple**: #ede9fe
- **Green**: #d1fae5
- **Gray**: #f3f4f6

### Typography
- **Font Family**: Poppins
- **Heading**: 24px, Bold
- **Metric Value**: 28px, Bold
- **Metric Label**: 13px, Medium
- **Body Text**: 14px, Regular

## 🔧 Integration Notes

### Chart Integration
The Performance Overview section includes a placeholder for the chart. To integrate with a real charting library:

1. Replace the `.chart-placeholder` div with your chart canvas/container
2. The existing Chart.js from your codebase uses `lightweight-charts`
3. You can directly integrate the chart initialization code from `src/Chart.js`

Example integration:
```javascript
const chartContainer = document.querySelector('.chart-placeholder');
const chart = createChart(chartContainer, {
    width: chartContainer.clientWidth,
    height: 400,
    // ... other chart options
});
```

### Toggle Functionality
The toggle switches are functional HTML checkbox inputs. To add behavior:

```javascript
document.querySelectorAll('.toggle-switch').forEach(toggle => {
    toggle.addEventListener('change', (e) => {
        const indicatorName = e.target.closest('.toggle-item').querySelector('span').textContent;
        console.log(`${indicatorName} toggled:`, e.target.checked);
        // Add your chart indicator toggle logic here
    });
});
```

### WebSocket Integration
To add real-time data updates, follow the pattern from `DecorChart.js` or `SingleChartPage.js`:

```javascript
const socket = io('https://api.onchainrank.com');
socket.on('single', (data) => {
    // Update metric values
    // Update chart data
});
```

## 📱 Responsive Breakpoints

- **Desktop**: > 768px (4-column grid)
- **Tablet**: 481px - 768px (2-column grid)
- **Mobile**: ≤ 480px (1-column grid)

## 🎯 Next Steps

1. **Add JavaScript functionality**:
   - Toggle switch event handlers
   - Chart initialization and data binding
   - WebSocket connection for real-time updates
   - Color picker functionality

2. **Enhance interactivity**:
   - Add loading states
   - Error handling UI
   - Toast notifications
   - Modal dialogs

3. **Performance optimization**:
   - Lazy load images
   - Optimize font loading
   - Add service worker for offline support

4. **Accessibility improvements**:
   - Add ARIA labels
   - Keyboard navigation
   - Screen reader support
   - Focus indicators

## 📝 Notes

- The design follows a card-based layout pattern consistent with modern dashboard UIs
- All SVG icons are inline for easy customization
- The color scheme supports both light mode (currently implemented)
- Font files are self-hosted for better performance and offline support

## 🔗 Source

Original Figma design: `OnchainRank plugin page UI_UX Design.fig`

---

© OnchainRank 2025 — All Rights Reserved.
