"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DeleteIcon from "@/app/Icons/DeleteIcon";

type ImageUploadProps = {
  setResult: (text: string) => void;
};

export default function ImageUpload({ setResult }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setResult("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleGenerate = async () => {
    if (!preview) return;

    try {
      setLoading(true);
      setResult("Analyzing image...");

      // ✅ Зурагнаас ОРЦ гаргах endpoint
      const res = await fetch("http://localhost:999/ingredients-from-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: preview }),
      });

      const data = await res.json();

      if (!res.ok) {
        // backend error: { error: "..." }
        setResult(data?.error || "Failed to analyze image");
        return;
      }

      // ✅ Backend: { ingredients: "• ...\n• ..." }
      setResult(data?.ingredients || "No result");
    } catch (err) {
      console.error(err);
      setResult("Failed to analyze image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="cursor-pointer"
      />

      {preview && (
        <div className="relative w-50 h-50">
          <img
            src={preview}
            alt="preview"
            className="w-full h-full object-cover rounded border "
          />
          <button
            onClick={handleRemove}
            className="absolute bottom-2 right-2 w-6 h-6 bg-white
                       flex items-center cursor-pointer justify-center rounded-sm"
          >
            <DeleteIcon />
          </button>
        </div>
      )}

      <div className="flex justify-end ">
        <Button
          className="cursor-pointer"
          onClick={handleGenerate}
          disabled={!preview || loading}
        >
          {loading ? "Analyzing..." : "Generate"}
        </Button>
      </div>
    </div>
  );
}
