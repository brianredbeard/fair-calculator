# FAIR Calculator Tutorial Recording Guide

## Overview

This guide provides technical specifications, best practices, and workflow procedures for recording professional voiceover narration for all 12 FAIR Calculator tutorials.

## Equipment Requirements

### Audio Recording
- **Microphone**: Condenser microphone (USB or XLR) with cardioid pattern
  - Recommended: Audio-Technica AT2020, Blue Yeti, Shure SM7B
- **Audio Interface**: If using XLR microphone (Focusrite Scarlett, PreSonus AudioBox)
- **Headphones**: Closed-back monitoring headphones (avoid audio bleed)
- **Pop Filter**: Foam or mesh pop filter to reduce plosives (p, b, t sounds)
- **Acoustic Treatment**: Record in quiet room with minimal echo
  - Portable vocal booth or DIY treatment (blankets, foam panels)

### Screen Recording
- **Software**: OBS Studio, Camtasia, or ScreenFlow
- **Resolution**: 1920×1080 minimum
- **Frame Rate**: 30 or 60 fps
- **Browser**: Latest Chrome or Firefox with tutorial system loaded
- **Display**: Single monitor recommended (avoid cursor jumping between screens)

## Audio Standards

### Technical Specifications
- **Sample Rate**: 48 kHz (video standard)
- **Bit Depth**: 24-bit
- **Format**: WAV or FLAC (lossless) for master, MP3 320kbps for distribution
- **Loudness**: -16 LUFS integrated (broadcast standard)
- **True Peak**: -1.0 dBTP maximum (prevent clipping)
- **Noise Floor**: -60 dB minimum (background noise threshold)

### Voice Quality
- **Pacing**: 120–140 words per minute (conversational, not rushed)
- **Tone**: Professional but approachable (explaining to a colleague, not lecturing)
- **Consistency**: Same voice talent for all 12 tutorials
- **Energy**: Engaged and interested (tutorials are 12–20 minutes, maintain energy throughout)
- **Pronunciation**: Clear articulation of technical terms (FAIR, GDPR, LEF, TCap, etc.)

## Recording Workflow

### Pre-Production (Per Tutorial)

1. **Script Review**
   - Read entire voiceover script aloud twice before recording
   - Mark difficult words or phrases for practice
   - Note timing: script should align with 12–20 minute estimate
   - Identify natural break points for retakes

2. **Environment Setup**
   - Close windows, turn off HVAC (record during quiet hours)
   - Silence phone notifications, disable computer alerts
   - Position microphone 6–8 inches from mouth, slightly off-axis
   - Test recording: record 30 seconds, check levels and quality

3. **Calibration**
   - Speak at normal tutorial pace, set input gain for -18 to -12 dB peaks
   - Verify no clipping (levels never reach 0 dB)
   - Listen for room tone, minimize background noise

### Recording Session

1. **Warm-Up**
   - Record 2–3 minutes of throwaway narration to warm up voice
   - Vocalize, stretch jaw, hydrate (room temperature water, no ice)

2. **Recording Method: Paragraph-by-Paragraph**
   - Record one paragraph at a time (easier to edit than long takes)
   - Leave 2–3 seconds of silence between paragraphs (edit room)
   - If you make a mistake: pause 3 seconds, re-read the paragraph
   - Do NOT stop recording until section/chapter complete

3. **Room Tone**
   - At end of each chapter, record 30 seconds of silence in same position
   - Used in editing to fill gaps and smooth transitions

4. **Review**
   - Listen to each chapter immediately after recording
   - Mark any retakes needed (mispronunciations, pacing issues, mouth clicks)
   - Re-record problematic paragraphs while setup is still fresh

### Post-Production

