const http = require("http");

// Test /test endpoint first
const testOp = {
  hostname: "localhost",
  port: 5000,
  path: "/test",
  method: "GET",
  headers: { "Content-Type": "application/json" }
};

const testReq = http.request(testOp, (res) => {
  let data = "";
  res.on("data", (chunk) => { data += chunk; });
  res.on("end", () => {
    console.log("[/test] Status:", res.statusCode);
    console.log("[/test] Data:", data);
    
    // Now test /transactions
    const txnOp = {
      hostname: "localhost",
      port: 5000,
      path: "/transactions",
      method: "GET",
      headers: { "Content-Type": "application/json" }
    };

    const txnReq = http.request(txnOp, (res2) => {
      let data2 = "";
      res2.on("data", (chunk) => { data2 += chunk; });
      res2.on("end", () => {
        console.log("[/transactions] Status:", res2.statusCode);
        console.log("[/transactions] Data:", data2);
        process.exit(0);
      });
    });

    txnReq.on("error", (e) => {
      console.error("[/transactions] Error:", e.message);
      process.exit(1);
    });

    txnReq.end();
  });
});

testReq.on("error", (e) => {
  console.error("[/test] Error:", e.message);
  process.exit(1);
});

testReq.end();
