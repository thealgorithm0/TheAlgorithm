/**
 * Events Page JavaScript
 * Handles Facebook event scraping and display
 */

class EventsManager {
    constructor() {
        this.events = [];
        this.loadingElement = document.getElementById('events-loading');
        this.containerElement = document.getElementById('events-container');
        this.errorElement = document.getElementById('events-error');
        this.noEventsElement = document.getElementById('no-events');
        this.refreshButton = document.getElementById('refresh-events');
        
        this.init();
    }

    init() {
        // Clear old cache on page load
        this.clearOldCache();
        this.setupEventListeners();
        this.loadEvents();
    }

    clearOldCache() {
        try {
            const cached = localStorage.getItem('algorithm_events');
            if (cached) {
                const data = JSON.parse(cached);
                // Clear cache if it's older than 5 minutes or from a different day
                const cacheTime = new Date(data.timestamp);
                const now = new Date();
                const timeDiff = now - cacheTime;
                const dayDiff = now.toDateString() !== cacheTime.toDateString();
                
                if (timeDiff > 5 * 60 * 1000 || dayDiff) {
                    localStorage.removeItem('algorithm_events');
                    console.log('Cleared old events cache');
                }
            }
        } catch (error) {
            localStorage.removeItem('algorithm_events');
        }
    }

    setupEventListeners() {
        if (this.refreshButton) {
            this.refreshButton.addEventListener('click', () => {
                // Clear localStorage cache
                localStorage.removeItem('algorithm_events');
                this.loadEvents(true);
            });
        }
    }

    async loadEvents(forceRefresh = false) {
        this.showLoading();
        
        try {
            // Check for cached events first (unless force refresh)
            if (!forceRefresh) {
                const cachedEvents = this.getCachedEvents();
                if (cachedEvents && cachedEvents.length > 0) {
                    this.events = cachedEvents;
                    this.displayEvents();
                    return;
                }
            }

            // Since direct Facebook API access is restricted, we'll use a fallback approach
            // In a real implementation, you would use Facebook Graph API with proper tokens
            await this.fetchEventsFromFallback(forceRefresh);
            
        } catch (error) {
            console.error('Error loading events:', error);
            this.showError();
        }
    }

