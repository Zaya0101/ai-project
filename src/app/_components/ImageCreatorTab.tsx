"use client";

import { useState } from "react";
import StarIcon from "../Icons/StartIcon";
import RefreshButton from "../Icons/RefreshButton";
import ResultIcon from "../Icons/resulticon";
import { Textarea } from "@/components/ui/textarea";
import { ButtonDefault } from "@/components/ui/GenerButton";

export default function ImageCreatorTab() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setImageUrl("");

    try {
      const res = await fetch(
        "http://localhost:999/image-create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const data = await res.json();
      setImageUrl(data.image);
    } catch (err) {
      console.error("IMAGE CREATE ERROR ", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <StarIcon />
          <p className="text-[20px] font-semibold">Food image creator</p>
        </div>

        <div
          className="cursor-pointer
                     transition
                     hover:opacity-70
                     active:scale-95"
          onClick={() => {
            setPrompt("");
            setImageUrl("");
          }}
        >
          <RefreshButton />
        </div>
      </div>

      {/* Input */}
      <div className="mt-5 text-sm text-[#71717a]">
        <p className="mb-2">
          What food image do you want? Describe it briefly.
        </p>

        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Хоолны тайлбар"
          className="min-h-30"
        />

        <div className="flex justify-end mt-3">
          <ButtonDefault
            onClick={generateImage}
            disabled={loading || !prompt.trim()}
          >
            {loading ? "Analyzing..." : "Generate"}
          </ButtonDefault>
        </div>
      </div>

      {/* Result */}
      <div className="mt-6 flex gap-2 items-center">
        <ResultIcon />
        <p className="text-[20px] font-semibold">Result</p>
      </div>

      <div className="mt-3">
        {loading && (
          <p className="text-sm text-[#71717a]">
            Generating image, please wait...
          </p>
        )}

        {!loading && !imageUrl && (
          <p className="text-sm text-[#71717a]">
            First, enter your text to generate an image.
          </p>
        )}

        {imageUrl && (
          <img
            src={imageUrl}
            alt="Generated food"
            className="mt-3 rounded-lg border max-w-full"
          />
        )}
      </div>
    </>
  );
}
