# CL-B · 3D Scroll Journey · Video Prompts

**Length:** 5 scenes × 8s (one continuous camera flight, cut into 5 clips)
**Format:** 16:9 · 1920×1080 · 24 or 30 fps (optional second pass in 9:16 1080×1920 for phones)
**Tools:** Nano Banana / Imagen 4 for the start and end frames → Veo 3 in Flow, **Frames to Video** (set both the first and last frame)
**Where it plays:** CL-B homepage hero. Scrolling scrubs the video frame by frame (Apple-style). Chapter text is HTML on top, so **the video must contain no text, logos or captions.**

## Rules for scroll-scrub video (read first)

1. **One unbroken camera move per clip.** No cuts, no fades, no speed ramps. Scrubbing exposes every jump.
2. **Chain the clips.** The *last frame* of each scene is the *first frame* of the next. Generate the end frame image, then reuse it as the next scene's start image.
3. **Slow, steady, forward motion.** Think drone at walking pace. Fast motion turns to mush when scrubbed.
4. **Locked style across all scenes:** "photoreal cinematic, Canadian Rockies, soft volumetric light, 35mm, shallow haze, rich but natural colour, no people's faces close to camera."
5. **No text, no logos, no watermarks, no UI.**
6. Copy rule for the overlay text (already on the site): no dashes, no stats, no ratings, no client claims.

---

## SCENE 1 — Arrival (0 to 8 s)

**On-screen text (site overlay, already built):** 01 · Arrival · *Dawn breaks over the range*

**Image prompt (start frame):**
Photoreal aerial view at dawn, high above a glacier-carved valley in the Canadian Rockies, jagged snow-capped peaks on both sides, a long turquoise lake far below in the valley floor, soft pink and amber first light hitting the summits, low mist in the valley, dark pine forests on the lower slopes, cinematic 35mm, volumetric light, no people, no text, 16:9.

**Image prompt (end frame = Scene 2 start):**
Same valley and lighting, camera now much lower, about 60 m above the lake's near shore, looking straight along the lake toward distant peaks, morning mist lifting off glassy turquoise water, pine forest on both shores, warm sunrise light, photoreal cinematic, no text, 16:9.

**Veo motion prompt:**
Slow, smooth drone descent from high above the peaks down into the valley toward the lake, gentle forward glide with no rotation, mist drifting softly, sunlight slowly spreading across the summits, constant speed, one continuous shot, no cuts. Sound: soft wind and distant birds.

**Edit note:** Keep camera roll at 0°. If Veo adds a turn, regenerate.

---

## SCENE 2 — The Lake (8 to 16 s)

**On-screen text:** 02 · The Lake · *Glide across glass-still water*

**Image prompt (start frame):** use Scene 1 end frame.

**Image prompt (end frame = Scene 3 start):**
Low drone shot 8 m above a mirror-still turquoise mountain lake, mid-morning light, perfect reflections of snowy peaks and pines in the water, a lone red canoe far ahead near the right shore, a timber lodge with a wooden dock just visible on the right shoreline in the distance, photoreal cinematic, no text, 16:9.

**Veo motion prompt:**
Smooth low glide forward over the lake surface, camera slowly descending to just above the water, tiny ripples, reflections shimmering, a canoe drifting gently in the distance, bank slightly toward the right shore where a lodge appears, constant slow speed, one continuous shot. Sound: gentle water lapping, paddle dips.

---

## SCENE 3 — The Lodge (16 to 24 s)

**On-screen text:** 03 · The Lodge · *Warm timber, open fires* (site shows a "Book the lodge" button here)

**Image prompt (start frame):** use Scene 2 end frame.

**Image prompt (end frame = Scene 4 start):**
Golden-hour view of a luxury timber lodge on a lakeshore in the Canadian Rockies, warm light glowing from tall windows, a wooden deck with lanterns and a stone fire pit with a small fire, Adirondack chairs, pine trees around, sun just setting behind the peaks casting orange and rose light, photoreal cinematic, no people's faces, no text, 16:9.

**Veo motion prompt:**
Camera glides from over the water toward the shore and slowly arcs around the lodge's deck, warm window lights flickering on, lantern glow, fire crackling in the fire pit, light shifts from late afternoon to golden hour, steady slow movement, one continuous shot. Sound: crackling fire, soft distant laughter, cutlery clinks.

**Edit note:** Optional: background guests are fine if small and out of focus. Avoid close-up faces (AI faces read as fake).

---

## SCENE 4 — Aurora (24 to 32 s)

**On-screen text:** 04 · Aurora · *The sky comes alive* (site shows "Get aurora alerts")

**Image prompt (start frame):** use Scene 3 end frame.

**Image prompt (end frame = Scene 5 start):**
Night over the same mountain lake: vivid green and violet northern lights rippling across a starry sky above dark peaks, the aurora reflected in the still lake, the timber lodge glowing warm amber on the right shore, a few glass-dome cabins lit softly near the trees, photoreal cinematic long-exposure look, no text, 16:9.

**Veo motion prompt:**
Camera slowly tilts up and rises from the lodge deck toward the sky as dusk turns to night, stars appear, northern lights fade in and begin to ripple and dance, reflections shimmering on the lake, lodge windows glowing below, very slow steady rise, one continuous shot. Sound: quiet night ambience, soft wind, a low musical swell.

---

## SCENE 5 — Gather (32 to 40 s)

**On-screen text:** 05 · Gather · *Bring your people* (site shows "Plan a group journey")

**Image prompt (start frame):** use Scene 4 end frame.

**Image prompt (end frame):**
Wide high aerial at night of the whole valley: aurora overhead, the lodge and a ring of warm-lit cabins around a lakeside fire circle where a small group gathers (tiny figures, no faces visible), lanterns along a path, peaks silhouetted against the aurora, photoreal cinematic, no text, 16:9.

**Veo motion prompt:**
Camera rises and pulls back into a slow wide aerial, revealing the lodge, cabins and a lakeside fire circle with a small group gathered, aurora flowing overhead, lantern path glowing, smooth constant pull-back, ends on a calm wide hold, one continuous shot. Sound: crowd murmur fading into music.

---

## End card

None in the video. The site's own "Your next journey starts here" section follows the scroll journey.

## Edit and export checklist

1. Put the 5 clips in order in CapCut or Premiere. Trim so each join is the matching frame (no duplicated frame, no gap).
2. Optional 2 to 4 frame cross-dissolve at the joins only if colour shifts slightly.
3. Colour-match all 5 clips (same LUT). Export one **MP4, 1920×1080, H.264, 30 fps** as `journey.mp4`.
4. Send `journey.mp4` back. I'll extract the frames and install them in the site.
   If you want to do it yourself (needs ffmpeg):
   ```bash
   ffmpeg -i journey.mp4 -vf "fps=30,scale=1600:-1" -c:v libwebp -quality 72 frames/s1/%04d.webp
   ```
   Then set `projects/cl-b/public/frames/manifest.json` to
   `{ "scenes": [ { "path": "frames/s1/", "count": <number of files>, "ext": "webp", "pad": 4 } ] }`
5. The homepage detects the frames and switches to **Cinematic** mode automatically. A toggle lets visitors switch back to **Real-time 3D**.

## Best-in-class references for this style

Apple product pages (scroll-scrubbed image sequences), Lusion and Active Theory (WebGL storytelling), and Awwwards Sites of the Day in the "3D" and "scrolling" categories. Use them for pacing and polish only. Our scenes, copy and visuals are original.
