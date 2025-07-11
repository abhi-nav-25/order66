import React, { useState, useRef, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './App.css';
import PomodoroTimer from './PomodoroTimer';

const SITH_QUOTES = [
  'Peace is a lie, there is only passion.',
  'Through passion, I gain strength.',
  'Through strength, I gain power.',
  'Through power, I gain victory.',
  'Through victory, my chains are broken.',
  'The Force shall free me.'
];

const SITH_RANKS = [
  { title: 'Acolyte', required: 0 },
  { title: 'Apprentice', required: 100 },
  { title: 'Sith Lord', required: 200 },
  { title: 'Sith Master', required: 300 },
  { title: 'Darth', required: 400 },
  { title: 'Emperor', required: 500 }
];

const SITH_AVATARS = [
  { name: 'Darth Vader', color: '#1a0000', unlock: 0 },
  { name: 'Darth Maul', color: '#2d0606', unlock: 5 },
  { name: 'Emperor Palpatine', color: '#222233', unlock: 15 },
  { name: 'Count Dooku', color: '#2a161a', unlock: 30 },
  { name: 'Kylo Ren', color: '#1a0d0d', unlock: 50 }
];

const SITH_BADGES = [
  { name: 'First Pomodoro', condition: (count) => count >= 1 },
  { name: 'Order 66', condition: (count) => count >= 66 },
  { name: 'Sith Streak 3', condition: (streak) => streak >= 3 },
  { name: 'Sith Streak 7', condition: (streak) => streak >= 7 }
];

const SITH_MOTIVATION = [
  'You have grown stronger in the Dark Side.',
  'Another step towards ultimate power.',
  'The Force is with you, young Sith.',
  'Your chains are breaking.',
  'Impressive. Most impressive.',
  'You are fulfilling your destiny.'
];

const YODA_EASTER_EGG_QUOTES = [
  'Do or do not. There is no try.',
  'The greatest teacher, failure is.',
  'Fear is the path to the dark side.',
  'Size matters not. Look at me.',
  'Wars not make one great.',
  'You must unlearn what you have learned.',
  'Patience you must have, my young padawan.',
  'In a dark place we find ourselves, and a little more knowledge lights our way.',
  'The shadow of greed, that is.',
  'Much to learn, you still have.',
  'Your focus determines your reality.',
  'The Force will be with you, always.',
  'Truly wonderful, the mind of a child is.',
  'Difficult to see. Always in motion is the future.',
  'Adventure. Excitement. A Jedi craves not these things.'
];

function getTodayKey() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 3D Walking Sith Character Component
const WalkingSith = () => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [direction, setDirection] = useState(1); // 1 for right, -1 for left
  const [isWalking, setIsWalking] = useState(true);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const walkInterval = setInterval(() => {
      if (isWalking) {
        setStep(prev => (prev + 1) % 8);
        setPosition(prev => {
          let newX = prev.x + (direction * 2);
          
          // Change direction at screen edges
          if (newX > window.innerWidth - 100) {
            setDirection(-1);
            newX = window.innerWidth - 100;
          } else if (newX < 50) {
            setDirection(1);
            newX = 50;
          }
          
          return { x: newX, y: prev.y };
        });
      }
    }, 200);

    return () => clearInterval(walkInterval);
  }, [isWalking, direction]);

  const handleClick = () => {
    setIsWalking(!isWalking);
  };

  return (
    <div 
      className="WalkingSith"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `scaleX(${direction})`
      }}
      onClick={handleClick}
    >
      <div className="SithBody">
        <div className="SithHead">
          <div className="SithHelmet">
            <div className="SithVisor"></div>
            <div className="SithBreathingApparatus"></div>
          </div>
        </div>
        <div className="SithTorso">
          <div className="SithChestPlate"></div>
          <div className="SithCape"></div>
        </div>
        <div className="SithArms">
          <div className="SithArm left">
            <div className="SithHand"></div>
          </div>
          <div className="SithArm right">
            <div className="SithHand"></div>
          </div>
        </div>
        <div className="SithLegs">
          <div className={`SithLeg left ${isWalking ? `walk-${step}` : ''}`}>
            <div className="SithFoot"></div>
          </div>
          <div className={`SithLeg right ${isWalking ? `walk-${(step + 4) % 8}` : ''}`}>
            <div className="SithFoot"></div>
          </div>
        </div>
        <div className="SithLightsaber">
          <div className="SithSaberHilt"></div>
          <div className="SithSaberBlade"></div>
        </div>
      </div>
      <div className="SithShadow"></div>
    </div>
  );
};



