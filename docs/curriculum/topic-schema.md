# Topic module schema

Every ClassOS chapter topic is packaged as a data-driven module. Curriculum changes update manifests; engines stay stable.

## Required fields

```json
{
  "id": "math.10.quadratic-equations.discriminant",
  "subject": "mathematics",
  "classLevel": 10,
  "chapter": "Quadratic Equations",
  "topic": "Nature of roots / discriminant",
  "syllabusYear": "2025-26",
  "status": "planned",
  "studentInput": {
    "touch": ["drag parabola coeffs", "slider for a,b,c"],
    "pointerKeyboard": ["type a,b,c", "arrow-adjust focused slider"]
  },
  "boardResponse": "Parabola with live discriminant; nature of roots updates",
  "understandingGoal": "Why the formula works and what the discriminant means",
  "modes": ["see", "predict", "build", "derive", "solve", "check"],
  "misconceptions": [
    {
      "error": "Discriminant only tells number of roots, not nature",
      "demo": "Slider across D>0, D=0, D<0 with root markers"
    }
  ],
  "engines": ["cas", "graph"],
  "goldenTests": ["ncert.ex.4.3.q1", "cbse.2024.set1.q..."],
  "languages": ["en", "hi"]
}
```

## Pedagogical contract

For each topic the product must state three things:

1. **Student input** — how the learner drives the demo on touch and on mouse/keyboard (both required).
2. **Board response** — live demonstration, simulation, or solver that opens.
3. **Understanding goal** — concept or misconception the demo is designed to fix.

## Universal modes

| Mode | Behaviour |
| --- | --- |
| See it | Clean visual with no numbers |
| Predict | Freeze; student picks an outcome; then reveal |
| Build it | Student changes values and watches the effect |
| Derive it | Formula built step by step from the demonstration |
| Solve it | Worked example in CBSE answer format with marks per step |
| Check it | Auto-generated questions from the exact widget state |

## Ship gate per chapter

A chapter does not ship until:

1. Current CBSE syllabus validation is recorded for that chapter.
2. Every NCERT worked example and tagged exercise in the golden set passes.
3. Two-path verification has no unresolved disagreements on golden items.
4. A CBSE-experienced subject teacher has reviewed pedagogy and misconception cards.
5. Assumption banners / scope refusals are present where required.
6. Touch and non-touch paths for required interactions are verified in QA (phone + laptop).
