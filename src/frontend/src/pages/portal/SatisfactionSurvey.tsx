import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import { CheckCircle, Star } from "lucide-react";
import { useState } from "react";

const SURVEY_CATEGORIES = [
  { id: "overall", label: "Overall Experience" },
  { id: "communication", label: "Provider Communication" },
  { id: "efficiency", label: "Wait Time & Efficiency" },
];

function StarRating({
  value,
  onChange,
  id,
}: {
  value: number;
  onChange: (v: number) => void;
  id: string;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1" aria-label={`Rating for ${id}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          data-ocid={`survey.${id}.star.${star}`}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none rounded-sm"
          aria-label={`${star} star`}
        >
          <Star
            className="w-7 h-7 transition-colors"
            style={{
              fill:
                (hovered || value) >= star ? "var(--warning)" : "transparent",
              stroke:
                (hovered || value) >= star ? "var(--warning)" : "currentColor",
            }}
          />
        </button>
      ))}
    </div>
  );
}

export default function SatisfactionSurvey() {
  const { actor } = useActor();
  const [ratings, setRatings] = useState<Record<string, number>>({
    overall: 0,
    communication: 0,
    efficiency: 0,
  });
  const [comments, setComments] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const setRating = (id: string, value: number) => {
    setRatings((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    const survey = {
      id: Date.now(),
      submittedAt: new Date().toISOString(),
      ratings,
      comments,
    };
    const existing = JSON.parse(
      localStorage.getItem("medunite_surveys") ?? "[]",
    );
    localStorage.setItem(
      "medunite_surveys",
      JSON.stringify([...existing, survey]),
    );
    setSubmitted(true);

    // Wire to backend silently — use overall rating as the primary score
    if (actor) {
      actor
        .saveSurveyResponse({
          id: 0n,
          patientId: 4n,
          submittedAt: BigInt(Date.now()),
          comment: comments,
          rating: BigInt(ratings.overall || 1),
        })
        .catch(() => {});
    }
  };

  const allRated = Object.values(ratings).every((v) => v > 0);

  if (submitted) {
    return (
      <div
        className="max-w-lg mx-auto py-16 flex flex-col items-center gap-5 text-center"
        data-ocid="survey.success_state"
      >
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-success" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Thank you for your feedback!
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm">
            Your response helps us improve care for everyone. We appreciate you
            taking the time to share your experience.
          </p>
        </div>
        <Button
          variant="outline"
          data-ocid="survey.done.button"
          onClick={() => {
            setSubmitted(false);
            setRatings({ overall: 0, communication: 0, efficiency: 0 });
            setComments("");
          }}
        >
          Submit Another Response
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-8 px-4" data-ocid="survey.page">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-foreground">
          Share Your Feedback
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Help us improve your care experience
        </p>
      </div>

      <Card className="border border-border shadow-card bg-card">
        <CardHeader className="px-5 py-4 border-b border-border">
          <CardTitle className="text-sm font-semibold text-foreground">
            Rate Your Visit
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-6">
          {SURVEY_CATEGORIES.map(({ id, label }) => (
            <div key={id} className="space-y-2">
              <p className="text-sm font-medium text-foreground">{label}</p>
              <StarRating
                id={id}
                value={ratings[id]}
                onChange={(v) => setRating(id, v)}
              />
              {ratings[id] > 0 && (
                <p className="text-xs text-muted-foreground">
                  {
                    ["Poor", "Fair", "Good", "Very Good", "Excellent"][
                      ratings[id] - 1
                    ]
                  }
                </p>
              )}
            </div>
          ))}

          <div className="space-y-2 pt-2 border-t border-border">
            <label
              htmlFor="survey-comments"
              className="text-sm font-medium text-foreground block"
            >
              Additional Comments{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </label>
            <Textarea
              id="survey-comments"
              data-ocid="survey.comments.textarea"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Share anything else about your visit..."
              className="resize-none"
              rows={4}
            />
          </div>

          <Button
            className="w-full"
            data-ocid="survey.submit.button"
            disabled={!allRated}
            onClick={handleSubmit}
          >
            Submit Feedback
          </Button>
          {!allRated && (
            <p className="text-xs text-muted-foreground text-center">
              Please rate all three categories to submit
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
