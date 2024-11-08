const meContainer = document.getElementById('me-container');
const arrow = document.getElementById('arrow');
const projectTrack = document.getElementById('project-track');


document.addEventListener('dragstart', function(event) {
    event.preventDefault(); // Prevent dragging
});

if (window.innerWidth > 450) { // For Desktop screens


    function updateMeContainerOpacity(nextPercentage) {
        const scrollThreshold = window.innerWidth/400;
        if (nextPercentage <= -scrollThreshold) {
            meContainer.style.opacity = '0'; // Fully disappear
            arrow.style.opacity = '0';
        }
        else {
            meContainer.style.opacity = '1'; // Fully visible
            arrow.style.opacity = '0.5';
        }
        arrow.style.transform = `translate(${-0 + nextPercentage*70}%, 0)`;
    }


    const projects = document.querySelectorAll('#project-track > .proj');

    projects.forEach(proj => {
        proj.addEventListener('click', function(event) {
            // Prevent the default action if the class is not already 'hovered'
            if (!this.classList.contains('hovered')) {
                event.preventDefault(); // Prevent redirection
                this.classList.add('hovered');
    
                // Remove the hovered class after a short duration
                setTimeout(() => {
                    this.classList.remove('hovered');
                }, 2000); // Adjust duration as needed
            } else {
                // If already hovered, redirect to href
                window.location.href = this.href;
            }
        });
    });
    


    window.onmousedown = e => {
        projectTrack.dataset.mouseDownAt = e.clientX;
    };

    window.onmousemove = e => {
        if (projectTrack.dataset.mouseDownAt === "0") return;

        const mouseDelta = parseFloat(projectTrack.dataset.mouseDownAt) - e.clientX,
            maxDelta = window.innerWidth / 2;

        const percentage = (mouseDelta / maxDelta) / 2 * -100;
        let nextPercentage = parseFloat(projectTrack.dataset.prevPercentage) + percentage;

        nextPercentage = Math.max(Math.min(nextPercentage, 0), -100); // Clamping the value

        projectTrack.dataset.percentage = nextPercentage;

        projectTrack.animate({
            transform: `translate(${nextPercentage}%, -50%)`
        }, { duration: 1200, fill: "forwards" });

        for (const image of projectTrack.getElementsByClassName("proj")) {
            image.animate({
                backgroundPosition: `${100 + nextPercentage}% center`
            }, { duration: 1000, fill: "forwards" });
        }

        // Update opacity based on current percentage
        function updateMeContainerOpacity(nextPercentage) {
            const scrollThreshold = window.innerWidth/400;
            if (nextPercentage <= -scrollThreshold) {
                meContainer.style.opacity = '0'; // Fully disappear
                arrow.style.opacity = '0';
            }
            else {
                meContainer.style.opacity = '1'; // Fully visible
                arrow.style.opacity = '0.5';
            }
            arrow.style.transform = `translate(${-0 + nextPercentage*200}%, 0)`;
        }
        updateMeContainerOpacity(nextPercentage);
    };

    window.onmouseup = () => {
        projectTrack.dataset.mouseDownAt = "0";
        projectTrack.dataset.prevPercentage = projectTrack.dataset.percentage;
    };

    window.onwheel = e => {
        const maxDelta = window.innerWidth / 2;
        const scrollDelta = e.deltaY / 5;
        const percentage = (scrollDelta / maxDelta) * -100;
        let nextPercentage = parseFloat(projectTrack.dataset.prevPercentage) + percentage;

        nextPercentage = Math.max(Math.min(nextPercentage, 0), -100); // Clamping the value

        projectTrack.dataset.percentage = nextPercentage;

        projectTrack.animate({
            transform: `translate(${nextPercentage}%, -50%)`
        }, { duration: 1200, fill: "forwards" });

        projectTrack.dataset.prevPercentage = nextPercentage;

        for (const image of projectTrack.getElementsByClassName("proj")) {
            image.animate({
                backgroundPosition: `${100 + nextPercentage}% center`
            }, { duration: 1000, fill: "forwards" });
        }

        // Update opacity based on current percentage
        updateMeContainerOpacity(nextPercentage);
    };

    window.onscroll = () => {
        let scrollY = window.scrollY;

        // Calculate the fading effect for the 'me-container'
        let opacityValue = Math.max(1 - scrollY / 200, 0);
        meContainer.style.opacity = opacityValue.toString();

        // Adjust the position of 'project-track' based on scroll
        let trackOffset = scrollY / 2; // Adjust speed as necessary
        projectTrack.style.transform = `translate(-50%, ${trackOffset}px)`;

        // Update the opacity of meContainer based on scroll position
        updateMeContainerOpacity(-scrollY / 2); // Use negative scrollY for percentage
    };

    
} 








else { // For Mobile screens

    
    function isAppleDevice() {
        return /iPhone|iPad|iPod/i.test(navigator.userAgent);
    }
    
    if (isAppleDevice()) {
        // Apply styles for Apple devices
        document.getElementById('project-track').style.top = '280%';
    
    }





    window.onscroll = () => {
        let scrollY = window.scrollY; // Corrected to window.scrollY
        updateMeContainerOpacity(scrollY);
    };
    
    
    const arrowMobile = document.getElementById('arrow-mobile');
    const scrollDistance = document.documentElement.scrollHeight - window.innerHeight;

    // Function to update opacity and position based on scroll position
    function updateMeContainerOpacity(scrollY) {
        const opacityValue = Math.max(1 - scrollY / 50, 0); // Change the denominator to adjust speed
        meContainer.style.opacity = opacityValue.toString();
        arrowMobile.style.opacity = opacityValue.toString();

        // Calculate translateValue dynamically based on scrollY
        let translateValue = (scrollY / scrollDistance) * 100; // Move proportionally to scroll

        // Update the arrowMobile's position based on scroll
        arrowMobile.style.transform = `translate(0, -${translateValue*100}%)`;
    }

    // Add event listener for scroll to update position and opacity
    window.addEventListener('scroll', () => {
        let scrollY = window.scrollY;
        updateMeContainerOpacity(scrollY);
    });



    const projects = document.querySelectorAll('#project-track > .proj');

    projects.forEach(proj => {
        proj.addEventListener('click', function(event) {
            // Prevent the default action if the class is not already 'hovered'
            if (!this.classList.contains('hovered')) {
                event.preventDefault(); // Prevent redirection
                this.classList.add('hovered');
    
                // Show the hover effect by adjusting the style in the class
                const afterElement = window.getComputedStyle(this, '::after');
                const opacity = afterElement.getPropertyValue('opacity');
                this.style.setProperty('--hover-opacity', 1); // Set a CSS variable for opacity
    
                // Remove the hovered class after a short duration
                setTimeout(() => {
                    this.classList.remove('hovered');
                    this.style.setProperty('--hover-opacity', 0); // Reset the opacity
                }, 2000); // Adjust duration as needed
            } else {
                // If already hovered, redirect to href
                window.location.href = this.href;
            }
        });
    });
    

}