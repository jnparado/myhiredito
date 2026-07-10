"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useWorkerAuth } from "@/app/hooks/useWorkerAuth";
import { useWorkerOnboarding } from "@/app/hooks/useWorkerOnboarding";
import {
  getAssessmentForJob,
  getAssessmentTier,
  getBoostLabel,
  getTierDescription,
  getTierLabel,
  type AssessmentQuestion,
  type AssessmentResult,
} from "@/app/lib/jobAssessments";
import {
  getAssessmentResult,
  hasAppliedToJob,
  saveAssessmentResult,
  submitJobApplication,
} from "@/app/lib/jobApplications";
import { getWorkerUserKey, isOnboardingComplete } from "@/app/lib/workerOnboarding";
import type { Job } from "@/app/lib/jobs";

type Step = "intro" | "quiz" | "results";

type Props = {
  job: Job;
};

export function RoleAssessment({ job }: Props) {
  const router = useRouter();
  const { user, loading: authLoading } = useWorkerAuth();
  const { progress, loading: onboardingLoading } = useWorkerOnboarding();
  const userKey = getWorkerUserKey(user);

  const questions = useMemo(() => getAssessmentForJob(job), [job]);
  const [step, setStep] = useState<Step>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [applied, setApplied] = useState(false);

  const onboardingComplete = isOnboardingComplete(progress);
  const existingResult = userKey ? getAssessmentResult(userKey, job.slug) : null;
  const alreadyApplied = userKey ? hasAppliedToJob(userKey, job.slug) : false;

  const currentQuestion = questions[currentIndex];

  function startQuiz() {
    setStep("quiz");
    setCurrentIndex(0);
    setAnswers({});
    setSelectedOption(null);
    setResult(null);
    setApplied(false);
  }

  function handleNext() {
    if (selectedOption === null || !currentQuestion) return;

    const nextAnswers = {
      ...answers,
      [currentQuestion.id]: selectedOption,
    };
    setAnswers(nextAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((index) => index + 1);
      setSelectedOption(
        nextAnswers[questions[currentIndex + 1]?.id ?? ""] ?? null,
      );
      return;
    }

    finishQuiz(nextAnswers, questions);
  }

  function finishQuiz(
    finalAnswers: Record<string, number>,
    quizQuestions: AssessmentQuestion[],
  ) {
    if (!userKey) return;

    const correct = quizQuestions.filter(
      (question) => finalAnswers[question.id] === question.correctIndex,
    ).length;
    const total = quizQuestions.length;
    const percent = Math.round((correct / total) * 100);
    const tier = getAssessmentTier(percent);

    const assessmentResult: AssessmentResult = {
      jobSlug: job.slug,
      jobTitle: job.title,
      category: job.category,
      score: correct,
      total,
      percent,
      tier,
      completedAt: new Date().toISOString(),
    };

    saveAssessmentResult(userKey, assessmentResult);
    setResult(assessmentResult);
    setStep("results");
  }

  function handleApply() {
    if (!userKey || !result) return;

    submitJobApplication(userKey, {
      jobSlug: job.slug,
      jobTitle: job.title,
      company: job.company,
      category: job.category,
      location: job.location,
      pay: job.pay,
      appliedAt: new Date().toISOString(),
      assessment: result,
      status: "submitted",
    });
    setApplied(true);
    router.push("/worker/dashboard#applications");
  }

  if (authLoading || onboardingLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-zinc-500">
        Loading assessment...
      </div>
    );
  }

  if (!user || !userKey) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-zinc-900">Sign in to take the exam</h1>
        <p className="mt-3 text-sm text-zinc-600">
          Complete a quick role assessment to boost your chances of getting hired
          for {job.title}.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href={`/worker/login`}
            className="rounded-lg bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Log in
          </Link>
          <Link
            href="/worker/signup"
            className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-800"
          >
            Sign up
          </Link>
        </div>
      </div>
    );
  }

  if (!onboardingComplete) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Finish onboarding before taking role assessments and applying to jobs.
        </div>
        <Link
          href="/worker/dashboard"
          className="mt-6 inline-flex rounded-lg bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold text-white"
        >
          Go to dashboard
        </Link>
      </div>
    );
  }

  if (step === "intro") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <Link
          href={`/worker/jobs/${job.slug}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-zinc-500 hover:text-zinc-800"
        >
          ← Back to job
        </Link>

        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--brand)]">
            Role readiness exam
          </p>
          <h1 className="mt-2 text-2xl font-bold text-zinc-900 sm:text-3xl">
            Quick exam for {job.title}
          </h1>
          <p className="mt-3 text-sm leading-7 text-zinc-600">
            Answer {questions.length} role-specific questions to show employers
            you&apos;re prepared. A strong score adds a visibility boost to your
            application.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-zinc-50 p-4 text-center">
              <p className="text-2xl font-bold text-zinc-900">{questions.length}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Questions
              </p>
            </div>
            <div className="rounded-lg bg-zinc-50 p-4 text-center">
              <p className="text-2xl font-bold text-zinc-900">5</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Minutes
              </p>
            </div>
            <div className="rounded-lg bg-emerald-50 p-4 text-center">
              <p className="text-2xl font-bold text-emerald-700">+25%</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Max hire boost
              </p>
            </div>
          </div>

          {existingResult && (
            <div className="mt-6 rounded-lg border border-[var(--brand)]/20 bg-[var(--brand-light)] px-4 py-3 text-sm text-[var(--brand-dark)]">
              Previous score: <strong>{existingResult.percent}%</strong> —{" "}
              {getTierLabel(existingResult.tier)}. You can retake to improve your boost.
            </div>
          )}

          {alreadyApplied && (
            <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
              You already applied to this role. Retaking updates your assessment badge.
            </div>
          )}

          <button
            type="button"
            onClick={startQuiz}
            className="mt-8 w-full rounded-lg bg-[var(--brand)] py-3 text-sm font-bold text-white transition hover:bg-[var(--brand-strong)]"
          >
            {existingResult ? "Retake exam" : "Start exam"}
          </button>
        </div>
      </div>
    );
  }

  if (step === "quiz" && currentQuestion) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-zinc-500">
            <span>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span>{job.category}</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full bg-[var(--brand)] transition-all"
              style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-bold leading-8 text-zinc-900 sm:text-xl">
            {currentQuestion.question}
          </h2>

          <div className="mt-6 space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={option}
                type="button"
                onClick={() => setSelectedOption(index)}
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                  selectedOption === index
                    ? "border-[var(--brand)] bg-[var(--brand-light)] font-semibold text-[var(--brand-dark)]"
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => {
                const prevIndex = currentIndex - 1;
                setCurrentIndex(prevIndex);
                setSelectedOption(answers[questions[prevIndex].id] ?? null);
              }}
              className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-semibold text-zinc-700 disabled:opacity-40"
            >
              Back
            </button>
            <button
              type="button"
              disabled={selectedOption === null}
              onClick={handleNext}
              className="flex-1 rounded-lg bg-[var(--brand)] py-2.5 text-sm font-bold text-white disabled:opacity-40"
            >
              {currentIndex === questions.length - 1 ? "See results" : "Next"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "results" && result) {
    const boost = getBoostLabel(result.tier);

    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-center shadow-sm sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--brand)]">
            Assessment complete
          </p>
          <h1 className="mt-2 text-3xl font-bold text-zinc-900">{result.percent}%</h1>
          <p className="mt-2 text-lg font-semibold text-zinc-800">
            {getTierLabel(result.tier)}
          </p>
          <p className="mt-3 text-sm leading-7 text-zinc-600">
            {getTierDescription(result.tier)}
          </p>

          {boost && (
            <div className="mx-auto mt-5 inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-800">
              {boost} on this application
            </div>
          )}

          <p className="mt-4 text-sm text-zinc-500">
            {result.score} of {result.total} correct for {job.title}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {!applied && !alreadyApplied ? (
              <button
                type="button"
                onClick={handleApply}
                className="flex-1 rounded-lg bg-[var(--brand)] py-3 text-sm font-bold text-white hover:bg-[var(--brand-strong)]"
              >
                Apply with assessment boost
              </button>
            ) : (
              <Link
                href="/worker/dashboard#applications"
                className="flex-1 rounded-lg bg-[var(--brand)] py-3 text-center text-sm font-bold text-white"
              >
                View my applications
              </Link>
            )}
            <button
              type="button"
              onClick={startQuiz}
              className="flex-1 rounded-lg border border-zinc-300 py-3 text-sm font-semibold text-zinc-800"
            >
              Retake exam
            </button>
          </div>

          <Link
            href={`/worker/jobs/${job.slug}`}
            className="mt-4 inline-block text-sm font-semibold text-[var(--brand)] hover:underline"
          >
            Back to job details
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
