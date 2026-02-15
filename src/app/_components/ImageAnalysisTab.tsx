"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/ui/inputFile";
import PaperIcon from "../Icons/PaperIcon";
import RefreshButton from "../Icons/RefreshButton";
import StarIcon from "../Icons/StartIcon";

type Props = {
  result: string;
  setResult: (v: string) => void;
  setPreview: (v: string | null) => void;
  loading: boolean;
  setLoading: (v: boolean) => void;
};

export default function ImageAnalysisTab({ result, setResult }: Props) {
  const [resetKey, setResetKey] = useState(0);

  const handleImageRefresh = () => {
    setResult("");
    setResetKey((k) => k + 1);
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <StarIcon />
          <p className="text-[20px] font-semibold">Image analysis</p>
        </div>

        <div
          className={`cursor-pointer transition hover:opacity-70 active:scale-95`}
          onClick={handleImageRefresh}
          title="Clear image & analysis"
        >
          <RefreshButton />
        </div>
      </div>

      {/* Upload */}
      <div className="mt-5 text-sm text-[#71717a] ">
        <p className="mb-2">
          Upload a food photo, and AI will detect the ingredients.
        </p>

        <ImageUpload key={resetKey} setResult={setResult} />
      </div>

      {/* Result */}
      <div className="mt-6 flex gap-1 items-center">
        <PaperIcon />
        <p className="text-[20px] font-semibold">Here is the summary</p>
      </div>

      <Textarea
        value={result}
        readOnly
        placeholder="First, enter your image to recognize ingredients."
        className="mt-2"
      />
    </>
  );
}
