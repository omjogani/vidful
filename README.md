# VidFul - Simple Video Editor

VidFul is a browser-based video editing application that focuses on simplicity and ease of use. It allows users to perform basic video editing tasks without complicated software.

## Features

- **Video Trimming**: Cut and extract segments from your videos
- **Smooth Zoom Effects**: Add professional-looking zoom effects to your videos
- **Borders and Shadows**: Enhance your videos with customizable borders and shadows

## Tech Stack

- **Next.js 14 (App Router)**: Modern React framework for building the application
- **TypeScript**: For type safety and better developer experience
- **ShadCN UI**: Component library based on Radix UI and styled with Tailwind CSS
- **Zustand**: Lightweight state management
- **FFmpeg.wasm**: Browser-based implementation of FFmpeg for video processing
- **React Player**: For video playback with custom controls

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/vidful.git
cd vidful
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Upload a video file by dragging and dropping or clicking the upload button
2. Use the various tabs to apply effects:
   - **Trim**: Add trim segments to cut parts of the video
   - **Zoom**: Add smooth zoom effects at specific time ranges
   - **Border**: Add borders and shadows to your video
3. Preview the effects in real-time
4. Export your edited video when finished

## Project Structure

```
├── app/                  # Next.js app directory
│   ├── editor/           # Editor page
│   ├── page.tsx          # Home/landing page
├── components/           # Reusable components
│   ├── ui/               # UI components from ShadCN
│   ├── editor/           # Editor-specific components
├── lib/                  # Utility functions and stores
│   ├── store/            # Zustand stores
```

## Limitations

This is a simplified version of a video editor with the following limitations:

- Some complex video processing features may not be available
- Processing large videos may be slow since it happens in the browser
- The export process uses a simplified FFmpeg command and may not apply all effects

## License

This project is licensed under the MIT License - see the LICENSE file for details.
