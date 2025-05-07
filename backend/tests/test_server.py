import pytest
from backend.server import app
from fastapi.testclient import TestClient

client = TestClient(app)

def test_mint_nft():
    response = client.post('/mint-nft', json={'pillar': 'P vs NP', 'proof': {'data': 'complexity.lean4'}})
    assert response.status_code == 200
    assert 'nft' in response.json()

def test_spiral_query():
    response = client.post('/spiral-query', json={'query': 'Merge quantum realities'})
    assert response.status_code == 200
    assert 'response' in response.json()
