# AutoMixDJ

A modern, browser-based DJ mixing application built using **React**, **TypeScript**, and the **Web Audio API**.  
AutoMixDJ allows users to load tracks, visualize waveforms, mix audio using dual decks, and perform real-time transitions — all inside the browser with a clean, professional UI.

---

## 🎧 Features

### 🎚 Dual Deck System
- Load individual audio tracks on each deck  
- Independent play/pause control  
- Scrubbing, seeking, and track position visualization  

### 🌊 Waveform Visualization
- Custom waveform rendering using HTML Canvas  
- Real-time track progress indicator  
- Interactive scrubbing with click-and-drag support  

### 🎚 Mixer & Crossfader
- Smooth transitions between Deck A and Deck B  
- Volume balancing and mixing with Web Audio API gain nodes  

### 🎨 Modern UI with ShadCN
- Clean, minimal, responsive interface  
- Professional-grade UI components  
- Designed with TailwindCSS for consistency  

### ⚙️ Modular Component Architecture
Reusable, cleanly separated components:
- `Deck` — individual track controls  
- `Mixer` — crossfader logic and channel routing  
- `WaveformCanvas` — waveform rendering  
- `AudioContextOverlay` — handles suspended audio context permissions  
- `Header` — application branding/navigation  

### 🔧 Developer-Friendly Structure
- Example components included for testing  
- Vite-powered development environment  
- TypeScript strict typing for safer code  

---

## 🛠 Tech Stack

| Area | Technology |
|------|------------|
| Frontend Framework | React + TypeScript |
| Build Tool | Vite |
| UI / Styling | ShadCN UI, TailwindCSS |
| Audio Engine | Web Audio API |
| State & Components | Hooks + modular component design |

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/AutoMixDJ.git
cd AutoMixDJ/client
