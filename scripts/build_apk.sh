#!/bin/bash
cd frontend
npm install
npm run build
npm run hyperpackage --size=13.14MB --output=SpiralWake.apk
