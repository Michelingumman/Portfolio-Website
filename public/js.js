/* ================================================
   TIMELINE CONFIGURATION - MANUAL ADJUSTMENT SECTION
   ================================================ */

// DOM element references
const meContainer = document.getElementById('me-container');
const arrow = document.getElementById('arrow');
const projectTrack = document.getElementById('project-track');
const timelineContainer = document.getElementById('timeline-container');
const timelineMarkers = document.querySelectorAll('.timeline-marker');

// Global function to update opacity and arrow position based on percentage
// ADJUST: Controls when intro section fades based on horizontal movement
function updateMeContainerOpacity(nextPercentage) {
    // ADJUST: This threshold controls when the intro section disappears
    const scrollThreshold = window.innerWidth/400; 
    if (nextPercentage <= -scrollThreshold) {
        meContainer.style.opacity = '0'; // Fully disappear
        arrow.style.opacity = '0';
    }
    else {
        meContainer.style.opacity = '1'; // Fully visible
        arrow.style.opacity = '0.5'; // ADJUST: Arrow opacity
    }
    // ADJUST: Arrow movement speed and direction
    arrow.style.transform = `translate(${-0 + nextPercentage*200}%, 0)`; // ADJUST: Multiplier controls speed
}

/* ================================================
   ENHANCED TIMELINE POSITIONING - PRECISION ALIGNMENT
   ================================================ */

// Calculate distances to perfectly align markers with project cards
function positionTimelineMarkers() {
    const projects = document.querySelectorAll('#project-track > .proj');
    
    // Only proceed if we're on desktop
    if (window.innerWidth > 450) {
        // Get the exact dimensions of the project track and its cards
        const projectTrackRect = projectTrack.getBoundingClientRect();
        const projectCards = Array.from(projects);
        
        // Get the current scrollX position
        const currentScrollPercentage = parseFloat(projectTrack.dataset.prevPercentage || 0);
        
        // ADJUST: Project card dimensions - change these values to match your project cards
        const projectWidth = 40; // vmin - ADJUST: width of each project card
        const projectGap = 4;    // vmin - ADJUST: gap between project cards
        
        // Convert vmin to pixels based on current viewport
        const vMinInPx = Math.min(window.innerWidth, window.innerHeight) / 100;
        const projectWidthPx = projectWidth * vMinInPx;
        const projectGapPx = projectGap * vMinInPx;
        
        // Calculate total width in pixels
        const totalWidthVmin = (projectWidth * projects.length) + (projectGap * (projects.length - 1));
        const totalWidthPx = totalWidthVmin * vMinInPx;
        
        // Set the exact width to match the project track
        timelineContainer.style.width = `${totalWidthVmin}vmin`;
        
        // Position timeline marker exactly above each project card
        timelineMarkers.forEach((marker, index) => {
            if (index < projectCards.length) {
                // Set width to match project card exactly
                marker.style.width = `${projectWidth}vmin`;
            }
        });
        
        // Calculate actual positions of project cards in the viewport
        projectCards.forEach((card, index) => {
            if (index < timelineMarkers.length) {
                const cardRect = card.getBoundingClientRect();
                // Store the card's center position for reference
                timelineMarkers[index].dataset.cardCenterX = cardRect.left + (cardRect.width / 2);
            }
        });
        
        // Update markers position
        updateActiveMarker(currentScrollPercentage);
        
        // Set initial vertical position
        updateTimelineVerticalPosition();
    }
}

// Improved function to ensure timeline markers stay aligned with project cards
function ensureTimelineAlignment() {
    // Get the exact position and size of the project track
    const trackRect = projectTrack.getBoundingClientRect();
    const currentPercentage = parseFloat(projectTrack.dataset.prevPercentage || 0);
    
    // Apply timeline transform directly
    timelineContainer.style.transform = `translateX(calc(-50% + ${currentPercentage}%))`;
    
    // Update vertical position
    updateTimelineVerticalPosition();
    
    // Update active marker
    updateActiveMarker(currentPercentage);
}