function App() {
  const [quote, setQuote] = useState(SITH_QUOTES[0]);
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [avatarIdx, setAvatarIdx] = useState(0);

  // Pomodoro timer state
  const [pomodoroMinutes, setPomodoroMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const intervalRef = useRef(null);

  // Section refs for scrolling
  const tasksRef = useRef(null);
  const pomoRef = useRef(null);
  const calendarRef = useRef(null);
  const statsRef = useRef(null);

  // Calendar state
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [calendarTasks, setCalendarTasks] = useState({}); // { 'YYYY-MM-DD': [task, ...] }
  const [calendarTaskInput, setCalendarTaskInput] = useState('');

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [xp, setXp] = useState(0);
  const [lastPomodoroDate, setLastPomodoroDate] = useState(getTodayKey());
  const [streak, setStreak] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [rewardMsg, setRewardMsg] = useState('');

  // Track which tasks have just been completed for animation
  const [justCompleted, setJustCompleted] = useState([]);

  const [authModal, setAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup'
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sith_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [authError, setAuthError] = useState('');
  const [authForm, setAuthForm] = useState({ username: '', password: '' });

  // Simple in-memory user store for demo
  const [userStore, setUserStore] = useState(() => {
    const saved = localStorage.getItem('sith_user_store');
    return saved ? JSON.parse(saved) : {};
  });
  useEffect(() => {
    localStorage.setItem('sith_user_store', JSON.stringify(userStore));
  }, [userStore]);

  // Update timer when pomodoroMinutes changes (only if timer hasn't been started yet)
  React.useEffect(() => {
    if (!hasStarted) {
      setSecondsLeft(pomodoroMinutes * 60);
    }
  }, [pomodoroMinutes, hasStarted]);

  // 3D Mouse Follower Effect
  useEffect(() => {
    const mouseFollower = document.getElementById('mouseFollower');
    const parallaxLayers = document.querySelectorAll('.SithParallaxLayer');
    
    const handleMouseMove = (e) => {
      if (mouseFollower) {
        mouseFollower.style.left = e.clientX + 'px';
        mouseFollower.style.top = e.clientY + 'px';
      }
      
      // Parallax effect on background layers
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;
      
      parallaxLayers.forEach((layer, index) => {
        const speed = (index + 1) * 0.5;
        const x = (mouseX - 0.5) * speed * 50;
        const y = (mouseY - 0.5) * speed * 50;
        layer.style.transform = `translateZ(-${(index + 1) * 100}px) scale(${1.2 + index * 0.3}) translate(${x}px, ${y}px)`;
      });
    };
    
    const handleMouseEnter = () => {
      if (mouseFollower) {
        mouseFollower.style.opacity = '0.6';
      }
    };
    
    const handleMouseLeave = () => {
      if (mouseFollower) {
        mouseFollower.style.opacity = '0';
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // 3D Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallaxLayers = document.querySelectorAll('.SithParallaxLayer');
      
      parallaxLayers.forEach((layer, index) => {
        const speed = (index + 1) * 0.3;
        const yPos = -(scrolled * speed);
        layer.style.transform = `translateZ(-${(index + 1) * 100}px) scale(${1.2 + index * 0.3}) translateY(${yPos}px)`;
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  // 3D Timer Pulse Effect
  useEffect(() => {
    const timerDisplay = document.querySelector('.SithTimerDisplay');
    if (!timerDisplay) return;
    
    const pulseTimer = () => {
      if (isRunning) {
        timerDisplay.style.transform = 'translateZ(20px) scale(1.1)';
        setTimeout(() => {
          timerDisplay.style.transform = 'translateZ(10px) scale(1)';
        }, 200);
      }
    };
    
    const interval = setInterval(pulseTimer, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      setHasStarted(true);
      intervalRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            setTimeout(onPomodoroComplete, 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setHasStarted(false);
    clearInterval(intervalRef.current);
    setSecondsLeft(pomodoroMinutes * 60);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, { text: task, done: false, rewarded: false }]);
      setTask('');
    }
  };

  const toggleTask = idx => {
    setTasks(tasks => {
      const newTasks = tasks.map((t, i) => {
        if (i === idx) {
          if (!t.done && !t.rewarded) {
            // Mark as just completed for animation
            setJustCompleted(jc => [...jc, idx]);
            return { ...t, done: true, rewarded: true };
          } else if (t.done) {
            return { ...t, done: false };
          }
        }
        return t;
      });
      if (!tasks[idx].done && !tasks[idx].rewarded) {
        setXp(xp => xp + 10);
      }
      return newTasks;
    });
    // Remove animation after it plays
    setTimeout(() => setJustCompleted(jc => jc.filter(i => i !== idx)), 700);
  };

  const removeTask = idx => {
    setTasks(tasks.filter((_, i) => i !== idx));
  };

  const randomQuote = () => {
    const next = SITH_QUOTES[Math.floor(Math.random() * SITH_QUOTES.length)];
    setQuote(next);
  };

  const currentAvatar = SITH_AVATARS[avatarIdx];

  // Determine background style based on selected Sith
  let bgImage = null;
  if (currentAvatar.name === 'Darth Vader') bgImage = '/darthvader.png';
  if (currentAvatar.name === 'Darth Maul') bgImage = '/darthmaul.png';
  if (currentAvatar.name === 'Emperor Palpatine') bgImage = '/ep.png';
  if (currentAvatar.name === 'Count Dooku') bgImage = '/cd.png';
  if (currentAvatar.name === 'Kylo Ren') bgImage = '/kr.png';

  const backgroundStyle = bgImage
    ? {
        background: `linear-gradient(rgba(10,10,10,0.65), rgba(10,10,10,0.78)), url('${bgImage}') center center / cover no-repeat`,
        minHeight: '100vh',
        color: '#b1060f',
      }
    : {
        background: `linear-gradient(135deg, ${currentAvatar.color} 0%, #1a0d0d 100%)`,
        minHeight: '100vh',
        color: '#b1060f',
      };

  // Sidebar navigation
  const scrollToSection = (ref) => {
    setSidebarOpen(false);
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Calendar logic
  const getDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const selectedDateKey = getDateKey(calendarDate);
  const selectedDateTasks = calendarTasks[selectedDateKey] || [];

  const addCalendarTask = () => {
    if (calendarTaskInput.trim()) {
      setCalendarTasks(prev => ({
        ...prev,
        [selectedDateKey]: [...selectedDateTasks, calendarTaskInput.trim()]
      }));
      setCalendarTaskInput('');
    }
  };

  // Pomodoro complete logic
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    return localStorage.getItem('notificationsEnabled') === 'true';
  });
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);

  const handleToggleNotifications = async () => {
    if (!notificationsEnabled) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        localStorage.setItem('notificationsEnabled', 'true');
      }
    } else {
      setNotificationsEnabled(false);
      localStorage.setItem('notificationsEnabled', 'false');
    }
  };

  const showNotification = (title, body) => {
    if (notificationsEnabled && notificationPermission === 'granted') {
      new Notification(title, { body });
    }
  };

  const [showCongrats, setShowCongrats] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [easterEggQuote, setEasterEggQuote] = useState('');
  const [eyesClicked, setEyesClicked] = useState(0);
  const [showJediWarning, setShowJediWarning] = useState(false);

  const onPomodoroComplete = () => {
    const today = getTodayKey();
    setPomodoroCount((prev) => prev + 1);
    setXp((prev) => prev + pomodoroMinutes);
    // Streak logic
    if (lastPomodoroDate === today) {
      // Already did one today, streak unchanged
    } else if (
      new Date(today).getTime() - new Date(lastPomodoroDate).getTime() === 86400000
    ) {
      setStreak((prev) => prev + 1);
    } else {
      setStreak(1);
    }
    setLastPomodoroDate(today);
    // Show reward modal/message
    setRewardMsg(
      `${SITH_MOTIVATION[Math.floor(Math.random() * SITH_MOTIVATION.length)]}\n+${pomodoroMinutes} XP earned!`
    );
    setShowReward(true);
    showNotification('Pomodoro Complete!', 'Take a break or start your next session!');
    setShowCongrats(true);
  };

  // Sith rank logic
  const currentRankIdx = SITH_RANKS.map(r => r.required).filter(r => xp >= r).length - 1;
  const currentRank = SITH_RANKS[currentRankIdx];
  const nextRank = SITH_RANKS[currentRankIdx + 1];
  const rankProgress = nextRank ? (xp - currentRank.required) / (nextRank.required - currentRank.required) : 1;

  // Temporarily unlock all avatars
  const unlockedAvatars = SITH_AVATARS;
  const handleAvatarChange = (idx) => setAvatarIdx(idx);

  // Badges
  const earnedBadges = SITH_BADGES.filter(b => b.condition(pomodoroCount, streak));

  useEffect(() => {
    if (user) localStorage.setItem('sith_user', JSON.stringify(user));
    else localStorage.removeItem('sith_user');
  }, [user]);

  const openAuth = (mode) => {
    setAuthMode(mode);
    setAuthModal(true);
    setAuthError('');
    setAuthForm({ username: '', password: '' });
  };
  const closeAuth = () => setAuthModal(false);

  const handleAuthInput = e => {
    setAuthForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSignUp = e => {
    e.preventDefault();
    if (!authForm.username || !authForm.password) {
      setAuthError('Please enter username and password.');
      return;
    }
    if (userStore[authForm.username]) {
      setAuthError('Username already exists.');
      return;
    }
    setUserStore(store => ({ ...store, [authForm.username]: { password: authForm.password } }));
    setUser({ username: authForm.username, guest: false });
    setAuthModal(false);
  };

  const handleSignIn = e => {
    e.preventDefault();
    if (!authForm.username || !authForm.password) {
      setAuthError('Please enter username and password.');
      return;
    }
    if (!userStore[authForm.username] || userStore[authForm.username].password !== authForm.password) {
      setAuthError('Invalid username or password.');
      return;
    }
    setUser({ username: authForm.username, guest: false });
    setAuthModal(false);
  };

  const handleGuest = () => {
    setUser({ username: 'Guest', guest: true });
    setAuthModal(false);
  };

  const handleLogout = () => setUser(null);

  const [focusMode, setFocusMode] = useState(false);
  const appRef = useRef(null);

  // Focus mode handlers
  const handleFocusMode = () => {
    setFocusMode(true);
    if (appRef.current) {
      if (appRef.current.requestFullscreen) {
        appRef.current.requestFullscreen();
      } else if (appRef.current.webkitRequestFullscreen) {
        appRef.current.webkitRequestFullscreen();
      } else if (appRef.current.mozRequestFullScreen) {
        appRef.current.mozRequestFullScreen();
      } else if (appRef.current.msRequestFullscreen) {
        appRef.current.msRequestFullscreen();
      }
    }
  };
  const handleExitFocusMode = () => {
    setFocusMode(false);
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  // Exit focus mode if user exits fullscreen via browser
  React.useEffect(() => {
    function onFullscreenChange() {
      if (!document.fullscreenElement) setFocusMode(false);
    }
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const [showTimerPrompt, setShowTimerPrompt] = useState(true);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customInput, setCustomInput] = useState(66);
  const [customError, setCustomError] = useState('');

  // Timer prompt handlers
  const handleUseDefault = () => {
    setPomodoroMinutes(66);
    setShowTimerPrompt(false);
  };
  const handleShowCustom = () => {
    setShowCustomInput(true);
  };
  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customInput < 1 || customInput > 120) {
      setCustomError('Please enter a value between 1 and 120.');
      return;
    }
    setPomodoroMinutes(customInput);
    setShowTimerPrompt(false);
    setCustomError('');
  };

  // Lightsaber progress calculation
  const saberProgress = 1 - secondsLeft / (pomodoroMinutes * 60);

  // Share streak handler
  const handleShareStreak = () => {
    const msg = `I've completed a ${streak}-day Sith focus streak with Order 66! #SithProductivity`;
    if (navigator.share) {
      navigator.share({ title: 'Order 66 Streak', text: msg, url: window.location.href });
    } else {
      navigator.clipboard.writeText(msg);
      alert('Streak copied to clipboard!');
    }
  };

  const handleEyesClick = () => {
    const newCount = eyesClicked + 1;
    setEyesClicked(newCount);
    
    if (newCount >= 5) {
      const randomQuote = YODA_EASTER_EGG_QUOTES[Math.floor(Math.random() * YODA_EASTER_EGG_QUOTES.length)];
      setEasterEggQuote(randomQuote);
      setShowEasterEgg(true);
      setEyesClicked(0);
    }
  };

  const handleJediThemeClick = () => {
    setShowJediWarning(true);
  };

  return (
    <div className="SithLayout" ref={appRef}>
      {/* 3D Parallax Background Layers */}
      <div className="SithParallaxContainer">
        <div className="SithParallaxLayer"></div>
        <div className="SithParallaxLayer"></div>
        <div className="SithParallaxLayer"></div>
      </div>
      
      {/* 3D Floating Particles */}
      <div className="SithParticles">
        <div className="SithParticle"></div>
        <div className="SithParticle"></div>
        <div className="SithParticle"></div>
        <div className="SithParticle"></div>
        <div className="SithParticle"></div>
        <div className="SithParticle"></div>
        <div className="SithParticle"></div>
        <div className="SithParticle"></div>
        <div className="SithParticle"></div>
      </div>
      
      {/* 3D Mouse Follower */}
      <div className="SithMouseFollower" id="mouseFollower"></div>
      
      {/* 3D Scroll Indicator */}
      <div className="SithScrollIndicator">
        <div className="SithScrollDot" onClick={() => scrollToSection(tasksRef)}></div>
        <div className="SithScrollDot" onClick={() => scrollToSection(pomoRef)}></div>
        <div className="SithScrollDot" onClick={() => scrollToSection(calendarRef)}></div>
      </div>
      
      {focusMode && <div className="FocusOverlay" onClick={handleExitFocusMode}><button className="SithButton FocusExitBtn" onClick={handleExitFocusMode}>Exit Focus Mode</button></div>}
      {showTimerPrompt && (
        <div className="TimerPromptOverlay">
          <div className="TimerPromptModal">
            <h2>Pomodoro Timer Setup</h2>
            <p>Default Pomodoro timer is <b>66 minutes</b>.<br/>Would you like to use this, or enter a custom duration?</p>
            {!showCustomInput ? (
              <div style={{ display: 'flex', gap: 12, margin: '1rem 0' }}>
                <button className="SithButton" onClick={handleUseDefault}>Use 66 min</button>
                <button className="SithButton" onClick={handleShowCustom}>Custom</button>
              </div>
            ) : (
              <form onSubmit={handleCustomSubmit} style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '1rem 0' }}>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={customInput}
                  onChange={e => setCustomInput(Number(e.target.value))}
                  style={{ width: 60, padding: '0.3rem 0.5rem', borderRadius: 8, border: '1px solid #2a161a', background: '#1a0d0d', color: '#fff' }}
                />
                <button className="SithButton" type="submit">Set Timer</button>
              </form>
            )}
            {customError && <div style={{ color: '#ff2d2d', marginTop: 8 }}>{customError}</div>}
          </div>
        </div>
      )}
      {/* Auth Modal */}
      {authModal && (
        <div className="SithRewardModal" onClick={closeAuth}>
          <div className="SithRewardContent" onClick={e => e.stopPropagation()}>
            <h2>{authMode === 'signin' ? 'Sign In' : 'Sign Up'}</h2>
            <form onSubmit={authMode === 'signin' ? handleSignIn : handleSignUp}>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={authForm.username}
                onChange={handleAuthInput}
                autoFocus
                style={{ marginBottom: '0.7rem', width: '100%' }}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={authForm.password}
                onChange={handleAuthInput}
                style={{ marginBottom: '0.7rem', width: '100%' }}
              />
              {authError && <div style={{ color: '#b1060f', marginBottom: '0.7rem' }}>{authError}</div>}
              <button className="SithButton" type="submit" style={{ width: '100%' }}>
                {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            </form>
            <button className="SithButton" style={{ width: '100%', marginTop: '0.7rem' }} onClick={handleGuest}>
              Continue as Guest
            </button>
            <div style={{ marginTop: '0.7rem' }}>
              {authMode === 'signin' ? (
                <span>Don&apos;t have an account? <button className="SithButton" style={{ padding: '0.2rem 0.7rem', fontSize: '0.95rem' }} onClick={() => setAuthMode('signup')}>Sign Up</button></span>
              ) : (
                <span>Already have an account? <button className="SithButton" style={{ padding: '0.2rem 0.7rem', fontSize: '0.95rem' }} onClick={() => setAuthMode('signin')}>Sign In</button></span>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Top right auth buttons */}
      <div className="SithAuthTopRight">
        {user ? (
          <>
            <span className="SithUserStatus">{user.guest ? 'Guest' : user.username}</span>
            <button className="SithButton" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <button className="SithButton" onClick={() => openAuth('signin')}>Sign In</button>
            <button className="SithButton" onClick={() => openAuth('signup')}>Sign Up</button>
          </>
        )}
      </div>
      {/* Reward Modal */}
      {showReward && (
        <div className="SithRewardModal" onClick={() => setShowReward(false)}>
          <div className="SithRewardContent">
            <h2>Pomodoro Complete!</h2>
            <p>{rewardMsg}</p>
            <button className="SithButton" onClick={() => setShowReward(false)}>Close</button>
          </div>
        </div>
      )}
      {/* Congratulations Modal */}
      {showCongrats && (
        <div className="CongratsModalOverlay">
          <div className="CongratsModal">
            <h2>Congratulations!</h2>
            <p>You completed your Pomodoro session.<br />Embrace your power!</p>
            <button className="SithButton" onClick={() => setShowCongrats(false)}>Close</button>
          </div>
        </div>
      )}
      {/* Easter Egg Modal */}
      {showEasterEgg && (
        <div className="SithRewardModal" onClick={() => setShowEasterEgg(false)}>
          <div className="SithRewardContent SithEasterEggContent">
            <h2>🎉 Easter Egg Unlocked! 🎉</h2>
            <div className="YodaQuote">
              <p className="YodaQuoteText">"{easterEggQuote}"</p>
              <p className="YodaSignature">- Master Yoda</p>
            </div>
            <p className="EasterEggCounter">Eyes clicked: {eyesClicked} times</p>
            <button className="SithButton" onClick={() => setShowEasterEgg(false)}>Close</button>
          </div>
        </div>
      )}
      {/* Jedi Theme Warning Modal */}
      {showJediWarning && (
        <div className="SithRewardModal" onClick={() => setShowJediWarning(false)}>
          <div className="SithRewardContent">
            <h2>⚡ TRAITOR DETECTED! ⚡</h2>
            <p style={{ fontSize: '1.2rem', color: '#b1060f', fontWeight: 'bold', marginBottom: '1rem' }}>
              "You dare speak of the Jedi in the presence of the Sith?"
            </p>
            <p style={{ marginBottom: '1rem' }}>
              There is no Jedi theme here, only the power of the Dark Side. 
              Your weakness will be your undoing.
            </p>
            <p style={{ fontStyle: 'italic', color: '#b1060f' }}>
              "Once you start down the dark path, forever will it dominate your destiny."
            </p>
            <button className="SithButton" onClick={() => setShowJediWarning(false)}>Embrace the Dark Side</button>
          </div>
        </div>
      )}
      {/* Sidebar overlay for mobile/desktop */}
      <div className={`SithSidebarOverlay${sidebarOpen ? ' open' : ''}`} onClick={() => setSidebarOpen(false)} />
      <nav className={`SithSidebarDrawer${sidebarOpen ? ' open' : ''}`}>
        <div className="SithSidebarTitle">
          <button className="SithSidebarClose" onClick={() => setSidebarOpen(false)}>&times;</button>
        </div>
        <ul>
          <li><button onClick={() => scrollToSection(tasksRef)}>Tasks</button></li>
          <li><button onClick={() => scrollToSection(pomoRef)}>Pomodoro</button></li>
          <li><button onClick={() => scrollToSection(calendarRef)}>Calendar</button></li>
        </ul>
      </nav>
      <div className="SithApp" style={backgroundStyle}>
        <header className="SithHeader">
          <button className="SithSidebarMenuBtn" onClick={() => setSidebarOpen(true)}>☰</button>
          <div className="SithAvatarRow">
            <span className="SithAvatarName">{currentAvatar.name}</span>
            <div className="SithAvatarPicker">
              {SITH_AVATARS.map((a, i) => (
                <button
                  key={a.name}
                  className={`SithAvatarPickBtn ${i === avatarIdx ? 'selected' : ''}`}
                  onClick={() => handleAvatarChange(i)}
                  title={a.name}
                >
                  {a.name}
                </button>
              ))}
            </div>
          </div>
          <div className="SithRankBar">
            <div className="SithRankRow">
              <div className="SithEyesContainer" onClick={handleEyesClick}>
                <div className="SithEye left-eye">
                  <div className="SithEyeGlow"></div>
                  <div className="SithEyePupil"></div>
                </div>
                <div className="SithEye right-eye">
                  <div className="SithEyeGlow"></div>
                  <div className="SithEyePupil"></div>
                </div>
              </div>
              <span className="SithRank">{currentRank.title} ({xp} XP)</span>
            </div>
            <div className="SithRankProgress">
              <div className="SithRankProgressFill" style={{ width: `${rankProgress * 100}%` }} />
            </div>
            {nextRank && <span className="SithRankNext">Next: {nextRank.title} ({nextRank.required} XP)</span>}
          </div>
          <div className="SithStreak">🔥 Streak: {streak} days</div>
          <div className="SithBadges">
            {earnedBadges.map(b => <span key={b.name} className="SithBadge">{b.name}</span>)}
          </div>
          <h1>Order 66 Productivity</h1>
          <p className="SithMotto">"{quote}"</p>
          <div className="SithHeaderActions">
          <button className="SithButton" onClick={randomQuote}>Inspire Me</button>
            <a
              className="SithButton SithSpotifyBtn"
              href="https://open.spotify.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Spotify
            </a>
            <button className="SithButton" onClick={handleJediThemeClick}>Switch to Jedi Theme</button>
          </div>
        </header>
        <main>
          <section className="SithSection" ref={tasksRef}>
            <div className="SithRankRow">
              <div className="SithEyesContainer">
                <div className="SithEye left-eye">
                  <div className="SithEyeGlow"></div>
                  <div className="SithEyePupil"></div>
                </div>
                <div className="SithEye right-eye">
                  <div className="SithEyeGlow"></div>
                  <div className="SithEyePupil"></div>
                </div>
              </div>
              <h2>To-Do List</h2>
            </div>
            <div className="SithTodoInput">
              <input
                type="text"
                value={task}
                onChange={e => setTask(e.target.value)}
                placeholder="What is thy bidding, my master?"
              />
              <button className="SithButton" onClick={addTask}>Add</button>
            </div>
            <ul className="SithTodoList">
              {tasks.map((t, i) => (
                <li key={i} className={t.done ? 'done' : ''}>
                  {t.done && justCompleted.includes(i) && <div className="SithTaskLight" />}
                  <span onClick={() => toggleTask(i)}>{t.text}</span>
                  <button className="SithRemove" onClick={() => removeTask(i)}>X</button>
                </li>
              ))}
            </ul>
          </section>
          <section className="SithSection" ref={pomoRef}>
            <div className="SithRankRow">
              <div className="SithEyesContainer">
                <div className="SithEye left-eye">
                  <div className="SithEyeGlow"></div>
                  <div className="SithEyePupil"></div>
                </div>
                <div className="SithEye right-eye">
                  <div className="SithEyeGlow"></div>
                  <div className="SithEyePupil"></div>
                </div>
              </div>
              <h2>Pomodoro Timer</h2>
            </div>
            <div className="SithPomodoroSettings">
              <label htmlFor="pomodoro-minutes">Minutes: </label>
              <input
                id="pomodoro-minutes"
                type="number"
                min="1"
                max="120"
                value={pomodoroMinutes}
                onChange={e => setPomodoroMinutes(Math.max(1, Math.min(120, Number(e.target.value))))}
                disabled={isRunning}
              />
              <button className="SithButton" onClick={handleToggleNotifications} style={{ marginLeft: 12 }}>
                {notificationsEnabled ? 'Disable Desktop Notifications' : 'Enable Desktop Notifications'}
              </button>
              {notificationPermission === 'denied' && (
                <span style={{ color: '#ff2d2d', marginLeft: 8 }}>Notifications are blocked in your browser settings.</span>
              )}
            </div>
            {/* Lightsaber progress bar */}
            <div className="SithSaberBarWrap">
              <div className="SithSaberBar">
                <div className="SithSaberBlade" style={{ width: `${Math.max(0, Math.min(1, saberProgress)) * 100}%` }} />
                <div className="SithSaberHilt" />
              </div>
            </div>
            <div className="SithPomodoro">
              <div className="SithTimerDisplay">{formatTime(secondsLeft)}</div>
              <div className="SithTimerControls">
                <button className="SithButton" onClick={startTimer} disabled={isRunning || secondsLeft === 0}>Start</button>
                <button className="SithButton" onClick={pauseTimer} disabled={!isRunning}>Pause</button>
                <button className="SithButton" onClick={resetTimer}>Reset</button>
                {!focusMode && <button className="SithButton" onClick={handleFocusMode}>Focus Mode</button>}
              </div>
              {secondsLeft === 0 && <div className="SithTimerEnd">Pomodoro Complete! Embrace your power.</div>}
            </div>
          </section>
          {/* Stats Section */}
          <section className="SithSection SithStatsSection" ref={statsRef}>
            <div className="SithRankRow">
              <div className="SithEyesContainer">
                <div className="SithEye left-eye">
                  <div className="SithEyeGlow"></div>
                  <div className="SithEyePupil"></div>
                </div>
                <div className="SithEye right-eye">
                  <div className="SithEyeGlow"></div>
                  <div className="SithEyePupil"></div>
                </div>
              </div>
              <h2>Stats</h2>
            </div>
            <div className="SithStatsRow"><b>Current Streak:</b> {streak} days</div>
            <div className="SithStatsRow"><b>Total Pomodoros:</b> {pomodoroCount}</div>
            <div className="SithStatsRow"><b>XP Earned:</b> {xp}</div>
            <button className="SithButton SithShareStreakBtn" onClick={handleShareStreak} style={{ marginTop: 16 }}>
              Share Your Streak
            </button>
          </section>
          <section className="SithSection" ref={calendarRef}>
            <div className="SithRankRow">
              <div className="SithEyesContainer">
                <div className="SithEye left-eye">
                  <div className="SithEyeGlow"></div>
                  <div className="SithEyePupil"></div>
                </div>
                <div className="SithEye right-eye">
                  <div className="SithEyeGlow"></div>
                  <div className="SithEyePupil"></div>
                </div>
              </div>
              <h2>Calendar</h2>
            </div>
            <div className="SithCalendarWrap">
              <Calendar
                onChange={setCalendarDate}
                value={calendarDate}
                className="SithCalendar"
                view="month"
                showNeighboringMonth={false}
              />
              <div className="SithCalendarTasks">
                <h3>Tasks for {selectedDateKey}</h3>
                <ul>
                  {selectedDateTasks.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
                <div className="SithTodoInput">
                  <input
                    type="text"
                    value={calendarTaskInput}
                    onChange={e => setCalendarTaskInput(e.target.value)}
                    placeholder="Add a task for this day"
                  />
                  <button className="SithButton" onClick={addCalendarTask}>Add</button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
