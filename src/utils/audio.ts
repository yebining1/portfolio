/**
 * Simple Web Audio API Synthesizer to generate a cozy retro 8-bit lofi lofi melody loops
 * Without using any huge external mp3 files. Pure, lightweight code that guarantees to work offline!
 */

export class RetroSynthEngine {
  private audioCtx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private intervalId: any = null;
  private scale: number[] = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]; // C major scale
  private tempo: number = 240; // 240 bpm (makes nice sixteenth notes)

  private notes: number[] = [
    0, 2, 4, 7, 9, 7, 4, 2, // Up and down cozy pattern
    0, 4, 7, 11, 9, 7, 4, 0,
    2, 4, 7, 9, 11, 9, 7, 4,
    1, 3, 5, 8, 10, 8, 5, 3
  ];
  private currentStep: number = 0;

  constructor() {
    // Lazy initialized when playing to prevent chrome policy blocks
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public play() {
    if (this.isPlaying) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      this.audioCtx = new AudioContextClass();
      this.isPlaying = true;
      this.currentStep = 0;

      const stepDuration = 60 / this.tempo; // Duration of one step in seconds

      this.intervalId = setInterval(() => {
        if (!this.audioCtx) return;
        
        // Handle audio context suspension
        if (this.audioCtx.state === 'suspended') {
          this.audioCtx.resume();
        }

        const noteIndex = this.notes[this.currentStep];
        // Calculate cozy frequency based on pentatonic/c-major
        const freq = this.scale[noteIndex % this.scale.length] * (Math.floor(noteIndex / this.scale.length) + 1);

        this.playBeep(freq, stepDuration * 0.8);
        this.currentStep = (this.currentStep + 1) % this.notes.length;
      }, stepDuration * 1000);

    } catch (e) {
      console.warn("Audio initialization failed: ", e);
    }
  }

  private playBeep(freq: number, duration: number) {
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();

      osc.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);

      // Cute warm triangle wave instead of direct harsh square wave
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      // Sweet fade in and smooth envelope decline for lofi sound
      gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.05, this.audioCtx.currentTime + 0.05); // low volume
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

      osc.start(this.audioCtx.currentTime);
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      // Ignore audio thread hiccups
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.audioCtx) {
      this.audioCtx.close();
      this.audioCtx = null;
    }
  }

  public getStatus() {
    return this.isPlaying;
  }
}

export const globalAudioSynth = new RetroSynthEngine();