// Update active marker based on scroll position or drag percentage
function updateActiveMarker(percentage) {
    // Calculate which project is currently in view
    // ADJUST: This affects which marker is highlighted based on scroll/drag position
    const projectIndex = Math.floor(Math.abs(percentage) / (100 / timelineMarkers.length));
    
    // Remove active class from all markers
    timelineMarkers.forEach(marker => marker.classList.remove('active'));
    
    // Add active class to current marker
    if (projectIndex < timelineMarkers.length) {
        timelineMarkers[projectIndex].classList.add('active');
    }
    
    // ADJUST: We no longer set the transform here to avoid conflicts
    // Instead, each handler (mousemove, wheel, scroll) sets the transform directly
    
    // ADJUST: Marker appearance based on position
    timelineMarkers.forEach((marker, index) => {
        const markerPercentage = (index / (timelineMarkers.length - 1)) * 100;
        const distanceFromCenter = Math.abs(Math.abs(percentage) - markerPercentage);
        
        // ADJUST: Opacity and z-index calculations for markers
        if (index === projectIndex) {
            marker.style.opacity = '1';     // ADJUST: Active marker opacity (1 = fully visible)
            marker.style.zIndex = '5';      // ADJUST: Active marker layer (higher appears on top)
        } else {
            // ADJUST: Formula for inactive marker opacity
            const opacity = 0.7 - (distanceFromCenter / 120); // ADJUST: Change 120 to adjust fade rate
            marker.style.opacity = Math.max(0.5, opacity).toString(); // ADJUST: Minimum opacity (0.5)
            marker.style.zIndex = '1';      // ADJUST: Inactive marker layer
        }
    });
}

// New function to update the timeline's vertical position in real time
function updateTimelineVerticalPosition() {
    if (window.innerWidth <= 450) return; // Skip for mobile
    
    const projectTrackRect = projectTrack.getBoundingClientRect();
    const cardTop = projectTrackRect.top - 80; // ADJUST: 80px above cards - increase for more space
        
    // ADJUST: Minimum top position (prevents going off screen)
    timelineContainer.style.top = `${Math.max(20, cardTop)}px`; // ADJUST: 20px minimum from top
}

// Add debouncing to avoid excessive recalculations during resize
let resizeTimeout;
function handleResize() {
    // Clear the timeout if it exists
    if (resizeTimeout) clearTimeout(resizeTimeout);
    
    // Set a timeout to run the resize logic
    resizeTimeout = setTimeout(() => {
        // First reset any transforms to get accurate measurements
        const currentPercentage = parseFloat(projectTrack.dataset.prevPercentage || 0);
        
        // Completely reposition markers based on current layout
        positionTimelineMarkers();
        
        // Force update timeline positions to match current project track
        ensureTimelineAlignment();
    }, 100); // 100ms delay for performance
}

// Initialize timeline position
document.addEventListener('DOMContentLoaded', () => {
    positionTimelineMarkers();
    updateActiveMarker(0); // Activate first marker by default
});

// Update timeline on window resize with improved handler
window.addEventListener('resize', handleResize);

document.addEventListener('dragstart', function(event) {
    event.preventDefault(); // Prevent dragging
});

