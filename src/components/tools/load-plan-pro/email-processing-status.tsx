"use client";

import { useState, useEffect } from "react";
import { Mail, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface EmailProcessingStatusProps {
  isProcessing: boolean;
  onComplete?: () => void;
}

export default function EmailProcessingStatus({
  isProcessing,
  onComplete,
}: EmailProcessingStatusProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<
    "waiting" | "processing" | "complete" | "error"
  >("waiting");
  const [statusText, setStatusText] = useState("Waiting for email");
  const [timeRemaining, setTimeRemaining] = useState("");

  useEffect(() => {
    if (isProcessing) {
      setStatus("processing");
      setStatusText("Processing email");
      setProgress(0);

      const interval = setInterval(() => {
        setProgress((prev) => {
          // Calculate new progress
          const newProgress = prev + 5;

          // Update time remaining text
          const remainingSeconds = Math.ceil((100 - newProgress) / 5);
          setTimeRemaining(`~${remainingSeconds} seconds remaining`);

          // Update status text based on progress
          if (newProgress >= 25 && newProgress < 50) {
            setStatusText("Extracting order data");
          } else if (newProgress >= 50 && newProgress < 75) {
            setStatusText("Matching to customer");
          } else if (newProgress >= 75 && newProgress < 100) {
            setStatusText("Creating order record");
          } else if (newProgress >= 100) {
            setStatusText("Order processed successfully");
            setStatus("complete");
            clearInterval(interval);

            // Call onComplete callback if provided
            if (onComplete) {
              setTimeout(() => {
                onComplete();
              }, 1500);
            }
          }

          return newProgress > 100 ? 100 : newProgress;
        });
      }, 250); // Update every 250ms

      // Simulated error (10% chance) - in a real app this would be based on actual processing results
      const simulateError = Math.random() < 0.1;
      if (simulateError) {
        setTimeout(() => {
          clearInterval(interval);
          setStatus("error");
          setStatusText("Error processing email");
          setProgress(70); // Stop at 70%
        }, 3500);
      }

      return () => clearInterval(interval);
    } else {
      setStatus("waiting");
      setStatusText("Waiting for email");
      setProgress(0);
      setTimeRemaining("");
    }
  }, [isProcessing, onComplete]);

  const getStatusIcon = () => {
    switch (status) {
      case "waiting":
        return <Mail className="h-5 w-5 text-gray-500" />;
      case "processing":
        return <Clock className="h-5 w-5 text-blue-500 animate-pulse" />;
      case "complete":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case "waiting":
        return (
          <Badge variant="outline" className="text-gray-600">
            Waiting
          </Badge>
        );
      case "processing":
        return (
          <Badge
            variant="secondary"
            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
          >
            Processing
          </Badge>
        );
      case "complete":
        return (
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
          >
            Complete
          </Badge>
        );
      case "error":
        return (
          <Badge
            variant="secondary"
            className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
          >
            Error
          </Badge>
        );
    }
  };

  return (
    <Card
      className={
        status === "waiting"
          ? "border-gray-200 dark:border-gray-700"
          : status === "processing"
            ? "border-blue-200 dark:border-blue-700"
            : status === "complete"
              ? "border-green-200 dark:border-green-700"
              : "border-red-200 dark:border-red-700"
      }
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center">
            {getStatusIcon()}
            <span className="ml-2">Email Order Processing</span>
          </span>
          {getStatusBadge()}
        </CardTitle>
        <CardDescription>{statusText}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Progress
            value={progress}
            className={
              status === "error"
                ? "bg-red-100 dark:bg-red-900/20"
                : "bg-gray-100 dark:bg-gray-900/20"
            }
          />

          {status === "processing" && (
            <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
              {timeRemaining}
            </p>
          )}

          {status === "error" && (
            <div className="mt-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded">
              Unable to process email. The format may not be supported or there
              might be missing information.
              <div className="mt-1">
                <span className="font-medium">Tip:</span> Try forwarding the
                original email without modifications.
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
