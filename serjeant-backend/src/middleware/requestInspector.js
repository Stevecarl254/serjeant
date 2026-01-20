export const requestInspector = (req, res, next) => {
  const start = Date.now();

  try {
    console.log("\n========== Incoming Request ==========");
    console.log("Method:", req.method);
    console.log("URL:", req.originalUrl);
    console.log("Params:", req.params);
    console.log("Query:", req.query);
    console.log("Body:", req.body);
    console.log("Headers:", req.headers);
    console.log("======================================\n");
  } catch (err) {
    console.warn("Request inspector failed:", err.message);
  }

  // log response details AFTER controller finishes
  const oldJson = res.json;
  res.json = function (data) {
    try {
      console.log("\n========== Outgoing Response ==========");
      console.log("URL:", req.originalUrl);
      console.log("Status:", res.statusCode);
      console.log("Response Body:", data);
      console.log("=======================================\n");
    } catch (err) {
      console.warn("Response inspector failed:", err.message);
    }
    return oldJson.call(this, data);
  };

  next();
};
