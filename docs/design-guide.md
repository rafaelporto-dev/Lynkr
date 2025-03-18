# Lynkr Design Guide

## Introduction

This design guide documents the visual design language, components, and patterns used in the Lynkr application. It serves as a reference to maintain consistency across the platform and guide future design decisions.

## Color Palette

### Primary Colors

- **Indigo**: `#4f46e5` (indigo-600)
  - Lighter: `#6366f1` (indigo-500)
  - Darker: `#4338ca` (indigo-700)
- **Purple**: `#9333ea` (purple-600)
  - Lighter: `#a855f7` (purple-500)
  - Darker: `#7e22ce` (purple-700)

### Neutral Colors

- **Black**: `#000000`
- **White**: `#ffffff`
- **Gray Shades**:
  - Gray-950: `#0a0a0a`
  - Gray-900: `#171717`
  - Gray-800: `#262626`
  - Gray-700: `#404040`
  - Gray-500: `#737373`
  - Gray-400: `#a3a3a3`
  - Gray-300: `#d4d4d4`
  - Gray-200: `#e5e5e5`

### Accent Colors (Used in Buttons & Highlights)

- Indigo-Purple Gradient: `bg-gradient-to-r from-indigo-600 to-purple-600`
- Hover State: `bg-gradient-to-r from-indigo-500 to-purple-500`

## Typography

### Font Family

- Primary: Inter (Sans-serif)
- System Font Stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`

### Font Sizes

- Headings:
  - H1: `text-4xl` (2.25rem)
  - H2: `text-3xl` (1.875rem)
  - H3: `text-2xl` (1.5rem)
  - H4: `text-xl` (1.25rem)
- Body Text:
  - Regular: `text-base` (1rem)
  - Small: `text-sm` (0.875rem)
  - Extra Small: `text-xs` (0.75rem)

### Font Weights

- Regular: `font-normal` (400)
- Medium: `font-medium` (500)
- Bold: `font-bold` (700)

## Backgrounds

### Gradients

- Main Background: `bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-gray-900 to-black`
- Noise Texture: Subtle SVG noise pattern with opacity of 0.03

### Cards & Containers

- Primary Card: `backdrop-blur-lg bg-white/[0.04] border border-white/10`
- Form Fields: `bg-gray-900/70 border-white/10`

## Components

### Buttons

#### Primary Button

- Base Style: `bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-md font-medium transition-all duration-300 shadow-lg shadow-indigo-600/30`
- Advanced Style with Animation:
  ```html
  <button
    class="w-full relative overflow-hidden bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-md font-medium transition-all duration-300 shadow-lg shadow-indigo-600/30 group"
  >
    <span class="relative z-10">Button Text</span>
    <span
      class="absolute inset-0 bg-gradient-to-r from-indigo-700 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    ></span>
    <span
      class="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 w-0 group-hover:w-full transition-all duration-500 ease-in-out"
    ></span>
  </button>
  ```

#### Secondary Button (Link Style)

- Style: `text-indigo-400 hover:text-indigo-300 transition-colors duration-300`

### Form Elements

#### Input Fields

- Base Style: `w-full pl-10 bg-gray-900/70 border-white/10 focus:border-indigo-500 focus:ring-indigo-500/30 transition-all duration-300 text-gray-200`
- With Icon:
  ```html
  <div class="relative group">
    <input
      class="w-full pl-10 bg-gray-900/70 border-white/10 focus:border-indigo-500 focus:ring-indigo-500/30 transition-all duration-300 text-gray-200"
    />
    <div
      class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors duration-300"
    >
      <!-- Icon SVG -->
    </div>
    <div
      class="absolute inset-0 rounded-md border border-indigo-500/0 group-focus-within:border-indigo-500/50 pointer-events-none transition-all duration-300"
    ></div>
  </div>
  ```

#### Labels

- Style: `text-sm font-medium text-gray-200`

### Effects & Animations

#### Transitions

- Standard Transition: `transition-all duration-300`
- Hover Scaling: `transform hover:scale-[1.02]`
- Focus Highlighting: `group-focus-within:text-indigo-400`

#### Glassmorphism

- Card Blur Effect: `backdrop-blur-lg bg-white/[0.04]`
- Translucent Borders: `border border-white/10`

#### Shadows

- Button Shadow: `shadow-lg shadow-indigo-600/30`
- Card Shadow: `shadow-2xl shadow-indigo-900/20 hover:shadow-indigo-800/30`

## Page Layout Patterns

### Authentication Pages

1. **Centered Content Layout**:

   - Full-height container with flex centering
   - Maximum width of form container: `max-w-md`
   - Vertical spacing between elements: `space-y-8`

2. **Form Structure**:

   - Header with title and subtitle
   - Form fields with labels and helper text
   - Primary action button
   - Secondary options (links)
   - Legal information at bottom

3. **Visual Hierarchy**:
   - Large, gradient text for main heading
   - Clear field labels
   - Bold, attention-grabbing submit button
   - Subtle helper text and links

## Accessibility Considerations

- Text contrast ratios meet WCAG 2.1 AA standards
- Focus states are clearly visible
- Interactive elements have adequate hit areas
- Form elements have appropriate labels and descriptions

## Responsive Design

- Mobile-first approach
- Form width adapts to screen size
- Padding adjusts based on breakpoints:
  - Small screens: `px-4 py-12`
  - Medium/large screens: Standard padding

## Implementation Guidelines

### Tailwind CSS Classes

The design system leverages Tailwind CSS for implementing styles. Key utility classes include:

- **Layout**: `flex`, `grid`, `justify-center`, `items-center`
- **Spacing**: `space-y-6`, `space-x-4`, `gap-5`, `p-8`
- **Typography**: `text-4xl`, `font-medium`, `tracking-tight`
- **Colors**: `text-white`, `bg-gray-900`, `text-indigo-400`
- **Effects**: `backdrop-blur-lg`, `shadow-lg`, `transition-all`

### Custom Classes and Components

For more complex components or repeated patterns, extract them into reusable components.

## File Organization

- UI components in `/components/ui/*`
- Auth-related components in `/app/(auth)/*`
- Shared layout components in `/components/*`

## Design Assets

- Design tokens defined in Tailwind config
- SVG icons for UI elements
- Noise pattern: `/public/noise.svg`
