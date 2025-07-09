# The Algorithm Community Website

A modern, professional, and fully responsive website for The Algorithm Community - empowering women in technology.

## Features

- 🎨 **Modern Design**: Beautiful, professional interface with smooth animations
- 📱 **Fully Responsive**: Optimized for all devices (desktop, tablet, mobile)
- ⚡ **Fast Loading**: Optimized performance with lazy loading and efficient code
- 🎯 **Accessibility**: WCAG compliant with screen reader support
- 📅 **Dynamic Events**: Automatic Facebook event scraping and display
- 📖 **Code of Conduct**: Comprehensive community guidelines
- 🚀 **Progressive Enhancement**: Works even with JavaScript disabled

## Quick Start

### Option 1: Simple Setup
1. Open `index.html` in your web browser
2. Navigate to the Events page to see sample events

### Option 2: Full Development Setup
```bash
# Make setup script executable
chmod +x setup.sh

# Start the development server with event scraping
./setup.sh serve
```

This will:
- Update events from Facebook (or use sample data)
- Start a local web server at http://localhost:8000
- Start an events API server at http://localhost:8080/events

## Events System

The website includes a sophisticated events system that can scrape events from Facebook:

### Manual Event Updates
```bash
# Update events only
./setup.sh update-events

# Or run the Python script directly
python3 facebook_events_scraper.py --export events.json
```

### Facebook Integration
The events system is designed to work with Facebook's Graph API. For production use:

1. Register a Facebook App at https://developers.facebook.com/
2. Get an access token with `pages_read_engagement` permission
3. Update the `facebook_events_scraper.py` with your credentials
4. The script will automatically deduplicate events and extract images

### Event Features
- ✅ **Automatic Deduplication**: Prevents duplicate events from being shown
- 🖼️ **Event Images**: Displays event banners, flyers, and associated graphics
- 📅 **Smart Formatting**: Proper date/time formatting with timezone support
- 🏷️ **Event Status**: Shows upcoming, ongoing, or past event status
- 🌐 **Online/Offline**: Distinguishes between virtual and in-person events
- 👥 **Attendance Count**: Shows number of interested attendees
- 🔗 **Direct Links**: Links back to original Facebook events

## File Structure

```
TheAlgorithm/
├── index.html              # Main homepage
├── events.html             # Events page
├── code_of_conduct.html    # Code of conduct page
├── styles.css              # Main stylesheet
├── scripts.js              # Main JavaScript
├── events.js               # Events-specific JavaScript
├── facebook_events_scraper.py  # Event scraping script
├── setup.sh                # Development setup script
├── events.json             # Generated events data
├── images/                 # Image assets
│   ├── algorithm_logo.png
│   └── meeting.jpeg
└── README.md               # This file
```

## Customization

### Adding New Sections
1. Add the section to `index.html`
2. Add corresponding styles to `styles.css`
3. Update navigation in all HTML files
4. Add smooth scrolling support in `scripts.js`

### Styling
The website uses a comprehensive CSS design system with:
- CSS custom properties (variables) for consistent theming
- Responsive breakpoints for mobile-first design
- Modern gradients and shadows for visual appeal
- Smooth transitions and animations

### Events Configuration
Edit `facebook_events_scraper.py` to:
- Change the Facebook page URL
- Modify event filtering logic
- Customize event data structure
- Add additional event sources

## Browser Support

- ✅ Chrome/Chromium 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ Internet Explorer not supported

## Performance

The website is optimized for performance:
- CSS and JavaScript are minified in production
- Images use lazy loading
- Events are cached for 30 minutes
- Efficient DOM manipulation
- Minimal external dependencies

## Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatible
- High contrast ratios
- Focus indicators

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

© 2024 The Algorithm Community. All rights reserved.

## Support

For questions or support:
- Email: contact@thealgorithm.community
- Facebook: https://www.facebook.com/0thealgorithm

---

**Built with ❤️ by The Algorithm Community**
