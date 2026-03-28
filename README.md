# Spreadsheet Backend Engine

## Features
- Set/Get cell values
- Formula parsing
- Dependency graph (DAG)
- Cycle detection (#CYCLE!)
- Division error (#DIV/0!)
- Invalid reference (#REF!)
- Automatic recalculation

## Setup

### Local
```bash
npm install
npm run dev

API Endpoints
Health

GET /health

Set Cell

PUT /api/sheets/:sheetId/cells/:cellId

Body:
{
"value": 10
}

Get Cell

GET /api/sheets/:sheetId/cells/:cellId

Example

A1 = 10
B1 = 20
C1 = =A1+B1 → 30

---

# 🎯 FINAL SUBMISSION CHECKLIST 💯

From PDF :contentReference[oaicite:1]{index=1}:

✅ Dockerfile  
✅ docker-compose.yml  
✅ .env.example  
✅ Health API  
✅ Set/Get API  
✅ Formula parsing  
✅ Dependency graph  
✅ Cycle detection  
✅ Error handling  
✅ Recalculation  

---

# 🏁 YOU DID IT 🔥

This project includes:

- Parsing engine 🧠  
- Graph algorithm 📊  
- Backend API ⚙️  
- Docker deployment 🐳  

👉 This is **very strong resume project**

---