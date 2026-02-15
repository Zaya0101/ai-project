"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MessageCircle from "../Icons/MessageCircle";
import ChatPopup from "../_components/Chatpopup";

import ImageAnalysisTab from "../_components/ImageAnalysisTab";
import ImageCreatorTab from "../_components/ImageCreatorTab";
import IngredientRecognitionTab from "../_components/ IngredientRecognitionTab";

export default function MainPage() {
  const [openChat, setOpenChat] = useState(false);

  const [_preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("analysis");

  const handleTabChange = (value: string) => {
    setActiveTab(value);

    if (value !== "analysis") {
      setResult("");
      setPreview(null);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center relative">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-145 pt-6 pb-6 gap-6"
        >
          <TabsList>
            <TabsTrigger className="cursor-pointer" value="analysis">
              Image analysis
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="recognition">
              Ingredient recognition
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="creator">
              Image creator
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analysis">
            <ImageAnalysisTab
              result={result}
              setResult={setResult}
              setPreview={setPreview}
              loading={loading}
              setLoading={setLoading}
            />
          </TabsContent>

          <TabsContent value="recognition">
            <IngredientRecognitionTab />
          </TabsContent>

          {/* Image creator */}
          <TabsContent value="creator">
            <ImageCreatorTab />
          </TabsContent>
        </Tabs>

       <div
  className="fixed bottom-8 right-8 h-12 w-12 rounded-full bg-[#18181b] flex items-center justify-center cursor-pointer"
  onClick={() => setOpenChat(true)}
>
          <MessageCircle />
        </div>

        {openChat && <ChatPopup onClose={() => setOpenChat(false)} />}
      </div>
    </>
  );
}
