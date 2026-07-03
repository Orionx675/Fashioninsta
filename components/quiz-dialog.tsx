"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
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
      <DialogContent className="glass-strong overflow-hidden sm:max-w-md">
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
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 to-indigo-400"
                initial={false}
                animate={{ width: `${(step / QUIZ.length) * 100}%` }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 36 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -36, transition: { duration: 0.15 } }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4"
              >
                <p className="text-base font-semibold leading-snug">
                  {QUIZ[step].question}
                </p>
                <div className="space-y-2">
                  {QUIZ[step].options.map((o, i) => (
                    <motion.button
                      key={o.label}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => pick(i)}
                      className="w-full cursor-pointer rounded-2xl border border-white/70 bg-white/60 px-4 py-3 text-left text-sm font-medium transition-all duration-200 hover:border-primary/40 hover:bg-white hover:shadow-md"
                    >
                      {o.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            <div className="rounded-2xl bg-gradient-to-br from-sky-100/80 to-indigo-100/80 p-5 text-center">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.35 }}
                className="font-display text-3xl font-bold tracking-wide ice-text"
              >
                {result}
              </motion.p>
              {arch && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22, duration: 0.35 }}
                >
                  <p className="mt-1 flex items-center justify-center gap-1.5 text-sm font-semibold">
                    <Sparkles className="size-4 text-indigo-400" />
                    {arch.archetype}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{arch.blurb}</p>
                </motion.div>
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
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}
