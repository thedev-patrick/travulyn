"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  SceneAdminOnboard,
  SceneAdminReview,
  SceneDiscover,
  ScenePortal,
  SceneSync,
} from "@/components/site/how-it-works-scenes";

const SCENE_SECONDS = 6.5;

const scenes = [
  {
    role: "client" as const,
    roleLabel: "Client",
    title: "Discover & inquire",
    caption: "Travellers check requirements and pricing on the landing page, then send an inquiry.",
    Component: SceneDiscover,
  },
  {
    role: "admin" as const,
    roleLabel: "Admin",
    title: "Admin onboards the customer",
    caption: "Staff turn the inquiry into a customer, creating an application with a private portal link.",
    Component: SceneAdminOnboard,
  },
  {
    role: "client" as const,
    roleLabel: "Client",
    title: "Track documents in the portal",
    caption: "The customer opens their link — no account needed — to check status and upload documents.",
    Component: ScenePortal,
  },
  {
    role: "admin" as const,
    roleLabel: "Admin",
    title: "Admin reviews & updates",
    caption: "Staff approve documents and post progress updates from the admin CMS.",
    Component: SceneAdminReview,
  },
  {
    role: "sync" as const,
    roleLabel: "Admin ↔ Client",
    title: "It stays in sync",
    caption: "Every update admin posts appears in the customer's portal immediately.",
    Component: SceneSync,
  },
];

const roleStyles: Record<(typeof scenes)[number]["role"], string> = {
  client: "border-primary/30 bg-primary/10 text-primary",
  admin: "border-brand-warm/30 bg-brand-warm/15 text-brand-warm",
  sync: "border-border bg-muted text-foreground",
};

const SCENE_MS = SCENE_SECONDS * 1000;

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export function HowItWorksPlayer() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [finished, setFinished] = useState(false);
  const [restartKey, setRestartKey] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);

  const remainingMs = useRef(SCENE_MS);
  const sceneStartedAt = useRef(0);

  useEffect(() => {
    remainingMs.current = SCENE_MS;
  }, [index, restartKey]);

  useEffect(() => {
    if (!playing) return;
    sceneStartedAt.current = Date.now();

    const timeout = setTimeout(() => {
      if (index === scenes.length - 1) {
        setFinished(true);
        setPlaying(false);
        setElapsedMs(scenes.length * SCENE_MS);
      } else {
        setIndex((i) => i + 1);
      }
    }, remainingMs.current);

    const tick = setInterval(() => {
      const sceneElapsed = SCENE_MS - remainingMs.current + (Date.now() - sceneStartedAt.current);
      setElapsedMs(index * SCENE_MS + sceneElapsed);
    }, 200);

    return () => {
      clearTimeout(timeout);
      clearInterval(tick);
      const now = Date.now();
      remainingMs.current = Math.max(0, remainingMs.current - (now - sceneStartedAt.current));
      setElapsedMs(index * SCENE_MS + (SCENE_MS - remainingMs.current));
    };
  }, [playing, index, restartKey]);

  function jumpTo(i: number) {
    setFinished(false);
    setPlaying(true);
    setIndex(i);
    setElapsedMs(i * SCENE_MS);
  }

  function toggle() {
    if (finished) {
      setFinished(false);
      setIndex(0);
      setRestartKey((k) => k + 1);
      setElapsedMs(0);
      setPlaying(true);
      return;
    }
    setPlaying((p) => !p);
  }

  const scene = scenes[index];
  const Scene = scene.Component;
  const contentKey = `${index}-${restartKey}`;
  const totalDuration = scenes.length * SCENE_SECONDS;

  return (
    <div>
      <div className="overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10 shadow-sm">
        <div className="flex items-center justify-between border-b px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2">
            <span className="flex gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-muted" />
              <span className="h-2.5 w-2.5 rounded-full bg-muted" />
              <span className="h-2.5 w-2.5 rounded-full bg-muted" />
            </span>
            <span className="ml-1 text-xs text-muted-foreground">
              Chapter {index + 1} of {scenes.length}
            </span>
          </div>
          <Badge variant="outline" className={cn("gap-1.5", roleStyles[scene.role])}>
            {scene.roleLabel}
          </Badge>
        </div>

        <div className="relative flex min-h-[300px] flex-col justify-center px-5 py-6 sm:min-h-[340px] sm:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={contentKey}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <Scene />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="border-t bg-muted/30 px-5 py-4 sm:px-8">
          <p className="font-heading text-base font-medium">{scene.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{scene.caption}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Button
          size="icon-sm"
          variant="outline"
          onClick={toggle}
          aria-label={finished ? "Replay" : playing ? "Pause" : "Play"}
        >
          {finished ? (
            <RotateCcw className="h-3.5 w-3.5" />
          ) : playing ? (
            <Pause className="h-3.5 w-3.5" />
          ) : (
            <Play className="h-3.5 w-3.5" />
          )}
        </Button>

        <div className="flex flex-1 gap-1.5">
          {scenes.map((s, i) => (
            <button
              key={s.title}
              type="button"
              onClick={() => jumpTo(i)}
              className="group relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
              aria-label={`Jump to: ${s.title}`}
            >
              {(i < index || finished) && <span className="absolute inset-0 rounded-full bg-primary" />}
              {i === index && !finished && (
                <span
                  key={contentKey}
                  className="absolute inset-0 origin-left rounded-full bg-primary"
                  style={{
                    animation: `how-it-works-fill ${SCENE_SECONDS}s linear forwards`,
                    animationPlayState: playing ? "running" : "paused",
                  }}
                />
              )}
            </button>
          ))}
        </div>

        <span className="w-16 shrink-0 text-right font-mono text-xs text-muted-foreground">
          {formatTime(elapsedMs / 1000)} / {formatTime(totalDuration)}
        </span>
      </div>
    </div>
  );
}
