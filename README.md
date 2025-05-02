# Finosauras Internship Report

An interactive, data-driven visualization of my first four months at Finosauras, showcasing projects, skills growth, and future goals.

## Features

- Interactive 3D particle background with Three.js
- Data visualizations created with D3.js:
  - Time allocation donut chart
  - Skills constellation chart
  - Project timeline with interactive nodes
  - Growth radar chart
- Animated UI components with Framer Motion
- Mobile-responsive design
- Smooth scrolling navigation

## Technologies Used

- Next.js 15.3 (App Router)
- React 19
- TypeScript
- D3.js for data visualizations
- Three.js for 3D background effects
- Framer Motion for animations
- Tailwind CSS 4 for styling

## Running the Project

### Prerequisites

- Node.js 20+ and npm (or yarn/pnpm)

### Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

1. Build the project:
   ```bash
   npm run build
   ```
2. Start the production server:
   ```bash
   npm run start
   ```

## Project Structure

- `src/app/` - Next.js app pages, global styles, and layout
- `src/components/` - React components for each visualization section
- `public/icons/` - SVG icons for skill representation

## Visualization Sections

1. **Hero** - Animated 3D particle background
2. **Time Allocation** - Donut chart showing how time was spent
3. **Skills Constellation** - Interactive chart showing skill growth
4. **Project Timeline** - Flowing timeline of completed and ongoing projects
5. **Key Learnings** - Animated cards showing key competencies gained
6. **Future Goals** - Radar chart and cards showing improvement areas and goals

## Credits

- Created as a internship progress report for Finosauras
- Visual design inspired by modern interactive dashboards
- Icons from various open-source libraries
