"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { archetypeFor } from "@/lib/mbti";
import { QUIZ, scoreQuiz } from "@/lib/quiz";

export function QuizDialog({
  open,
  onOpenChange,
  onResult,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResult: (mbti: string) => void;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const done = step >= QUIZ.length;
  const result = done ? scoreQuiz(answers) : null;
  const arch = result ? archetypeFor(result) : null;

  function reset() {
    setStep(0);
    setAnswers([]);
  }

  function pick(i: number) {
    setAnswers((a) => [...a, i]);
    setStep((s) => s + 1);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) reset();
      }}
    >
      <DialogContent className="glass-strong sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {done ? "Your style personality" : "Style quiz"}
          </DialogTitle>
          <DialogDescription>
            {done
              ? "Based on your answers — you can always change it later."
              : `Question ${step + 1} of ${QUIZ.length}`}
          </DialogDescription>
        </DialogHeader>

        {!done ? (
          <div className="space-y-4">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/60">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 to-indigo-400 transition-all duration-300"
                style={{ width: `${(step / QUIZ.length) * 100}%` }}
              />
            </div>
            <p className="text-base font-semibold leading-snug">
              {QUIZ[step].question}
            </p>
            <div className="space-y-2">
              {QUIZ[step].options.map((o, i) => (
                <button
                  key={o.label}
                  onClick={() => pick(i)}
                  className="w-full rounded-2xl border border-white/70 bg-white/60 px-4 py-3 text-left text-sm font-medium transition-all hover:border-primary/40 hover:bg-white hover:shadow-md"
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl bg-gradient-to-br from-sky-100/80 to-indigo-100/80 p-5 text-center">
              <p className="font-display text-3xl font-bold tracking-wide ice-text">
                {result}
              </p>
              {arch && (
                <>
                  <p className="mt-1 flex items-center justify-center gap-1.5 text-sm font-semibold">
                    <Sparkles className="size-4 text-indigo-400" />
                    {arch.archetype}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{arch.blurb}</p>
                </>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" className="flex-1" onClick={reset}>
                Retake
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  if (result) onResult(result);
                  onOpenChange(false);
                  reset();
                }}
              >
                Use this type
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
