# Personal Website

A modern, responsive personal website built with HTML, CSS, and JavaScript.

## Features

- Responsive design that works on all devices
- Smooth scrolling navigation
- Animated sections and transitions
- Mobile-friendly hamburger menu
- Hero section with call-to-action buttons
- About section with skills showcase
- Projects portfolio grid
- Contact form
- Social media links

## Structure

```
personal-website-v2/
├── index.html      # Main HTML file
├── styles.css      # Styling and animations
├── script.js       # Interactive functionality
└── README.md       # Documentation
```

## Getting Started

1. Clone this repository
2. Open `index.html` in your web browser
3. Customize the content with your own information

## Customization

### Update Personal Information

Edit the following in `index.html`:

- Replace "Your Name" with your actual name
- Update the hero subtitle with your title/role
- Modify the about section with your bio
- Update skills in the skill tags
- Add your projects to the projects grid
- Update social media links in the contact section

### Change Colors

Modify the CSS variables in `styles.css`:

```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #8b5cf6;
    --text-color: #1f2937;
    /* ... other variables */
}
```

### Add Your Projects

Replace the placeholder projects in the projects section with your own:

```html
<div class="project-card">
    <div class="project-image">
        <img src="your-image.jpg" alt="Project Name">
    </div>
    <div class="project-info">
        <h3>Your Project Name</h3>
        <p>Description of your project</p>
        <div class="project-links">
            <a href="#" class="project-link">View Project</a>
            <a href="#" class="project-link">GitHub</a>
        </div>
    </div>
</div>
```

## Deployment

You can deploy this website to:

- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

### GitHub Pages

1. Push your code to GitHub
2. Go to repository Settings > Pages
3. Select your branch and root directory
4. Your site will be live at `https://yourusername.github.io/repository-name`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - Feel free to use this template for your personal website!