1. **Editing**
   - Remove mistakes, long pauses, mouth clicks, breaths (where excessive)
   - Normalize audio to -16 LUFS integrated loudness
   - Apply gentle EQ: high-pass filter at 80 Hz, boost 3–5 kHz for clarity
   - Apply gentle compression: 3:1 ratio, -18 dB threshold (smooth dynamics)
   - De-ess: reduce harsh sibilance (s, sh sounds) at 6–8 kHz
   - Noise reduction: gentle (preserve voice quality, don't over-process)

2. **Mastering**
   - Verify true peak never exceeds -1.0 dBTP
   - Export WAV (master archive) and MP3 320kbps (distribution)
   - File naming: `{tutorial-id}-chapter-{n}.mp3` (e.g., `ransomware-chapter-1.mp3`)

3. **Quality Check**
   - Listen to entire audio on different playback systems (headphones, laptop speakers, phone)
   - Verify pacing feels natural, no jarring edits
   - Check loudness consistency across all chapters

## Handling "Try It" Experiment Segments

Experiment prompts appear in certain tutorial steps (e.g., "Try doubling Contact Frequency to 10–100..."). These require special handling during recording:

### Voiceover Approach
- **Pause Duration**: After reading the experiment prompt, pause for 8–10 seconds
  - This gives the viewer time to interact with the calculator
  - Silence allows them to focus on the UI changes
- **Tone Shift**: Read experiment prompts slightly slower and with emphasis
  - "Now, **try this**: increase Contact Frequency to 10–100..."
  - Signals to viewer that interaction is expected
- **Return Cue**: After pause, resume with "Notice how..." or "See how..."
  - Helps viewer transition back from interaction to listening

### Screen Recording Considerations
- **Cursor Movement**: During the 8–10 second pause, demonstrate the interaction
  - Click the factor to expand
  - Adjust the lambda input values
  - Show the risk curve updating
- **Reset Action**: If `resetAfter: true`, show clicking the reset button before continuing
  - This models the full interaction cycle for viewers

### Script Timing
- Experiment segments add 15–25 seconds to overall chapter time
- 3–4 experiments per tutorial = 60–100 seconds total addition
- Factor this into total tutorial duration estimates

## File Naming Conventions

### Audio Files (Per Tutorial)
```
docs/tutorials/audio/{tutorial-id}/
  chapter-1.mp3
  chapter-2.mp3
  chapter-3.mp3
  chapter-4.mp3
  full-tutorial.mp3  (concatenated chapters for single-file playback)
```

### Video Files (Screen Recording)
```
docs/tutorials/video/{tutorial-id}/
  full-recording.mp4  (30–45 minutes with pauses and setup)
  edited-final.mp4    (12–20 minutes polished tutorial)
```

### Script Files (Markdown)
```
docs/tutorials/{tutorial-id}-script.md
```

## Accessibility

### Transcripts
- Each tutorial script markdown file serves as the official transcript
- Publish transcripts alongside video/audio for accessibility compliance
- Include timestamps for chapter breaks: `[00:00] Chapter 1: Understanding Frequency`

### Closed Captions
- Generate captions from transcript
- Sync to video using caption editing software (Subtitle Edit, Aegisub)
- Format: WebVTT or SRT
- Include speaker labels if multiple voices (though tutorials use single narrator)

## Quality Assurance Checklist

Before marking a tutorial recording as complete, verify:

- [ ] Audio meets -16 LUFS integrated loudness standard
- [ ] True peak never exceeds -1.0 dBTP
- [ ] No background noise exceeding -60 dB
- [ ] Pacing is 120–140 words per minute (natural, not rushed)
- [ ] All technical terms pronounced correctly and consistently
- [ ] Experiment pauses are 8–10 seconds (viewer can interact)
- [ ] Room tone used to smooth transitions (no jarring silence cuts)
- [ ] No mouth clicks, plosives, or excessive breaths
- [ ] Transcript matches audio exactly (for accessibility)
- [ ] File names follow naming convention
- [ ] All 4 chapters recorded for tutorial
- [ ] Full tutorial duration matches estimate (±2 minutes acceptable)

## Tutorial Recording Order

Recommended recording order (beginner → intermediate → advanced):

1. **Beginner** (practice, establish pacing)
   - Brute Force (12 min)
   - Phishing (12 min)
   - S3 Misconfiguration (12 min)

2. **Intermediate** (confidence, consistent quality)
   - Ransomware (15 min) [reference implementation, record first if preferred]
   - Laptop Theft (15 min)
   - DDoS (15 min)
   - CRM Outage (15 min)
   - Insider Threat (15 min)
   - Legacy System (15 min)

3. **Advanced** (final polish, highest complexity)
   - Regulatory Audit Failure (18 min)
   - Cloud KMS Compromise (20 min)
   - APT IP Theft (18 min)

**Total Recording Time Estimate**: 180–200 minutes of final content
**Production Time Estimate**: 40–60 hours (including retakes, editing, QA)

## Tips for Voice Talent

### Vocal Health
- **Hydration**: Drink water throughout (room temperature, no ice)
- **Rest**: Take 10-minute breaks every 30 minutes of recording
- **Avoid**: Dairy, caffeine, alcohol 2 hours before recording (increases mucus)
- **Warm-Up**: Lip trills, tongue twisters, humming before each session

### Delivery
- **Smile**: Smiling while speaking makes voice sound more engaging
- **Stand**: Standing or sitting upright improves breath support
- **Gesticulate**: Natural hand gestures while speaking improve vocal energy
- **Visualize**: Imagine explaining to a real person, not reading to a microphone

### Common Mistakes to Avoid
- **Monotone**: Vary pitch and energy to maintain listener interest
- **Rushing**: Beginners often rush through technical content (slow down!)
- **Mispronunciations**: Mark and practice difficult terms beforehand
  - FAIR (rhymes with "care," not "fire")
  - PERT (rhymes with "hurt")
  - SLEF (S-L-E-F, each letter pronounced, or "slef" like "clef")
  - TCap (T-Cap, not "tee-cap")
- **Inconsistency**: If you pronounce "GDPR" as letters in Chapter 1, do it in all chapters

## Post-Recording Integration

After all 12 tutorials are recorded and edited:

1. **Upload**: Host audio/video files on CDN or video platform (YouTube, Vimeo)
2. **Integrate**: Add audio player or video embed to tutorial UI
3. **Sync**: Ensure voiceover timing matches on-screen tutorial step transitions
4. **Test**: Have 3–5 external users complete one tutorial with voiceover, collect feedback
5. **Iterate**: Adjust pacing, pauses, or re-record segments based on feedback

## Contact

For questions about this recording guide or tutorial production:
- **Technical**: [Production team contact]
- **Content**: [FAIR Calculator development team]

---

**Last Updated**: 2026-03-12
**Version**: 1.0
