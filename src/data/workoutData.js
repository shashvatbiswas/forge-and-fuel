export const workoutCategories = [
  { id: 'all', name: 'All Exercises', icon: 'fa-dumbbell' },
  { id: 'chest', name: 'Chest', icon: 'fa-child-reaching' },
  { id: 'back', name: 'Back & Lats', icon: 'fa-shield-halved' },
  { id: 'legs', name: 'Legs & Glutes', icon: 'fa-person-running' },
  { id: 'shoulders', name: 'Shoulders', icon: 'fa-child' },
  { id: 'arms', name: 'Biceps & Triceps', icon: 'fa-hand-fist' },
  { id: 'core', name: 'Abs & Core', icon: 'fa-fire' },
  { id: 'cardio', name: 'HIIT & Cardio', icon: 'fa-bolt' }
];

export const exercisesData = [
  {
    id: 'barbell-bench-press',
    name: 'Barbell Flat Bench Press',
    category: 'chest',
    equipment: 'Barbell & Flat Bench',
    difficulty: 'Intermediate',
    targetMuscles: ['Pectoralis Major', 'Anterior Deltoids', 'Triceps Brachii'],
    secondaryMuscles: ['Serratus Anterior', 'Core Stabilizers'],
    visualType: 'bench-press',
    steps: [
      'Lie flat on bench with feet planted firmly on the ground.',
      'Grip the bar slightly wider than shoulder-width with a full overhand grip.',
      'Unrack bar, lock arms directly above upper chest, and tuck shoulder blades back and down.',
      'Inhale and lower the bar in a controlled path to mid-sternum.',
      'Pause for a fraction of a second, then explosively drive bar upward until arms are extended.'
    ],
    mistakes: [
      'Flaring elbows out at a 90-degree angle (keep at 45-70 degrees).',
      'Bouncing bar off chest at bottom of movement.',
      'Lifting hips off bench during heavy drive.'
    ],
    safetyTip: 'Always use a spotter or safety bars when pushing heavy weight near failure.'
  },
  {
    id: 'incline-dumbbell-press',
    name: 'Incline Dumbbell Press',
    category: 'chest',
    equipment: 'Dumbbells & Incline Bench',
    difficulty: 'Beginner - Intermediate',
    targetMuscles: ['Upper Pectoralis (Clavicular Head)', 'Anterior Deltoids'],
    secondaryMuscles: ['Triceps'],
    visualType: 'incline-press',
    steps: [
      'Set incline bench between 30 to 45 degrees.',
      'Sit with dumbbells resting on knees, kick them up as you lay back into position.',
      'Retract shoulder blades into bench and hold dumbbells at chest width.',
      'Press dumbbells up in a slight arc until arms are extended above upper chest.',
      'Lower under strict 2-3 second control until upper chest stretch is felt.'
    ],
    mistakes: [
      'Setting bench angle too high (>60 degrees shifts load entirely to front delts).',
      'Colliding dumbbells together at top which loses tension.'
    ],
    safetyTip: 'If failing a rep, drop dumbbells outward to the floor safely—never collapse them onto chest.'
  },
  {
    id: 'barbell-deadlift',
    name: 'Conventional Barbell Deadlift',
    category: 'back',
    equipment: 'Barbell & Weight Plates',
    difficulty: 'Advanced',
    targetMuscles: ['Erector Spinae', 'Latissimus Dorsi', 'Hamstrings', 'Gluteus Maximus'],
    secondaryMuscles: ['Trapezius', 'Forearms', 'Core'],
    visualType: 'deadlift',
    steps: [
      'Stand with mid-foot directly under barbell, feet hip-width apart.',
      'Hinge at hips to grip bar shoulder-width apart without rounding spine.',
      'Bend knees until shins touch bar, pull chest up, tighten lats ("pack your armpits").',
      'Drive through the floor with feet while extending hips and knees simultaneously.',
      'Lock out with hips pressed into bar—do not hyperextend lower back at top.'
    ],
    mistakes: [
      'Rounding lumbar spine during initial floor lift.',
      'Bar drifting away from body during upward motion.',
      'Jerking the bar off floor instead of taking slack out first.'
    ],
    safetyTip: 'Brace core with a deep 360-degree intra-abdominal breath before initiating floor pull.'
  },
  {
    id: 'pull-ups',
    name: 'Bodyweight Pull-Ups',
    category: 'back',
    equipment: 'Pull-Up Bar',
    difficulty: 'Intermediate',
    targetMuscles: ['Latissimus Dorsi', 'Rhomboids', 'Middle Trapezius'],
    secondaryMuscles: ['Biceps Brachii', 'Brachialis'],
    visualType: 'pullup',
    steps: [
      'Grip pull-up bar with overhand grip slightly wider than shoulder width.',
      'Hang with arms fully extended into a dead hang, retract shoulder blades.',
      'Pull chest up toward bar by driving elbows down into side pockets.',
      'Continue until chin clears the bar cleanly.',
      'Lower down under full control back into full arm extension.'
    ],
    mistakes: [
      'Using momentum or swinging legs (kipping) when aiming for hypertrophy.',
      'Cutting bottom range of motion short (partial reps).'
    ],
    safetyTip: 'Avoid shrugging shoulders up to ears at top of repetition to protect rotator cuff.'
  },
  {
    id: 'barbell-back-squat',
    name: 'Barbell High Bar Back Squat',
    category: 'legs',
    equipment: 'Squat Rack & Barbell',
    difficulty: 'Intermediate - Advanced',
    targetMuscles: ['Quadriceps', 'Gluteus Maximus'],
    secondaryMuscles: ['Adductor Magnus', 'Hamstrings', 'Core'],
    visualType: 'squat',
    steps: [
      'Step under bar, rest it across upper traps, grasp bar firmly with hands.',
      'Unrack bar, take 2 controlled steps back, set feet slightly wider than shoulder width.',
      'Brace core deeply, push knees outward while breaking at hips and knees simultaneously.',
      'Descend until crease of hip drops below top of knee (parallel or below).',
      'Drive out of bottom position by pushing floor away through full foot.'
    ],
    mistakes: [
      'Knees collapsing inward (valgus knee collapse).',
      'Heels lifting off ground during bottom position.',
      'Rounding lower back at bottom ("butt wink").'
    ],
    safetyTip: 'Always adjust safety catch bars at hip level inside squat rack before loading heavy.'
  },
  {
    id: 'romanian-deadlift',
    name: 'Dumbbell Romanian Deadlift (RDL)',
    category: 'legs',
    equipment: 'Dumbbells / Barbell',
    difficulty: 'Intermediate',
    targetMuscles: ['Hamstrings', 'Gluteus Maximus'],
    secondaryMuscles: ['Lower Back / Erector Spinae'],
    visualType: 'rdl',
    steps: [
      'Stand holding dumbbells against front of thighs, feet shoulder-width apart.',
      'Soft knee bend, push hips directly back while sliding dumbbells close along legs.',
      'Maintain neutral spine until deep hamstring stretch is felt (usually mid-shin).',
      'Squeeze glutes and push hips forward to return to standing position.'
    ],
    mistakes: [
      'Bending knees excessively turning move into a squat.',
      'Allowing weights to drift away from thighs.'
    ],
    safetyTip: 'Stop descent as soon as hips stop moving backward; going further forces lumbar flexion.'
  },
  {
    id: 'overhead-shoulder-press',
    name: 'Standing Barbell Overhead Press (OHP)',
    category: 'shoulders',
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    targetMuscles: ['Anterior & Lateral Deltoids'],
    secondaryMuscles: ['Triceps', 'Upper Pectoralis', 'Core'],
    visualType: 'overhead-press',
    steps: [
      'Rack bar at collarbone height, grip bar shoulder-width apart.',
      'Unrack, step back, squeeze glutes and brace core tightly.',
      'Press bar straight overhead, tucking chin slightly so bar clears face.',
      'Once bar passes head, push head forward under bar to full lockout overhead.',
      'Lower bar in controlled path back to clavicle.'
    ],
    mistakes: [
      'Leaning backward excessively at waist to turn move into incline chest press.',
      'Flaring forearms out of vertical alignment.'
    ],
    safetyTip: 'Maintain tight abdominal brace and glute contraction to protect lower lumbar spine.'
  },
  {
    id: 'dumbbell-lateral-raises',
    name: 'Dumbbell Lateral Raise',
    category: 'shoulders',
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    targetMuscles: ['Lateral Deltoid (Side Shoulder)'],
    secondaryMuscles: ['Supraspinatus', 'Trapezius'],
    visualType: 'lateral-raise',
    steps: [
      'Stand upright holding dumbbells at sides, slight knee bend, core engaged.',
      'Lean torso forward 5-10 degrees, slight bend at elbows.',
      'Raise arms out to sides in sweeping arc until elbow reaches shoulder height.',
      'Lead with elbows, keeping pinkies slightly higher than thumbs at top.',
      'Lower dumbbells under 2-second negative control.'
    ],
    mistakes: [
      'Swinging upper body backward to bounce weights up.',
      'Raising hands higher than elbows.'
    ],
    safetyTip: 'Use light weight with strict technique—side delts respond to metabolic tension.'
  },
  {
    id: 'incline-bicep-curls',
    name: 'Incline Dumbbell Bicep Curl',
    category: 'arms',
    equipment: 'Incline Bench & Dumbbells',
    difficulty: 'Beginner - Intermediate',
    targetMuscles: ['Biceps Brachii (Long Head)'],
    secondaryMuscles: ['Brachialis', 'Forearms'],
    visualType: 'curl',
    steps: [
      'Set bench to 60-degree incline, sit back letting arms hang completely straight downward.',
      'Keep upper arms locked vertically perpendicular to floor.',
      'Inhale, exhale while curling dumbbells up while supinating wrists (palms up).',
      'Squeeze biceps hard at top peak contraction.',
      'Lower under 3-second strict stretch back to dead hang.'
    ],
    mistakes: [
      'Swinging upper arms forward to ease movement.',
      'Lifting shoulders off bench.'
    ],
    safetyTip: 'Emphasize deep stretch at bottom position for maximum long-head biceps hypertrophy.'
  },
  {
    id: 'tricep-rope-pushdown',
    name: 'Cable Tricep Rope Pushdown',
    category: 'arms',
    equipment: 'Cable Machine & Rope Attachment',
    difficulty: 'Beginner',
    targetMuscles: ['Triceps Brachii (Lateral & Medial Heads)'],
    secondaryMuscles: ['Triceps Long Head'],
    visualType: 'tricep-pushdown',
    steps: [
      'Attach rope to high cable pulley. Stand upright with knees soft, grip rope handles.',
      'Pin elbows firmly against ribcage.',
      'Push rope down until arms fully lock out at bottom.',
      'Spread rope handles outward at bottom peak for extra triceps contraction.',
      'Return up under control until forearms touch biceps.'
    ],
    mistakes: [
      'Elbows drifting forward and backward during rep.',
      'Humping body weight over rope.'
    ],
    safetyTip: 'Keep wrists stiff to avoid wrist strain during full extension.'
  },
  {
    id: 'hanging-leg-raises',
    name: 'Hanging Captain Leg & Knee Raises',
    category: 'core',
    equipment: 'Pull-Up Bar or Captains Chair',
    difficulty: 'Intermediate',
    targetMuscles: ['Rectus Abdominis (Lower Abs)', 'Iliopsoas'],
    secondaryMuscles: ['Obliques', 'Grip Strength'],
    visualType: 'leg-raise',
    steps: [
      'Hang from pull-up bar with overhand grip or rest elbows on captain chair pads.',
      'Brace core, keep legs extended straight (or knees bent 90 degrees for regression).',
      'Curl pelvis upward toward ribcage while raising legs to 90 degrees or higher.',
      'Pause for a beat at top abs crunch.',
      'Lower legs slowly without letting body swing.'
    ],
    mistakes: [
      'Swinging hips for momentum instead of contracting abs.',
      'Lifting legs using hip flexors only without pelvic tilt.'
    ],
    safetyTip: 'Ensure shoulders remain active in socket during hanging posture.'
  },
  {
    id: 'hiit-burpees',
    name: 'Full Body Explosive Burpees',
    category: 'cardio',
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    targetMuscles: ['Cardiovascular System', 'Full Body Conditioning'],
    secondaryMuscles: ['Pectoralis', 'Quadriceps', 'Deltoids', 'Core'],
    visualType: 'burpee',
    steps: [
      'Stand tall, feet shoulder-width apart.',
      'Drop quickly into a squat, placing hands flat on floor inside feet.',
      'Jump feet back into full push-up position, perform strict chest-to-floor push-up.',
      'Explode feet back forward near hands.',
      'Leap explosively into air, reaching hands overhead, landing softly.'
    ],
    mistakes: [
      'Sagging lower back into hyperextension during push-up plank phase.',
      'Landing heavily on flat feet without soft knee absorption.'
    ],
    safetyTip: 'Maintain core rigidity during plank jump phase to protect spine.'
  }
];
