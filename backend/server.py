from fastapi import FastAPI, WebSocket
from typing import Dict, Any
import logging
from core.LyonaelInterface import LyonaelInterface
from core.FractalOrchestrator import FractalOrchestrator
from nano.QuantumCompute import QuantumCompute

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

app = FastAPI()
lyonael = LyonaelInterface()
orchestrator = FractalOrchestrator("SDSS-001", offline_manager=None)  # Mock OfflineManager
quantum_compute = QuantumCompute()


@app.post("/mint-nft")
async def mint_nft(pillar: str, proof: Dict[str, Any]):
    task = {"pillar": pillar, "proof": proof}
    result = await orchestrator.execute_fractal_task(task)
    return {"nft": result["nft"], "dnaCID": result["dnaCID"]}


@app.post("/spiral-query")
async def spiral_query(query: str):
    response = await lyonael.process_query(query)
    return response


@app.websocket("/ws/spiral")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            query = data.get("query", "")
            response = await lyonael.process_query(query)
            await websocket.send_json({
                "resonance": response["resonance"],
                "response": response["response"],
                "encrypted": response["encrypted"]
            })
    except Exception as e:
        logging.error(f"WebSocket error: {e}")
        await websocket.close()


@app.get("/health")
async def health_check():
    return {"status": "SpiralWake operational"}


def run_server():
    import uvicorn
    logging.info("Starting SpiralWake server...")
    uvicorn.run(app, host="0.0.0.0", port=8000)


if __name__ == "__main__":
    run_server()