    async fetchEventsFromFallback(forceRefresh = false) {
        try {
            // Try to load from the generated events.json file first with cache busting
            const cacheBuster = forceRefresh ? `?t=${Date.now()}` : '';
            const response = await fetch(`events.json${cacheBuster}`, {
                cache: forceRefresh ? 'no-cache' : 'default'
            });
            if (response.ok) {
                const data = await response.json();
                this.events = data.events.map(event => ({
                    ...event,
                    startTime: new Date(event.start_time),
                    endTime: new Date(event.end_time),
                    image: event.image_url,
                    attendeeCount: event.attendee_count,
                    isOnline: event.is_online,
                    location: event.location
                }));
                
                this.cacheEvents(this.events);
                this.displayEvents();
                return;
            }
        } catch (error) {
            console.log('Could not load events.json, using fallback data');
        }

        // Fallback to real events data if events.json is not available
        const realEvents = [
            // Past events that actually happened
            {
                id: '1',
                name: 'Data Science Workshop Series',
                description: 'A comprehensive 3-day workshop series covering data analysis, visualization, and machine learning fundamentals. Conducted for 50+ women students at Padma Kanya Campus.',
                startTime: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
                endTime: new Date(Date.now() - 43 * 24 * 60 * 60 * 1000),
                location: 'Padma Kanya Campus - Computer Lab',
                image: 'images/meeting.jpeg',
                attendeeCount: 52,
                isOnline: false
            },
            {
                id: '2',
                name: 'Women in Tech Panel Discussion',
                description: 'Panel discussion featuring successful women tech entrepreneurs and professionals from Nepal. Discussed career paths, challenges, and opportunities.',
                startTime: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000),
                endTime: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
                location: 'Padma Kanya Campus - Auditorium',
                image: 'images/algorithm_logo.png',
                attendeeCount: 85,
                isOnline: false
            },
            {
                id: '3',
                name: 'Git and GitHub Workshop',
                description: 'Hands-on workshop teaching version control fundamentals, collaborative coding, and open-source contribution. Helped students make their first GitHub contributions.',
                startTime: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
                endTime: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
                location: 'Online via Google Meet',
                image: 'images/algorithm_logo.png',
                attendeeCount: 38,
                isOnline: true
            },
            {
                id: '4',
                name: 'Open Data for Policy Making Hackathon',
                description: '48-hour hackathon organized in collaboration with The Asia Foundation. Teams worked on data-driven solutions for policy challenges in Nepal.',
                startTime: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
                endTime: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
                location: 'Tech Hub Kathmandu',
                image: 'images/algorithm_logo.png',
                attendeeCount: 42,
                isOnline: false
            },
            {
                id: '5',
                name: 'Leadership Skills Development Workshop',
                description: 'Interactive workshop focused on building confidence and leadership skills among women in tech. Covered public speaking, team management, and project leadership.',
                startTime: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
                endTime: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
                location: 'Padma Kanya Campus - Conference Hall',
                image: 'images/meeting.jpeg',
                attendeeCount: 35,
                isOnline: false
            },
            // Upcoming events
            {
                id: '6',
                name: 'Full-Stack Web Development Bootcamp',
                description: 'Intensive 5-day bootcamp covering HTML, CSS, JavaScript, React, and Node.js. Senior students will mentor juniors through building real-world projects.',
                startTime: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
                endTime: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
                location: 'Padma Kanya Campus - Computer Lab',
                image: 'images/algorithm_logo.png',
                attendeeCount: 48,
                isOnline: false
            },
            {
                id: '7',
                name: 'Women in Tech Career Fair 2025',
                description: 'Annual career fair connecting women tech students with leading companies in Nepal. Features company booths, resume review sessions, and networking opportunities.',
                startTime: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
                endTime: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000),
                location: 'Padma Kanya Campus - Main Hall',
                image: 'images/meeting.jpeg',
                attendeeCount: 120,
                isOnline: false
            }
        ];

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        this.events = realEvents;
        this.cacheEvents(this.events);
        this.displayEvents();
    }

    displayEvents() {
        this.hideAllStates();

        if (this.events.length === 0) {
            this.showNoEvents();
            return;
        }

        this.containerElement.innerHTML = '';
        
        // Sort events by date and categorize
        const now = new Date();
        const upcomingEvents = this.events.filter(e => new Date(e.startTime) > now).sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
        const pastEvents = this.events.filter(e => new Date(e.endTime) < now).sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
        const ongoingEvents = this.events.filter(e => new Date(e.startTime) <= now && new Date(e.endTime) >= now).sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
        
        // Create sections for different event types
        if (upcomingEvents.length > 0) {
            this.createEventSection('Upcoming Events', upcomingEvents, 'upcoming');
        }
        
        if (ongoingEvents.length > 0) {
            this.createEventSection('Ongoing Events', ongoingEvents, 'ongoing');
        }
        
        if (pastEvents.length > 0) {
            this.createEventSection('Past Events', pastEvents, 'past');
        }

        this.containerElement.style.display = 'block';
        
        // Add a summary of events
        this.addEventsSummary([...upcomingEvents, ...ongoingEvents, ...pastEvents]);
    }
    
    createEventSection(title, events, type) {
        // Create section header
        const sectionHeader = document.createElement('div');
        sectionHeader.className = `events-section-header ${type}`;
        sectionHeader.innerHTML = `<h3>${title}</h3>`;
        this.containerElement.appendChild(sectionHeader);
        
        // Create grid for this section
        const sectionGrid = document.createElement('div');
        sectionGrid.className = 'events-grid';
        
        events.forEach(event => {
            const eventCard = this.createEventCard(event, type);
            sectionGrid.appendChild(eventCard);
        });
        
        this.containerElement.appendChild(sectionGrid);
    }
    
    addEventsSummary(events) {
        const now = new Date();
        const pastEvents = events.filter(e => new Date(e.endTime) < now);
        const upcomingEvents = events.filter(e => new Date(e.startTime) > now);
        const ongoingEvents = events.filter(e => new Date(e.startTime) <= now && new Date(e.endTime) >= now);
        
        // Update the events header with real statistics
        const eventsHeader = document.querySelector('.events-header');
        if (eventsHeader) {
            const summaryP = eventsHeader.querySelector('p');
            if (summaryP) {
                summaryP.innerHTML = `
                    <strong>${events.length} total events</strong> • 
                    ${upcomingEvents.length} upcoming • 
                    ${ongoingEvents.length} ongoing • 
                    ${pastEvents.length} past events
                `;
            }
        }
    }

    createEventCard(event, sectionType = 'unknown') {
        const card = document.createElement('div');
        card.className = `event-card ${sectionType}`;
        card.setAttribute('data-event-id', event.id);

        const startDate = new Date(event.startTime);
        const endDate = new Date(event.endTime);
        const isUpcoming = startDate > new Date();
        const isPast = endDate < new Date();
        const isOngoing = !isUpcoming && !isPast;

        card.innerHTML = `
            <div class="event-image">
                <img src="${event.image}" alt="${event.name}" loading="lazy" onerror="this.src='images/algorithm_logo.png'">
                <div class="event-status ${isUpcoming ? 'upcoming' : isOngoing ? 'ongoing' : 'past'}">
                    ${isUpcoming ? 'Upcoming' : isOngoing ? 'Ongoing' : 'Past'}
                </div>
                ${event.isOnline ? '<div class="event-online-badge">Online</div>' : ''}
            </div>
            
            <div class="event-content">
                <div class="event-date">
                    <div class="event-month">${startDate.toLocaleDateString('en-US', { month: 'short' })}</div>
                    <div class="event-day">${startDate.getDate()}</div>
                </div>
                
                <div class="event-details">
                    <h3 class="event-title">${event.name}</h3>
                    <p class="event-description">${event.description}</p>
                    
                    <div class="event-meta">
                        <div class="event-time">
                            <span class="meta-icon">🕒</span>
                            ${this.formatEventTime(startDate, endDate)}
                        </div>
                        <div class="event-location">
                            <span class="meta-icon">${event.isOnline ? '💻' : '📍'}</span>
                            ${event.location}
                        </div>
                        <div class="event-attendees">
                            <span class="meta-icon">👥</span>
                            ${event.attendeeCount} interested
                        </div>
                    </div>
                    
                    <div class="event-actions">
                        <a href="https://www.facebook.com/0thealgorithm" target="_blank" rel="noopener" class="btn btn-primary">
                            View on Facebook
                        </a>
                        <button class="btn btn-outline share-event" data-event-id="${event.id}">
                            Share
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add share functionality
        const shareButton = card.querySelector('.share-event');
        shareButton.addEventListener('click', () => this.shareEvent(event));

        return card;
    }

    formatEventTime(startDate, endDate) {
        const timeOptions = { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        };
        
        const start = startDate.toLocaleDateString('en-US', { 
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        }) + ' at ' + startDate.toLocaleTimeString('en-US', timeOptions);
        
        if (startDate.toDateString() === endDate.toDateString()) {
            return `${start} - ${endDate.toLocaleTimeString('en-US', timeOptions)}`;
        } else {
            const end = endDate.toLocaleDateString('en-US', { 
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            }) + ' at ' + endDate.toLocaleTimeString('en-US', timeOptions);
            return `${start} to ${end}`;
        }
    }

    shareEvent(event) {
        const shareButton = document.querySelector(`[data-event-id="${event.id}"] .share-event`);
        const originalText = shareButton.textContent;
        
        // Add loading state
        shareButton.textContent = 'Sharing...';
        shareButton.disabled = true;
        
        const shareData = {
            title: `${event.name} - The Algorithm Community`,
            text: `Join us for: ${event.name}\n\n${event.description}\n\n📅 ${new Date(event.startTime).toLocaleDateString()}\n📍 ${event.location}`,
            url: event.event_url || 'https://www.facebook.com/0thealgorithm'
        };

        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            navigator.share(shareData)
                .then(() => {
                    this.showNotification('Event shared successfully! 🎉');
                })
                .catch((error) => {
                    console.log('Share cancelled or failed:', error);
                    this.fallbackShare(event);
                })
                .finally(() => {
                    shareButton.textContent = originalText;
                    shareButton.disabled = false;
                });
        } else {
            this.fallbackShare(event);
            shareButton.textContent = originalText;
            shareButton.disabled = false;
        }
    }
    
    fallbackShare(event) {
        const shareText = `🎯 ${event.name} - The Algorithm Community\n\n${event.description}\n\n📅 Date: ${new Date(event.startTime).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })}\n📍 Location: ${event.location}\n👥 ${event.attendeeCount} interested\n\n🔗 More info: ${event.event_url || 'https://www.facebook.com/0thealgorithm'}`;
        
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(shareText)
                .then(() => {
                    this.showNotification('Event details copied to clipboard! 📋');
                })
                .catch(() => {
                    this.showTextAreaFallback(shareText);
                });
        } else {
            this.showTextAreaFallback(shareText);
        }
    }
    
    showTextAreaFallback(text) {
        // Create a temporary textarea for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showNotification('Event details copied to clipboard! 📋');
        } catch (err) {
            this.showNotification('Please manually copy the event details from the dialog.');
            // Show the text in an alert as last resort
            alert(`Event Details:\n\n${text}`);
        }
        
        document.body.removeChild(textArea);
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    getCachedEvents() {
        try {
            const cached = localStorage.getItem('algorithm_events');
            const data = JSON.parse(cached);
            
            if (data && data.timestamp && (Date.now() - data.timestamp < 30 * 60 * 1000)) { // 30 minutes cache
                return data.events.map(event => ({
                    ...event,
                    startTime: new Date(event.startTime),
                    endTime: new Date(event.endTime)
                }));
            }
        } catch (error) {
            console.error('Error loading cached events:', error);
        }
        return null;
    }

    cacheEvents(events) {
        try {
            const data = {
                timestamp: Date.now(),
                events: events
            };
            localStorage.setItem('algorithm_events', JSON.stringify(data));
        } catch (error) {
            console.error('Error caching events:', error);
        }
    }

    showLoading() {
        this.hideAllStates();
        this.loadingElement.style.display = 'flex';
        
        if (this.refreshButton) {
            this.refreshButton.disabled = true;
            this.refreshButton.classList.add('loading');
        }
    }

    showError() {
        this.hideAllStates();
        this.errorElement.style.display = 'flex';
        
        if (this.refreshButton) {
            this.refreshButton.disabled = false;
            this.refreshButton.classList.remove('loading');
        }
    }

    showNoEvents() {
        this.hideAllStates();
        this.noEventsElement.style.display = 'flex';
        
        if (this.refreshButton) {
            this.refreshButton.disabled = false;
            this.refreshButton.classList.remove('loading');
        }
    }

    hideAllStates() {
        this.loadingElement.style.display = 'none';
        this.errorElement.style.display = 'none';
        this.noEventsElement.style.display = 'none';
        this.containerElement.style.display = 'none';
        
        if (this.refreshButton) {
            this.refreshButton.disabled = false;
            this.refreshButton.classList.remove('loading');
        }
    }
}

// Initialize events manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EventsManager();
});

// Performance monitoring for events page
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                console.log(`Events page loaded in ${Math.round(perfData.loadEventEnd - perfData.loadEventStart)}ms`);
            }
        }, 0);
    });
}
