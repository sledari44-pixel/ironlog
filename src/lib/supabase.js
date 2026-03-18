import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase project values
// Found at: supabase.com → your project → Settings → API
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://YOUR_PROJECT.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_ANON_KEY'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Save a completed set to Supabase
export async function saveSet({ workout_type, lift, weight_lbs, reps }) {
  const { data, error } = await supabase
    .from('sets')
    .insert([{ workout_type, lift, weight_lbs: Number(weight_lbs), reps: Number(reps) }])
    .select()
    .single()
  if (error) throw error
  return data
}


// Fetch today's sets
export async function fetchTodaysSets() {
  const today = new Date().toISOString().split('T')[0]
  const { data, error } = await supabase
    .from('sets')
    .select('*')
    .gte('logged_at', today + 'T00:00:00')
    .lte('logged_at', today + 'T23:59:59')
    .order('logged_at', { ascending: false })
  if (error) throw error
  return data || []
}

// Fetch all sets (for history screen)
export async function fetchAllSets({ limit = 200 } = {}) {
  const { data, error } = await supabase
    .from('sets')
    .select('*')
    .order('logged_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data || []
}

// Exercise lists per workout type
export const LIFTS = {
  Push: [
    'Assisted Dips', 'Bench Press Bar', 'Bench Press Machine', 'Bench Press Smith Machine',
    'Cable Fly', 'Cable Lateral Raises', 'Close Grip Bench Smith Machine',
    'Crossbody Triceps Extensions', 'Flat Bench Press Dumbbell',
    'Hammer Strength Incline Bench Press', 'Hammer Strength Pec Deck Machine',
    'Hammer Strength Shoulder Press', 'Incline Bench Press Bar',
    'Incline Bench Press Dumbbell', 'Incline Bench Press Smith Machine',
    'JM Press Smith Machine', 'Lateral Raises Dumbbell', 'Overhead Tricep Ext - Rope',
    'Shoulder Press Dumbbell', 'Skull Crushers', 'Tricep Ext EZ Bar', 'Single Arm Tricep Ext',
    'Tricep Pushdown Machine', 'Triceps Ext Rope', 'Triceps Pushdowns with Vbar',
  ],
  Pull: [
    'Back Row Machine', 'Bent Over Back Row Bar', 'Meadows Row',
    'Cable Curls Dual Stack', 'Cable Curls EZ Bar', 'Cable Hammer Curls Rope',
    'Cable Row Neutral', 'Cable Row Single Arm', 'Cable Row Vbar', 'Cable Row WG',
    'Chest Supported Row Dumbbell', 'Chest Supported Row Dumbbell WG',
    'Dumbbell Curls', 'Face Pulls', 'Hammer Curls Dumbbells',
    'Hammer Strength Back Row Neutral Grip', 'Hammer Strength Back Row Wide Grip',
    'Hammer Strength Lat Pulldown', 'Hammer Strength Preacher Curl',
    'Hammer Strength Rear Delt Fly Machine', 'Incline Curls - Dumbbells',
    'Lat Pull Down Close Grip', 'Lat Pulldown Neutral', 'Lat Pulldown Supinated',
    'Lat Pulldown Wide Grip', 'One Arm Dumbbell Row', 'Pull Overs',
    'Rear Delt Fly - Cable', 'Rev EZ Curl Cable', 'Shrug Dumbbell',
    'Single Arm Cable Lat Pulldown', 'Straight Bar Curl',
  ],
  Legs: [
    'Back Squat', 'Bulgarian Split Squat', 'Deadlift', 'Goblet Squat', 'Hack Squat',
    'Hammer Strength Hip Thrust', 'Leg Curl Prone Machine', 'Leg Curl Seated', 'Leg Ext Machine',
    'Leg Press', 'Leg Press Stack Machine', 'RDL Bar', 'RDL Dumbbell', 'Seated Calf Raise','Standing Calf Raises',
  ],
  Core: [
    'Ab Wheel', 'Cable Crunch', 'Dead Bug', 'Decline Sit-Up', 'Dragon Flag',
    'Hanging Leg Raise', 'L-Sit', 'Pallof Press', 'Plank', 'Russian Twist',
  ],
  Cardio: [
    'Elliptical', 'HIIT Circuit', 'Jump Rope', 'Rowing Machine',
    'Stair Climber', 'Stationary Bike', 'Swimming', 'Treadmill Run',
  ],
  Mobility: [
    'Ankle Circles', 'Band Pull-Apart', 'Cat-Cow', 'Hip Flexor Stretch',
    'Pigeon Pose', 'Shoulder Dislocates', 'Thoracic Rotation', "World's Greatest Stretch",
  ],
}

export const WORKOUT_TYPES = Object.keys(LIFTS)
