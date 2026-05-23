const GEMINI_MODEL = "gemini-2.5-flash";

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        req.destroy();
        reject(new Error("요청 본문이 너무 큽니다."));
      }
    });

    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("JSON 형식이 올바르지 않습니다."));
      }
    });

    req.on("error", reject);
  });
}

function sendJson(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}

function parseAiJson(text, item) {
  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("AI 응답을 JSON으로 해석할 수 없습니다.");
  }

  const parsed = JSON.parse(cleaned.slice(start, end + 1));

  return {
    item,
    category: String(parsed.category || "배출 방법 확인 필요"),
    steps: Array.isArray(parsed.steps) ? parsed.steps.map(String).slice(0, 5) : [],
    caution: String(parsed.caution || "지역별 기준이 다를 수 있으니 지자체 배출 안내를 확인해 주세요."),
    reuse: String(parsed.reuse || "재사용 가능 여부를 먼저 확인해 주세요."),
    environment: String(parsed.environment || "올바른 분리배출은 토양과 하천 오염을 줄이는 데 도움이 됩니다."),
  };
}

async function generateRecycleGuide(item) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return {
      item,
      category: "AI API 키 설정 필요",
      steps: [
        "프로젝트 실행 환경에 GEMINI_API_KEY를 설정합니다.",
        "서버를 다시 실행한 뒤 같은 쓰레기 이름으로 다시 검색합니다.",
        "API 키가 없을 때는 지역 지자체 분리배출 안내를 우선 확인합니다.",
      ],
      caution: "브라우저에 API 키를 넣으면 노출됩니다. 반드시 서버 환경변수로만 설정해 주세요.",
      reuse: "API 연결 전에도 비우기, 헹구기, 분리하기 원칙은 적용할 수 있습니다.",
      environment: "AI 분석을 연결하면 오염 상태와 복합 재질까지 더 구체적으로 안내할 수 있습니다.",
    };
  }

  const prompt = `
너는 대한민국 생활 분리배출을 안내하는 환경 교육 AI야.
사용자가 입력한 쓰레기: "${item}"

아래 JSON 형식만 반환해. 마크다운, 설명 문장, 코드블록은 쓰지 마.
{
  "category": "배출 분류 또는 수거함 이름",
  "steps": ["구체적인 배출 단계 1", "구체적인 배출 단계 2", "구체적인 배출 단계 3"],
  "caution": "주의사항. 오염, 위험물, 지역별 기준 차이를 포함",
  "reuse": "재사용 또는 폐기 전 감량 아이디어",
  "environment": "이 쓰레기를 올바르게 배출해야 하는 자연/환경 이유"
}

답변은 한국어로 작성하고, 불확실하면 단정하지 말고 지자체 기준 확인을 안내해.
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.35,
          responseMimeType: "application/json",
        },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    const message = data?.error?.message || "Gemini API 호출에 실패했습니다.";
    throw new Error(message);
  }

  const text = data?.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("") || "";
  return parseAiJson(text, item);
}

async function recycleHandler(req, res) {
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "POST 요청만 사용할 수 있습니다." });
    return;
  }

  try {
    const body = await readJson(req);
    const item = String(body.item || "").trim();

    if (!item) {
      sendJson(res, 400, { error: "쓰레기 이름을 입력해 주세요." });
      return;
    }

    if (item.length > 60) {
      sendJson(res, 400, { error: "쓰레기 이름은 60자 이하로 입력해 주세요." });
      return;
    }

    const guide = await generateRecycleGuide(item);
    sendJson(res, 200, guide);
  } catch (error) {
    sendJson(res, 500, { error: error.message || "AI 분석 중 오류가 발생했습니다." });
  }
}

module.exports = recycleHandler;
module.exports.generateRecycleGuide = generateRecycleGuide;