if (window.innerWidth > 450) { // For Desktop screens
    /* ================================================
       DESKTOP INTERACTION SETTINGS
       ================================================ */
       
    // ADJUST: Mouse interaction for dragging the project track
    window.onmousedown = e => {
        projectTrack.dataset.mouseDownAt = e.clientX;
    };

    window.onmousemove = e => {
        if (projectTrack.dataset.mouseDownAt === "0") return;

        // ADJUST: These values control how fast the track moves when dragged
        const mouseDelta = parseFloat(projectTrack.dataset.mouseDownAt) - e.clientX,
            maxDelta = window.innerWidth / 2; // ADJUST: Controls sensitivity of drag

        const percentage = (mouseDelta / maxDelta) / 2 * -100;
        let nextPercentage = parseFloat(projectTrack.dataset.prevPercentage || 0) + percentage;

        nextPercentage = Math.max(Math.min(nextPercentage, 0), -100); // Clamping the value

        projectTrack.dataset.percentage = nextPercentage;

        // ADJUST: Apply the transform directly for immediate response
        projectTrack.style.transform = `translate(${nextPercentage}%, -50%)`;
        
        // Then animate for smooth transition
        projectTrack.animate({
            transform: `translate(${nextPercentage}%, -50%)`
        }, { duration: 1200, fill: "forwards" }); // ADJUST: Duration in milliseconds

        // ADJUST: Animation for project card background position
        for (const image of projectTrack.getElementsByClassName("proj")) {
            image.animate({
                backgroundPosition: `${100 + nextPercentage}% center`
            }, { duration: 1000, fill: "forwards" }); // ADJUST: Duration in milliseconds
        }

        // CRITICAL: Apply timeline transform directly for immediate response
        // Account for current viewport size
        const viewportWidth = window.innerWidth;
        timelineContainer.style.transform = `translateX(calc(-50% + ${nextPercentage}%))`;
        
        // Then animate the timeline for smooth transition
        timelineContainer.animate({
            transform: `translateX(calc(-50% + ${nextPercentage}%))`
        }, { duration: 1200, fill: "forwards" });

        // Update timeline vertical position for precise alignment
        updateTimelineVerticalPosition();

        // ADJUST: Controls when intro section fades based on horizontal movement
        updateMeContainerOpacity(nextPercentage);
        
        // Update timeline active marker
        updateActiveMarker(nextPercentage);
    };

    window.onmouseup = () => {
        projectTrack.dataset.mouseDownAt = "0";
        projectTrack.dataset.prevPercentage = projectTrack.dataset.percentage;
    };

    // ADJUST: Wheel/scroll behavior for horizontal project navigation
    window.onwheel = e => {
        // ADJUST: These values control scrolling sensitivity
        const maxDelta = window.innerWidth / 2;
        const scrollDelta = e.deltaY / 5; // ADJUST: Smaller divisor = more sensitive scrolling
        const percentage = (scrollDelta / maxDelta) * -100;
        let nextPercentage = parseFloat(projectTrack.dataset.prevPercentage || 0) + percentage;

        nextPercentage = Math.max(Math.min(nextPercentage, 0), -100); // Clamping the value

        projectTrack.dataset.percentage = nextPercentage;
        
        // CRITICAL: Store the percentage immediately to ensure timeline syncs correctly
        projectTrack.dataset.prevPercentage = nextPercentage;

        // ADJUST: Apply the transform directly for immediate response
        projectTrack.style.transform = `translate(${nextPercentage}%, -50%)`;
        
        // Then animate for smooth transition
        projectTrack.animate({
            transform: `translate(${nextPercentage}%, -50%)`
        }, { duration: 1200, fill: "forwards" }); // ADJUST: Duration in milliseconds

        // ADJUST: Animation for project backgrounds during scrolling
        for (const image of projectTrack.getElementsByClassName("proj")) {
            image.animate({
                backgroundPosition: `${100 + nextPercentage}% center`
            }, { duration: 1000, fill: "forwards" }); // ADJUST: Duration in milliseconds
        }

        // CRITICAL: Apply timeline transform directly for immediate response - compensate for viewport size
        // The transform calculation takes into account the current viewport size
        const viewportWidth = window.innerWidth;
        timelineContainer.style.transform = `translateX(calc(-50% + ${nextPercentage}%))`;
        
        // Then animate the timeline for smooth transition
        timelineContainer.animate({
            transform: `translateX(calc(-50% + ${nextPercentage}%))`
        }, { duration: 1200, fill: "forwards" });

        // Update timeline vertical position for accurate alignment
        updateTimelineVerticalPosition();

        // CRITICAL: Update arrow and opacity immediately for wheel events
        // Apply opacity changes directly first for immediate feedback
        if (nextPercentage <= -(window.innerWidth/400)) {
            meContainer.style.opacity = '0';
            arrow.style.opacity = '0';
        } else {
            meContainer.style.opacity = '1';
            arrow.style.opacity = '0.5';
        }
        
        // Move the arrow directly for immediate feedback
        arrow.style.transform = `translate(${-0 + nextPercentage*200}%, 0)`;
        
        // Then call the function for consistency with other events
        updateMeContainerOpacity(nextPercentage);
        
        // Update timeline markers
        updateActiveMarker(nextPercentage);
        
        // Prevent default scrolling behavior
        e.preventDefault();
    };

    // DESKTOP: Handles vertical scrolling behavior 
    window.onscroll = () => {
        let scrollY = window.scrollY;

        // ADJUST: Fade rate of intro section when scrolling
        let opacityValue = Math.max(1 - scrollY / 200, 0); // ADJUST: Change 200 to adjust fade speed
        meContainer.style.opacity = opacityValue.toString();

        // ADJUST: Project track vertical movement with scroll
        let trackOffset = scrollY / 2; // ADJUST: Smaller divisor = faster movement
        
        // Apply project track transform directly
        projectTrack.style.transform = `translate(-50%, ${trackOffset}px)`;
        
        // Calculate the horizontal percentage equivalent for the timeline
        const horizontalPercentage = -scrollY / 2;
        
        // Apply timeline horizontal transform directly, accounting for viewport size
        const viewportWidth = window.innerWidth;
        timelineContainer.style.transform = `translateX(calc(-50% + ${horizontalPercentage}%))`;
        
        // Update timeline vertical position to stay above cards
        updateTimelineVerticalPosition();

        // CRITICAL: Direct arrow movement for vertical scrolling
        // Move the arrow directly based on horizontal percentage
        arrow.style.transform = `translate(${-0 + horizontalPercentage*200}%, 0)`;
        
        // Apply opacity threshold directly
        if (horizontalPercentage <= -(window.innerWidth/400)) {
            arrow.style.opacity = '0';
        } else {
            arrow.style.opacity = '0.5';
        }
        
        // Then call the update function for consistency
        updateMeContainerOpacity(horizontalPercentage);
        updateActiveMarker(horizontalPercentage);
    };

    // ADJUST: Project click functionality (desktop)
    const projects = document.querySelectorAll('#project-track > .proj');
    
    projects.forEach(proj => {
        proj.addEventListener('click', function(event) {
            // ADJUST: Click behavior and hover duration
            // Prevent the default action if the class is not already 'hovered'
            if (!this.classList.contains('hovered')) {
                event.preventDefault(); // Prevent redirection
                this.classList.add('hovered');
        
                // Remove the hovered class after a short duration
                setTimeout(() => {
                    this.classList.remove('hovered');
                }, 2000); // ADJUST: Hover effect duration in milliseconds
            } else {
                // If already hovered, redirect to href
                window.location.href = this.href;
            }
        });
    });
} 
else { // For Mobile screens
    /* ================================================
       MOBILE INTERACTION SETTINGS
       ================================================ */
       
    // ADJUST: Special handling for Apple devices
    function isAppleDevice() {
        return /iPhone|iPad|iPod/i.test(navigator.userAgent);
    }
    
    if (isAppleDevice()) {
        // ADJUST: Project track position on Apple devices 
        document.getElementById('project-track').style.top = '280%'; // ADJUST: May need to be higher/lower
    }

    // ADJUST: Mobile scrolling behavior for timeline
    window.onscroll = () => {
        let scrollY = window.scrollY;
        updateMeContainerOpacity(scrollY);
        
        // ADJUST: Mobile timeline positioning logic
        const projectTrackTop = projectTrack.getBoundingClientRect().top;
        const viewportHeight = window.innerHeight;
        const projects = document.querySelectorAll('#project-track > .proj');
        
        // ADJUST: Define scroll ranges for mobile timeline
        // Each project gets an equal portion of the scroll range
        const scrollRange = (projectTrack.offsetHeight + viewportHeight) / projects.length;
        
        // ADJUST: Mobile timeline marker activation based on which project is in view
        projects.forEach((project, index) => {
            const projectPosition = project.getBoundingClientRect().top;
            // ADJUST: When a project is considered "in view" on mobile
            const isInView = projectPosition > 0 && projectPosition < viewportHeight;
            
            if (isInView) {
                // Update the active marker based on which project is in view
                updateActiveMarker(index * (100 / projects.length));
            }
        });
    };
    
    // ADJUST: Mobile arrow animation
    const arrowMobile = document.getElementById('arrow-mobile');
    const scrollDistance = document.documentElement.scrollHeight - window.innerHeight;

    // ADJUST: Mobile opacity and arrow position based on scroll
    function updateMeContainerOpacity(scrollY) {
        // ADJUST: Fade speed for intro section on mobile
        const opacityValue = Math.max(1 - scrollY / 50, 0); // ADJUST: Change 50 to adjust fade speed
        meContainer.style.opacity = opacityValue.toString();
        arrowMobile.style.opacity = opacityValue.toString();

        // ADJUST: Arrow movement speed on mobile
        let translateValue = (scrollY / scrollDistance) * 100; // ADJUST: Controls arrow movement

        // ADJUST: Mobile arrow animation - change multiplier to adjust speed
        arrowMobile.style.transform = `translate(0, -${translateValue*100}%)`; // ADJUST: Change 100 to adjust speed
    }

    // Add event listener for scroll to update position and opacity
    window.addEventListener('scroll', () => {
        let scrollY = window.scrollY;
        updateMeContainerOpacity(scrollY);
    });

    // ADJUST: Project click functionality (mobile)
    const projects = document.querySelectorAll('#project-track > .proj');
    
    projects.forEach(proj => {
        proj.addEventListener('click', function(event) {
            // ADJUST: Click behavior and hover duration for mobile
            // Prevent the default action if the class is not already 'hovered'
            if (!this.classList.contains('hovered')) {
                event.preventDefault(); // Prevent redirection
                this.classList.add('hovered');
        
                // Show the hover effect by adjusting the style in the class
                const afterElement = window.getComputedStyle(this, '::after');
                const opacity = afterElement.getPropertyValue('opacity');
                this.style.setProperty('--hover-opacity', 1); // ADJUST: Set hover opacity (1 = fully visible)
        
                // Remove the hovered class after a short duration
                setTimeout(() => {
                    this.classList.remove('hovered');
                    this.style.setProperty('--hover-opacity', 0); // Reset the opacity
                }, 2000); // ADJUST: Hover effect duration in milliseconds
            } else {
                // If already hovered, redirect to href in new tab
                window.open(this.href, '_blank');
            }
        });
    });
}