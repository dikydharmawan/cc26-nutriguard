import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

export const handleScan = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // 1. Tangkap string Base64 gambar dari request body (dari frontend)
    // Jika lewat multer (upload.single), ambil dari buffer
    let base64Image: string | undefined;

    if (req.body.image) {
      base64Image = req.body.image;
    } else if (req.file) {
      base64Image = req.file.buffer.toString("base64");
    } else {
      res.status(400).json({
        error: "Provide an image as base64 string in body or as a file",
      });
      return;
    }

    // 2. Teruskan string Base64 ke server FastAPI
    console.log("[ScanController] Forwarding scan to AI server at:", `${env.AI_SERVER_URL}/api/v1/predict`);
    const aiResponse = await fetch(`${env.AI_SERVER_URL}/api/v1/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: base64Image }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      res
        .status(aiResponse.status)
        .json({ error: "AI Server Error", details: errorText });
      return;
    }

    const aiData = await aiResponse.json();

    // Cek apakah OCR gagal menemukan teks
    if (aiData.isValid === false) {
      res.status(200).json({ isValid: false });
      return;
    }

    // 3. Cocokkan dan lengkapi data sesuai API Contract
    const resultStatus = aiData.resultStatus || "AMAN";
    let statusIcon = "✅";
    let statusClass = "status-safe-header";
    let aiSuggestion =
      "Produk ini terpantau aman untuk dikonsumsi harian Anda.";

    if (resultStatus === "WASPADA") {
      statusIcon = "⚠️";
      statusClass = "status-warning-header";
      aiSuggestion =
        "Perhatikan asupan Anda, produk ini memiliki kandungan yang perlu diwaspadai.";
    } else if (resultStatus === "BATASI") {
      statusIcon = "🚫";
      statusClass = "status-danger-header";
      aiSuggestion =
        "Sebaiknya batasi konsumsi produk ini karena kandungan gizi tertentu cukup tinggi.";
    }

    // Cari persentase tebakan tertinggi
    let confidenceStr = "0%";
    let maxProb = 0;
    const probs = aiData.probabilities || {};
    for (const key in probs) {
      const val = parseInt(probs[key].replace("%", ""), 10);
      if (val > maxProb) {
        maxProb = val;
        confidenceStr = probs[key];
      }
    }

    const finalResponse = {
      isValid: true,
      productName: "Produk Hasil Scan", // Fallback default
      resultStatus: resultStatus,
      confidence: confidenceStr,
      statusIcon: statusIcon,
      statusClass: statusClass,
      probabilities: aiData.probabilities,
      nutrients: aiData.nutrients,
      aiSuggestion: aiSuggestion,
      saveValues: aiData.saveValues,
    };

    res.status(200).json(finalResponse);
  } catch (err) {
    next(err);
  }
};
