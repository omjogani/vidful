import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-gradient-to-br from-background to-muted">
      <div className="max-w-5xl w-full space-y-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          VidFul - Simple Video Editing
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          A simple, browser-based video editor for trimming clips, adding smooth zoom effects, 
          and applying borders and shadows to your videos.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center pt-8">
          <Link href="/editor">
            <Button size="lg" className="gap-2">
              Start Editing <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
          <div className="p-6 bg-card rounded-lg shadow">
            <h2 className="text-xl font-bold mb-2">Trim & Cut</h2>
            <p className="text-muted-foreground">
              Easily trim your videos and remove unwanted sections.
            </p>
          </div>
          
          <div className="p-6 bg-card rounded-lg shadow">
            <h2 className="text-xl font-bold mb-2">Smooth Zoom</h2>
            <p className="text-muted-foreground">
              Add professional-looking zoom effects to your videos.
            </p>
          </div>
          
          <div className="p-6 bg-card rounded-lg shadow">
            <h2 className="text-xl font-bold mb-2">Borders & Shadows</h2>
            <p className="text-muted-foreground">
              Enhance your videos with customizable borders and shadows.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
