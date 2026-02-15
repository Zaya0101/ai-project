"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ButtonDefault } from "@/components/ui/GenerButton";
import PaperIcon from "../Icons/PaperIcon";
import RefreshButton from "../Icons/RefreshButton";
import StarIcon from "../Icons/StartIcon";

export default function IngredientRecognitionTab() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const isDisabled = loading || !text.trim();

  const generate = async () => {
    if (!text.trim()) return;

    try {
      setLoading(true);
      setResult("");

      const res = await fetch(
        "http://localhost:999/ingredients",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        }
      );

      const data = await res.json();
      setResult(data.ingredients || "No ingredients found");
    } catch {
      setResult("Failed to recognize ingredients");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setText("");
    setResult("");
    setLoading(false);
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <StarIcon />
          <p className="text-[20px] font-semibold">Ingredient recognition</p>
        </div>

        <div
          className="cursor-pointer transition hover:opacity-70 active:scale-95"
          onClick={handleRefresh}
          title="Clear input & result"
        >
          <RefreshButton />
        </div>
      </div>

      {/* Description */}
      <p className="mt-5 mb-2 text-sm text-[#71717a]">
        Describe the food, and AI will detect the ingredients.
      </p>

      {/* Input */}
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Орц тодорхойлох"
        className="min-h-[120px]"
      />

      {/* Generate */}
      <div className="flex justify-end mt-3">
        <ButtonDefault
          onClick={generate}
          disabled={isDisabled}
          className={isDisabled ? "bg-zinc-400" : "bg-black"}
        >
          {loading ? "Analyzing..." : "Generate"}
        </ButtonDefault>
      </div>

      {/* Result header */}
      <div className="mt-6 flex gap-2 items-center">
        <PaperIcon />
        <p className="text-[20px] font-semibold">Identified Ingredients</p>
      </div>

      {/* Result */}
      <Textarea
        value={result}
        readOnly
        placeholder="Result will appear here..."
        className="mt-2"
      />
    </>
  );
}
