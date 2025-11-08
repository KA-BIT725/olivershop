// Contact form functionality

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
});

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Validate form
    if (!name || !email || !subject || !message) {
        showNotification('Please fill in all required fields!', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address!', 'error');
        return;
    }
    
    // Show loading state
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate form submission (in real app, this would send to server)
    setTimeout(() => {
        // Reset form
        document.getElementById('contactForm').reset();
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Show success message
        showNotification('Thank you for contacting us! We\'ll get back to you soon.', 'success');
        
        // Optionally, save to localStorage for demo purposes
        const formData = {
            name,
            email,
            phone,
            subject,
            message,
            timestamp: new Date().toISOString()
        };
        
        let submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
        submissions.push(formData);
        localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
        
    }, 1500);
}

function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Add styles for success and error
    if (type === 'error') {
        notification.style.backgroundColor = '#f44336';
    } else {
        notification.style.backgroundColor = '#4CAF50';
    }
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide and remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// Add real-time validation
document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.value && !emailRegex.test(this.value)) {
                this.style.borderColor = '#f44336';
                showFieldError(this, 'Please enter a valid email address');
            } else {
                this.style.borderColor = '';
                removeFieldError(this);
            }
        });
    }
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            // Format phone number as user types
            let value = this.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value.length <= 3) {
                    value = `(${value}`;
                } else if (value.length <= 6) {
                    value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                } else {
                    value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                }
            }
            this.value = value;
        });
    }
});

function showFieldError(field, message) {
    removeFieldError(field);
    const error = document.createElement('span');
    error.className = 'field-error';
    error.textContent = message;
    error.style.color = '#f44336';
    error.style.fontSize = '0.875rem';
    error.style.marginTop = '0.25rem';
    field.parentElement.appendChild(error);
}

function removeFieldError(field) {
    const error = field.parentElement.querySelector('.field-error');
    if (error) {
        error.remove();
    }
}
