const TALKS_DATA = [
    {
        id: 'talk1',
        title: 'Introduction to WebAssembly',
        speakers: ['Alice Smith'],
        category: ['Web Development', 'Performance'],
        duration: 60, // minutes
        description: 'An introduction to WebAssembly and its applications in modern web development.'
    },
    {
        id: 'talk2',
        title: 'Building Scalable Microservices with Node.js',
        speakers: ['Bob Johnson', 'Carol White'],
        category: ['Backend', 'Node.js', 'Architecture'],
        duration: 60,
        description: 'Learn best practices for designing and implementing scalable microservices using Node.js.'
    },
    {
        id: 'talk3',
        title: 'Deep Dive into React Hooks',
        speakers: ['David Green'],
        category: ['Frontend', 'React', 'JavaScript'],
        duration: 60,
        description: 'Explore advanced patterns and common pitfalls when using React Hooks in your applications.'
    },
    {
        id: 'talk4',
        title: 'State Management with XState',
        speakers: ['Eve Black'],
        category: ['Frontend', 'State Management', 'JavaScript'],
        duration: 60,
        description: 'Understand how to model complex application logic using state machines with XState.'
    },
    {
        id: 'talk5',
        title: 'Containerizing Applications with Docker and Kubernetes',
        speakers: ['Frank Blue'],
        category: ['DevOps', 'Cloud Native', 'Containers'],
        duration: 60,
        description: 'A practical guide to deploying and managing containerized applications with Docker and Kubernetes.'
    },
    {
        id: 'talk6',
        title: 'Securing Your APIs: Best Practices',
        speakers: ['Grace Purple', 'Henry Yellow'],
        category: ['Security', 'Backend', 'API'],
        duration: 60,
        description: 'Learn essential security practices to protect your APIs from common vulnerabilities.'
    }
];

const EVENT_START_TIME = { hour: 10, minute: 0 }; // 10:00 AM
const TALK_DURATION = 60; // minutes
const TRANSITION_DURATION = 10; // minutes
const LUNCH_BREAK_DURATION = 60; // minutes
const LUNCH_BREAK_AFTER_TALK = 2; // Lunch break after the 2nd talk

function calculateSchedule(talks) {
    let currentHour = EVENT_START_TIME.hour;
    let currentMinute = EVENT_START_TIME.minute;
    let talkCounter = 0;

    return talks.map((talk, index) => {
        const startTime = new Date();
        startTime.setHours(currentHour, currentMinute, 0, 0);

        talkCounter++;

        currentMinute += talk.duration;
        if (currentMinute >= 60) {
            currentHour += Math.floor(currentMinute / 60);
            currentMinute %= 60;
        }

        const endTime = new Date();
        endTime.setHours(currentHour, currentMinute, 0, 0);

        const scheduledTalk = {
            ...talk,
            startTime: startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            endTime: endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        if (talkCounter === LUNCH_BREAK_AFTER_TALK) {
            // Add transition before lunch
            currentMinute += TRANSITION_DURATION;
            if (currentMinute >= 60) {
                currentHour += Math.floor(currentMinute / 60);
                currentMinute %= 60;
            }

            // Add lunch break
            const lunchStartTime = new Date();
            lunchStartTime.setHours(currentHour, currentMinute, 0, 0);
            
            currentMinute += LUNCH_BREAK_DURATION;
            if (currentMinute >= 60) {
                currentHour += Math.floor(currentMinute / 60);
                currentMinute %= 60;
            }
            const lunchEndTime = new Date();
            lunchEndTime.setHours(currentHour, currentMinute, 0, 0);

            scheduledTalk.postEvent = {
                type: 'lunch',
                duration: LUNCH_BREAK_DURATION,
                startTime: lunchStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                endTime: lunchEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
        } else if (index < talks.length - 1) { // Add transition after talk, but not after the last one
            currentMinute += TRANSITION_DURATION;
            if (currentMinute >= 60) {
                currentHour += Math.floor(currentMinute / 60);
                currentMinute %= 60;
            }
        }

        return scheduledTalk;
    });
}

const SCHEDULED_TALKS = calculateSchedule(TALKS_DATA);

// Function to render the schedule (will be implemented in the next step)
function renderSchedule(talksToRender) {
    const scheduleContainer = document.getElementById('schedule-container');
    if (!scheduleContainer) return;

    scheduleContainer.innerHTML = ''; // Clear previous schedule

    talksToRender.forEach(talk => {
        const talkElement = document.createElement('div');
        talkElement.classList.add('talk-card');
        talkElement.innerHTML = `
            <h3>${talk.title}</h3>
            <p><strong>Time:</strong> ${talk.startTime} - ${talk.endTime}</p>
            <p><strong>Speakers:</strong> ${talk.speakers.join(', ')}</p>
            <p><strong>Category:</strong> ${talk.category.join(', ')}</p>
            <p>${talk.description}</p>
        `;
        scheduleContainer.appendChild(talkElement);

        if (talk.postEvent && talk.postEvent.type === 'lunch') {
            const lunchElement = document.createElement('div');
            lunchElement.classList.add('lunch-break');
            lunchElement.innerHTML = `
                <h4>Lunch Break</h4>
                <p><strong>Time:</strong> ${talk.postEvent.startTime} - ${talk.postEvent.endTime}</p>
            `;
            scheduleContainer.appendChild(lunchElement);
        } else if (talk !== talksToRender[talksToRender.length -1]) {
            const transitionElement = document.createElement('div');
            transitionElement.classList.add('transition');
            transitionElement.innerHTML = `<p>Transition (10 min)</p>`;
            scheduleContainer.appendChild(transitionElement);
        }
    });
}

// Search functionality (will be implemented in the next step)
function setupSearch() {
    const searchInput = document.getElementById('search-category');
    const searchButton = document.getElementById('search-button');

    if (!searchInput || !searchButton) return;

    const performSearch = () => {
        const query = searchInput.value.toLowerCase();
        const filteredTalks = SCHEDULED_TALKS.filter(talk =>
            talk.category.some(cat => cat.toLowerCase().includes(query))
        );
        renderSchedule(filteredTalks);
    };

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    });
}

// Initial render
document.addEventListener('DOMContentLoaded', () => {
    renderSchedule(SCHEDULED_TALKS);
    setupSearch();
});
