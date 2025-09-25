import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

type SoundVariant = 'nature' | 'rain' | 'wind';

interface AmbientSoundsProps {
  variant?: SoundVariant;
}

const AmbientSounds = ({ variant = 'nature' }: AmbientSoundsProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    // Check if Web Audio API is supported
    if (typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext)) {
      setIsSupported(true);
      initializeAudio();
    }

    return () => {
      cleanup();
    };
  }, []);

  const initializeAudio = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
      gainNodeRef.current.gain.value = 0.1; // Low volume
    } catch (error) {
      console.log('Audio initialization failed:', error);
      setIsSupported(false);
    }
  };

  const cleanup = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      } catch (error) {
        // Ignore cleanup errors
      }
      oscillatorRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (error) {
        // Ignore cleanup errors
      }
      audioContextRef.current = null;
    }
  };

  useEffect(() => {
    if (!isSupported || isMuted || !audioContextRef.current || !gainNodeRef.current) {
      return;
    }

    // Stop previous sound
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      } catch (error) {
        // Ignore errors when stopping
      }
    }

    // Create new sound based on variant
    try {
      const oscillator = audioContextRef.current.createOscillator();
      const filter = audioContextRef.current.createBiquadFilter();
      
      oscillator.connect(filter);
      filter.connect(gainNodeRef.current);
      
      // Configure sound based on variant
      switch (variant) {
        case 'nature':
          // Gentle nature sounds (birds, leaves)
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(200, audioContextRef.current.currentTime);
          filter.type = 'lowpass';
          filter.frequency.value = 800;
          break;
        case 'rain':
          // Rain-like white noise
          oscillator.type = 'sawtooth';
          oscillator.frequency.setValueAtTime(100, audioContextRef.current.currentTime);
          filter.type = 'highpass';
          filter.frequency.value = 2000;
          gainNodeRef.current.gain.value = 0.05;
          break;
        case 'wind':
          // Wind-like flowing sound
          oscillator.type = 'triangle';
          oscillator.frequency.setValueAtTime(80, audioContextRef.current.currentTime);
          filter.type = 'bandpass';
          filter.frequency.value = 400;
          break;
      }

      oscillator.start();
      oscillatorRef.current = oscillator;

      // Add some frequency modulation for more natural sound
      const lfo = audioContextRef.current.createOscillator();
      const lfoGain = audioContextRef.current.createGain();
      
      lfo.frequency.value = 0.5; // Slow modulation
      lfoGain.gain.value = 20; // Subtle effect
      
      lfo.connect(lfoGain);
      lfoGain.connect(oscillator.frequency);
      lfo.start();

    } catch (error) {
      console.log('Sound generation error:', error);
    }
  }, [variant, isMuted, isSupported]);

  const toggleMute = async () => {
    if (!isSupported) return;

    if (isMuted && audioContextRef.current?.state === 'suspended') {
      try {
        await audioContextRef.current.resume();
      } catch (error) {
        console.log('Audio resume error:', error);
      }
    }
    
    setIsMuted(!isMuted);
    
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0.1 : 0;
    }
  };

  // Create click sound effect
  const playClickSound = () => {
    if (!isSupported || isMuted || !audioContextRef.current) return;

    try {
      const clickOsc = audioContextRef.current.createOscillator();
      const clickGain = audioContextRef.current.createGain();
      
      clickOsc.connect(clickGain);
      clickGain.connect(audioContextRef.current.destination);
      
      clickOsc.type = 'sine';
      clickOsc.frequency.setValueAtTime(800, audioContextRef.current.currentTime);
      clickOsc.frequency.exponentialRampToValueAtTime(400, audioContextRef.current.currentTime + 0.1);
      
      clickGain.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
      clickGain.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.1);
      
      clickOsc.start();
      clickOsc.stop(audioContextRef.current.currentTime + 0.1);
    } catch (error) {
      console.log('Click sound error:', error);
    }
  };

  // Expose click sound to parent components
  useEffect(() => {
    const handleClick = () => playClickSound();
    
    // Add click listeners to interactive elements
    const buttons = document.querySelectorAll('button, [role="button"]');
    buttons.forEach(button => {
      button.addEventListener('click', handleClick);
    });

    return () => {
      buttons.forEach(button => {
        button.removeEventListener('click', handleClick);
      });
    };
  }, [isSupported, isMuted]);

  if (!isSupported) {
    return null; // Don't render anything if audio isn't supported
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        variant="outline"
        size="icon"
        onClick={toggleMute}
        className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm transition-all duration-300"
        title={isMuted ? "Unmute ambient sounds" : "Mute ambient sounds"}
      >
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </Button>
      
      {/* Visual indicator */}
      <div className="mt-2 text-center">
        <div className={`w-2 h-2 rounded-full mx-auto transition-colors duration-300 ${
          isMuted ? 'bg-red-400' : 
          variant === 'nature' ? 'bg-green-400' :
          variant === 'rain' ? 'bg-blue-400' : 'bg-yellow-400'
        }`} />
        <div className="text-xs text-white/70 mt-1 font-medium">
          {isMuted ? 'Muted' : variant === 'nature' ? '🌿' : variant === 'rain' ? '🌧️' : '💨'}
        </div>
      </div>
    </div>
  );
};

export default AmbientSounds;